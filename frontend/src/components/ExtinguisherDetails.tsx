import React, { useState, useEffect, useRef } from 'react';
import type { Extinguisher } from '../types';
import { Pencil, FileText, Award, Download, Upload, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { generateExtinguisherHistoryPDF, generateComplianceCertificate, downloadExtinguisherExcel } from '../api/reports';
import { uploadPhoto, fetchExtinguisherPhotos, deletePhoto, deleteExtinguisher, type InspectionPhoto } from '../lib/api';

type Props = {
  open: boolean;
  onClose: () => void;
  data: Extinguisher | null;
  primaryColor?: string; // brand color for status badge
  onEdit?: (extinguisher: Extinguisher) => void; // callback to open edit modal
  onDelete?: (id: string) => void; // callback when extinguisher is deleted
};

// --- helpers ---
const safe = (v?: React.ReactNode) => (v === undefined || v === null || v === '' ? '—' : v);

const formatDate = (d?: string) => {
  if (!d) return '—';
  // Keep ISO if it already looks like YYYY-MM-DD, otherwise try a readable format
  if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? safe(d) : dt.toISOString().slice(0, 10);
};

const conditionTone = (condition?: string) => {
  switch ((condition || '').toLowerCase()) {
    case 'excellent':
    case 'good':
      return 'text-green-700';
    case 'fair':
      return 'text-amber-700';
    case 'needs attention':
      return 'text-orange-700';
    case 'out of service':
      return 'text-red-700';
    default:
      return 'text-gray-700';
  }
};

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex gap-2 text-sm">
    <div className="w-40 text-gray-600 shrink-0">{label}</div>
    <div className="font-medium text-gray-900">{safe(value)}</div>
  </div>
);

const Section: React.FC<{ title: string; className?: string; children?: React.ReactNode }> = ({
  title,
  className,
  children,
}) => (
  <section className={`rounded-xl p-4 ${className ?? ''}`}>
    <h4 className="mb-3 text-sm font-semibold text-gray-700">{title}</h4>
    <div className="space-y-2">{children}</div>
  </section>
);

