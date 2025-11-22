import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, Trash2, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { fetchExtinguishers } from '../lib/api';
import type { Extinguisher } from '../types';

interface QrCodeItem {
  id: string;
  label: string;
  data: string;
  dataUrl: string;
}

interface QrCodesPageProps {
  primaryColor: string;
}

const QrCodesPage: React.FC<QrCodesPageProps> = ({ primaryColor }) => {
  // QR Generation Settings
  const [size, setSize] = useState(300);
  const [scale, setScale] = useState(2);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState(4);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  // Manual generation
  const [manualText, setManualText] = useState('');

  // Batch generation
  const [prefix, setPrefix] = useState('QR-');
  const [startNum, setStartNum] = useState(1);
  const [endNum, setEndNum] = useState(10);
  const [suffix, setSuffix] = useState('');
  const [padding, setPadding] = useState(3);

  // Extinguisher selection
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [selectedExtinguishers, setSelectedExtinguishers] = useState<string[]>([]);

  // Generated QR codes
  const [qrCodes, setQrCodes] = useState<QrCodeItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadExtinguishers();
  }, []);

  const loadExtinguishers = async () => {
    try {
      const data = await fetchExtinguishers();
      setExtinguishers(data);
    } catch (error) {
      console.error('Failed to load extinguishers:', error);
    }
  };

  const generateQrCodeDataUrl = async (text: string, label: string): Promise<QrCodeItem> => {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: errorCorrection,
      width: size * scale,
      margin,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    });

    return {
      id: `qr-${Date.now()}-${Math.random()}`,
      label,
      data: text,
      dataUrl,
    };
  };

  const handleGenerateManual = async () => {
    if (!manualText.trim()) {
      alert('Please enter text or URL');
      return;
    }

    setIsGenerating(true);
    try {
      const qr = await generateQrCodeDataUrl(manualText, manualText);
      setQrCodes([qr]);
    } catch (error) {
      alert('Failed to generate QR code');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBatch = async () => {
    if (isNaN(startNum) || isNaN(endNum) || endNum < startNum) {
      alert('Please enter valid start and end numbers');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const codes: QrCodeItem[] = [];

    try {
      const count = endNum - startNum + 1;
      for (let i = 0; i < count; i++) {
        const num = String(startNum + i).padStart(padding, '0');
        const text = `${prefix}${num}${suffix}`;
        const qr = await generateQrCodeDataUrl(text, text);
        codes.push(qr);
        setProgress(((i + 1) / count) * 100);
      }
      setQrCodes(codes);
    } catch (error) {
      alert('Failed to generate batch QR codes');
      console.error(error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const formatExtinguisherData = (ext: Extinguisher): string => {
    // Generate URL to public verification page
    const frontendUrl = window.location.origin; // Gets http://localhost:5173
    return `${frontendUrl}/verify/${ext.id}`;
  };

  const handleGenerateExtinguishers = async () => {
    if (selectedExtinguishers.length === 0) {
      alert('Please select at least one extinguisher');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const codes: QrCodeItem[] = [];

    try {
      const selected = extinguishers.filter((e) => selectedExtinguishers.includes(e.id));
      for (let i = 0; i < selected.length; i++) {
        const ext = selected[i];
        const data = formatExtinguisherData(ext);
        const label = `${ext.id} - ${ext.location}`;
        const qr = await generateQrCodeDataUrl(data, label);
        codes.push(qr);
        setProgress(((i + 1) / selected.length) * 100);
      }
      setQrCodes(codes);
    } catch (error) {
      alert('Failed to generate extinguisher QR codes');
      console.error(error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownloadAll = async () => {
    if (qrCodes.length === 0) {
      alert('No QR codes to download');
      return;
    }

    const zip = new JSZip();

    for (const qr of qrCodes) {
      const base64Data = qr.dataUrl.split(',')[1];
      const filename = sanitizeFilename(qr.label);
      zip.file(`${filename}.png`, base64Data, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-codes-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (qrCodes.length === 0) {
      alert('No QR codes to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Print QR Codes</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: system-ui; margin: 0; padding: 12mm; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10mm; }
            figure { margin: 0; text-align: center; break-inside: avoid; }
            img { max-width: 100%; }
            figcaption { font-size: 10pt; margin-top: 4pt; word-break: break-word; }
          </style>
        </head>
        <body>
          <div class="grid">
            ${qrCodes
              .map(
                (qr) => `
              <figure>
                <img src="${qr.dataUrl}" alt="QR Code">
                <figcaption>${escapeHtml(qr.label)}</figcaption>
              </figure>
            `
              )
              .join('')}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadSingle = (qr: QrCodeItem) => {
    const a = document.createElement('a');
    a.href = qr.dataUrl;
    a.download = `${sanitizeFilename(qr.label)}.png`;
    a.click();
  };

  const handleClear = () => {
    setQrCodes([]);
    setSelectedExtinguishers([]);
  };

  const toggleExtinguisherSelection = (id: string) => {
    setSelectedExtinguishers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllExtinguishers = () => {
    setSelectedExtinguishers(extinguishers.map((e) => e.id));
  };

  const deselectAllExtinguishers = () => {
    setSelectedExtinguishers([]);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white shadow rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold">QR Code Generator</h2>

        {/* Settings */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium">Preview Size</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={200}>200px</option>
              <option value={300}>300px</option>
              <option value={400}>400px</option>
              <option value={500}>500px</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Export Scale</label>
            <select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={1}>1× (screen)</option>
              <option value={2}>2× (print ok)</option>
              <option value={3}>3×</option>
              <option value={4}>4× (high DPI)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Error Correction</label>
            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="L">L (smallest)</option>
              <option value="M">M (default)</option>
              <option value="Q">Q</option>
              <option value="H">H (best)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Margin (modules)</label>
            <select
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Foreground Color</label>
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Background Color</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Manual Generation */}
        <div className="p-4 mb-6 border border-gray-200 rounded-lg">
          <h3 className="mb-3 text-lg font-semibold">Manual Generation</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Enter text or URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleGenerateManual}
              disabled={isGenerating}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white' ? primaryColor : '#7c3aed',
                color: '#ffffff'
              }}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Batch Generation */}
        <div className="p-4 mb-6 border border-gray-200 rounded-lg">
          <h3 className="mb-3 text-lg font-semibold">Batch Generation (Sequential)</h3>
          <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-5">
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Prefix"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              value={startNum}
              onChange={(e) => setStartNum(Number(e.target.value))}
              placeholder="Start"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              value={endNum}
              onChange={(e) => setEndNum(Number(e.target.value))}
              placeholder="End"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              placeholder="Suffix"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={0}>No padding</option>
              <option value={2}>2 digits</option>
              <option value={3}>3 digits</option>
              <option value={4}>4 digits</option>
            </select>
          </div>
          <button
            onClick={handleGenerateBatch}
            disabled={isGenerating}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white' ? primaryColor : '#7c3aed',
              color: '#ffffff'
            }}
          >
            Generate Batch
          </button>
        </div>

        {/* Extinguisher Selection */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Generate from Extinguishers</h3>
            <div className="space-x-2">
              <button
                onClick={selectAllExtinguishers}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Select All
              </button>
              <button
                onClick={deselectAllExtinguishers}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="mb-3 overflow-y-auto max-h-64">
            {extinguishers.map((ext) => (
              <label
                key={ext.id}
                className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedExtinguishers.includes(ext.id)}
                  onChange={() => toggleExtinguisherSelection(ext.id)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">{ext.id}</div>
                  <div className="text-sm text-gray-500">
                    {ext.location} - {ext.building}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleGenerateExtinguishers}
            disabled={isGenerating || selectedExtinguishers.length === 0}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white' ? primaryColor : '#7c3aed',
              color: '#ffffff'
            }}
          >
            Generate Selected ({selectedExtinguishers.length})
          </button>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mt-4">
            <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  backgroundColor: primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white' ? primaryColor : '#7c3aed',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {qrCodes.length > 0 && (
        <div className="p-6 bg-white shadow rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Generated QR Codes ({qrCodes.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Download size={18} /> Download All (ZIP)
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Printer size={18} /> Print Sheet
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <Trash2 size={18} /> Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="p-4 border border-gray-200 rounded-lg">
                <img src={qr.dataUrl} alt={qr.label} className="w-full mb-2" />
                <div className="mb-2 text-sm text-gray-600">{qr.label}</div>
                <button
                  onClick={() => handleDownloadSingle(qr)}
                  className="w-full px-3 py-1 text-sm text-white rounded hover:opacity-90"
                  style={{
                    backgroundColor: primaryColor && primaryColor !== '#ffffff' && primaryColor !== '#fff' && primaryColor !== 'white' ? primaryColor : '#7c3aed',
                    color: '#ffffff'
                  }}
                >
                  <Download size={14} className="inline mr-1" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function sanitizeFilename(filename: string): string {
  return filename.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 120) || 'qr-code';
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default QrCodesPage;
