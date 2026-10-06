import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, Trash2, Camera } from 'lucide-react';
import { KalliColorway } from '../types';
import { KalliSneakerIllustration } from './KalliSneakerIllustration';
import { getAllShoeImages, saveShoeImage, removeShoeImage, optimizeImageDataUrl } from '../utils/imageStorage';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorway: KalliColorway;
  onSelectAngle: (angle: 'side' | 'front' | 'perspective' | 'top' | 'rear' | 'sole') => void;
  isAdminMode?: boolean;
  onOpenUploadModal?: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  colorway,
  onSelectAngle,
  isAdminMode = false,
  onOpenUploadModal,
}) => {
  const [images, setImages] = useState<Record<string, string | null>>({
    side: null,
    front: null,
    perspective: null,
    top: null,
    rear: null,
    sole: null,
  });

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load custom images from IndexedDB on open for the specific colorway
  useEffect(() => {
    if (isOpen) {
      loadAllImages();
    }
  }, [isOpen, colorway.id]);

  const loadAllImages = async () => {
    try {
      const loaded = await getAllShoeImages(colorway.id);
      setImages(loaded);
    } catch {}
  };

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleFileUpload = async (file: File, angleId: string) => {
    if (!file || !file.type.startsWith('image/')) return;

    try {
      const optimized = await optimizeImageDataUrl(file);
      if (optimized) {
        await saveShoeImage(angleId, optimized, colorway.id);
        setImages((prev) => ({ ...prev, [angleId]: optimized }));
        showNotification(`${angleId.toUpperCase()} ছবি সেভ হয়েছে`);
      }
    } catch (err) {
      console.error('Error saving image:', err);
    }
  };

  const handleClearImage = async (e: React.MouseEvent, angleId: string) => {
    e.stopPropagation();
    await removeShoeImage(angleId, colorway.id);
    setImages((prev) => ({ ...prev, [angleId]: null }));
    showNotification(`${angleId.toUpperCase()} ছবি রিমুভ করা হয়েছে`);
  };

  const angles: {
    id: 'side' | 'front' | 'perspective' | 'top' | 'rear' | 'sole';
    label: string;
    desc: string;
  }[] = [
    {
      id: 'side',
      label: 'Lateral Profile View (Main Image)',
      desc: 'Dual visible air capsules, white sculpted foam, and aerodynamic racing stripes',
    },
    {
      id: 'front',
      label: 'Front Elevation View',
      desc: 'Direct head-on view with rubber toe bumper and symmetrical eyelets',
    },
    {
      id: 'perspective',
      label: '3/4 Perspective Angle',
      desc: 'Ergonomic toe spring, adaptive knit contours, and athletic silhouette',
    },
    {
      id: 'top',
      label: 'Aerial Insole & Laces View',
      desc: 'Breathable engineered honeycomb mesh and branded cushioned sockliner',
    },
    {
      id: 'rear',
      label: 'Rear Air Pods & Pull Tab',
      desc: 'Dual pressurized air units, TPU heel counter, and woven pull tab',
    },
    {
      id: 'sole',
      label: 'Carbon Rubber Tread Outsole',
      desc: 'Multidirectional wave flex grooves and high-abrasion traction pods',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Hidden file inputs for admin mode */}
      {isAdminMode &&
        angles.map((a) => (
          <input
            key={`input-${a.id}`}
            ref={(el) => {
              inputRefs.current[a.id] = el;
            }}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], a.id);
              }
            }}
          />
        ))}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              High-Definition Product Angles
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-brand-display">
              Comprehensive Gallery (All 6 Views)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Upload button */}
            <button
              onClick={() => {
                if (onOpenUploadModal) {
                  onClose();
                  onOpenUploadModal();
                } else {
                  inputRefs.current['side']?.click();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Upload custom shoe photos"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Photos</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Feedback Toast */}
        {feedbackMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMsg}</span>
            </div>
          </div>
        )}

        {/* Info Subtitle */}
        <div className="mt-3 text-xs text-neutral-500">
          Select any angle to view on the main presentation stage, or click hover to upload photos:
        </div>

        {/* Gallery Grid for All 6 Angles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 py-5">
          {angles.map((a) => {
            const activeCustomImg = images[a.id];

            return (
              <div
                key={a.id}
                onClick={() => {
                  onSelectAngle(a.id);
                  onClose();
                }}
                className="group p-4 bg-neutral-50/70 hover:bg-white rounded-xl border border-neutral-200/70 hover:border-neutral-950 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                {/* Upload Status Badge */}
                {activeCustomImg && (
                  <div className="absolute top-2 left-2 z-10 bg-neutral-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    <span>User Upload</span>
                  </div>
                )}

                {/* Sneaker Preview Display */}
                <div className="h-44 flex items-center justify-center p-3 bg-white rounded-lg border border-neutral-100 shadow-2xs group-hover:scale-102 transition-transform relative overflow-hidden">
                  {activeCustomImg ? (
                    <img
                      src={activeCustomImg}
                      alt={a.label}
                      className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
                    />
                  ) : (
                    <div className="scale-95">
                      <KalliSneakerIllustration colorway={colorway} viewAngle={a.id} />
                    </div>
                  )}

                  {/* Upload Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-neutral-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRefs.current[a.id]?.click();
                      }}
                      className="px-3 py-1.5 bg-white text-neutral-900 rounded-lg text-xs font-bold shadow-md hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
                      title="Upload or change image file for this position"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{activeCustomImg ? 'Change' : 'Upload'}</span>
                    </button>

                    {activeCustomImg && (
                      <button
                        onClick={(e) => handleClearImage(e, a.id)}
                        className="p-1.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Info */}
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors">
                    {a.label}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {a.desc}
                  </p>

                  {/* Admin mode bottom actions */}
                  {isAdminMode && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          inputRefs.current[a.id]?.click();
                        }}
                        className="text-[11px] font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 transition-colors"
                      >
                        <Upload className="w-3 h-3 text-amber-500" />
                        <span>{activeCustomImg ? 'Replace' : 'Upload'}</span>
                      </button>

                      {activeCustomImg && (
                        <button
                          onClick={(e) => handleClearImage(e, a.id)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          রিমুভ
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Click any angle to view in 4K resolution
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
