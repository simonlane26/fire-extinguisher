import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import type { Result } from '@zxing/library';

type Props = {
  onClose: () => void;
  onDetected: (text: string) => void;
};

const QRScanner: React.FC<Props> = ({ onClose, onDetected }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    (async () => {
      try {
        const ctrl = await reader.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: { ideal: 'environment' } }, // prefer rear camera
          },
          videoRef.current!,
          (res: Result | undefined) => {
            if (res) onDetected(res.getText());
          }
        );
        setControls(ctrl);

        // Detect torch support (only on some devices/browsers)
        const stream = videoRef.current?.srcObject;
        if (stream instanceof MediaStream) {
          const track = stream.getVideoTracks()[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const caps: any = track?.getCapabilities?.();
          if (caps && 'torch' in caps) setTorchSupported(!!caps.torch);
        }
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? 'Camera access failed');
      }
    })();

    return () => {
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTorch = async () => {
    try {
      const stream = videoRef.current?.srcObject;
      if (!(stream instanceof MediaStream)) return; // narrow to MediaStream

      const track = stream.getVideoTracks()[0];
      if (!track) return;

      // Torch is not in TS DOM types; use loose typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caps: any = track.getCapabilities?.();
      if (caps?.torch) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (track as any).applyConstraints?.({ advanced: [{ torch: !torchOn }] });
        setTorchOn(v => !v);
      }
    } catch (e) {
      console.warn('Torch not supported or failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-2xl">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Scan QR Code</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        <div className="relative aspect-[3/4] bg-black">
          <video ref={videoRef} className="object-cover w-full h-full" autoPlay playsInline muted />
          <div className="absolute inset-0 m-8 border-2 pointer-events-none border-white/60 rounded-xl" />
        </div>

        {error && <div className="p-3 text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-between gap-2 p-3 border-t">
          <button
            onClick={toggleTorch}
            disabled={!torchSupported}
            className={`px-3 py-2 rounded-lg ${torchSupported ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-200 opacity-50 cursor-not-allowed'}`}
            title={torchSupported ? 'Toggle torch' : 'Torch not supported on this device'}
          >
            {torchOn ? 'Turn Torch Off' : 'Turn Torch On'}
          </button>
          <button
            onClick={() => { controls?.stop(); onClose(); }}
            className="px-3 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