const ExtinguisherDetails: React.FC<Props> = ({ open, onClose, data, primaryColor = '#7c3aed', onEdit, onDelete }) => {
  const [loadingReport, setLoadingReport] = useState<string | null>(null);
  const [photos, setPhotos] = useState<InspectionPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos when modal opens
  useEffect(() => {
    if (open && data) {
      loadPhotos();
    }
  }, [open, data?.id]);

  const loadPhotos = async () => {
    if (!data) return;
    try {
      const fetchedPhotos = await fetchExtinguisherPhotos(data.id);
      console.log('Loaded photos:', fetchedPhotos);
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !data) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const newPhoto = await uploadPhoto({
        file,
        extinguisherId: data.id,
      });
      console.log('Uploaded photo:', newPhoto);
      setPhotos(prev => [newPhoto, ...prev]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete photo');
    }
  };

  const handleDeleteExtinguisher = async () => {
    if (!data) return;

    const confirmMessage = `Are you sure you want to delete this extinguisher?\n\nLocation: ${data.location}\nBuilding: ${data.building}\nType: ${data.type}\n\nThis action cannot be undone.`;
    if (!confirm(confirmMessage)) return;

    try {
      setDeleting(true);
      await deleteExtinguisher(data.id);
      if (onDelete) {
        onDelete(data.id);
      }
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to delete extinguisher');
    } finally {
      setDeleting(false);
    }
  };

  if (!open || !data) return null;

  // Determine if primary color is effectively white
  const isWhitePrimary =
    !primaryColor ||
    primaryColor === '#ffffff' ||
    primaryColor === '#fff' ||
    primaryColor === 'white' ||
    primaryColor === '#FFFFFF' ||
    primaryColor === '#FFF' ||
    primaryColor.match(/^rgba?\(255,\s*255,\s*255/);

  const effectiveColor = isWhitePrimary ? '#7c3aed' : primaryColor;

  const handleGenerateHistory = async () => {
    try {
      setLoadingReport('history');
      const { pdfUrl } = await generateExtinguisherHistoryPDF(data.id);
      window.open(pdfUrl, '_blank');
    } catch (error: any) {
      alert(error.message || 'Failed to generate history report');
    } finally {
      setLoadingReport(null);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setLoadingReport('certificate');
      const { pdfUrl } = await generateComplianceCertificate(data.id);
      window.open(pdfUrl, '_blank');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate certificate';
      // Show user-friendly message
      if (errorMessage.includes('No inspection')) {
        alert('⚠️ No inspection records found.\n\nPlease complete at least one inspection for this extinguisher before generating a compliance certificate.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoadingReport(null);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setLoadingReport('excel');
      await downloadExtinguisherExcel(data.id);
    } catch (error: any) {
      alert(error.message || 'Failed to download Excel file');
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-3xl overflow-hidden bg-white shadow-xl rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">Extinguisher Details — {safe(data.id)}</h3>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic */}
          <Section title="Basic Information">
            <Row label="Type" value={data.type} />
            <Row label="Capacity" value={data.capacity} />
            <Row label="Weight" value={data.weight} />
            <Row label="Manufacturer" value={data.manufacturer} />
            <Row label="Model" value={data.model} />
            <Row label="Serial Number" value={data.serialNumber} />
          </Section>

          {/* Location */}
          <Section title="Location" className="bg-blue-50">
            <Row label="Location" value={data.location} />
            <Row label="Building" value={data.building} />
            <Row label="Floor" value={data.floor} />
          </Section>

          {/* Service / Inspection */}
          <Section title="Service & Inspection" className="bg-green-50">
            <Row label="Last Service Date" value={formatDate(data.lastMaintenance)} />
            <Row label="Next Service Date" value={formatDate(data.nextMaintenance)} />
            <Row label="Last Extended Inspection" value={formatDate(data.lastInspection)} />
            <Row label="Next Extended Inspection" value={formatDate(data.nextInspection)} />
            <Row label="Commission Date" value={formatDate(data.installDate)} />
            <Row label="Expiry Date" value={formatDate(data.expiryDate)} />
            {/* Optional service type if you store it */}
            {'serviceType' in data && <Row label="Service Type" value={(data as any).serviceType} />}
          </Section>

          {/* Status */}
          <Section title="Status & Condition" className="bg-amber-50">
            <Row
              label="Status"
              value={
                <span
                  className="px-2 py-1 text-xs text-white rounded-full"
                  style={{ backgroundColor: effectiveColor }}
                >
                  {safe(data.status)}
                </span>
              }
            />
            <Row
              label="Condition"
              value={<span className={`font-semibold ${conditionTone(data.condition)}`}>{safe(data.condition)}</span>}
            />
            <Row label="Inspector" value={data.inspector} />
          </Section>

          {/* Notes */}
          <Section title="Notes">
            <div className="p-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg">
              {safe(data.notes)}
            </div>
          </Section>

          {/* Photo Gallery */}
          <Section title="Photos" className="bg-blue-50">
            <div className="flex items-center gap-3 mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: effectiveColor }}
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <span className="text-xs text-gray-600">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </span>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Extinguisher photo'}
                      className="object-cover w-full h-32 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(photo.url)}
                      onError={(e) => {
                        console.error('Failed to load image:', photo.url);
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                      aria-label="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                    {photo.caption && (
                      <p className="mt-1 text-xs text-gray-600 truncate">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                <ImageIcon size={48} className="mb-2 text-gray-300" />
                <p className="text-sm">No photos yet</p>
                <p className="text-xs">Click "Upload Photo" to add images</p>
              </div>
            )}
          </Section>

          {/* Reports */}
          <Section title="Generate Reports" className="bg-purple-50">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={handleGenerateHistory}
                disabled={loadingReport !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: effectiveColor }}
              >
                <FileText size={18} />
                {loadingReport === 'history' ? 'Generating...' : 'Full History PDF'}
              </button>

              <button
                onClick={handleGenerateCertificate}
                disabled={loadingReport !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Award size={18} />
                {loadingReport === 'certificate' ? 'Generating...' : 'Certificate'}
              </button>

              <button
                onClick={handleDownloadExcel}
                disabled={loadingReport !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Download size={18} />
                {loadingReport === 'excel' ? 'Downloading...' : 'Excel Export'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Generate comprehensive lifecycle reports, compliance certificates, or export complete history to Excel.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 px-5 py-3 border-t">
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(data);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: effectiveColor }}
              >
                <Pencil size={16} />
                Edit After Service
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteExtinguisher}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ml-auto">
            Close
          </button>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Full size view"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ExtinguisherDetails;
