import React, { useRef, useState, useEffect } from 'react';
import { X, Upload, Check, Trash2, Loader2, Palette } from 'lucide-react';
import {
  saveShoeImage,
  removeShoeImage,
  getAllShoeImages,
  clearAllShoeImages,
  optimizeImageDataUrl,
} from '../utils/imageStorage';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpdated?: () => void;
  initialColorwayId?: string;
}

interface AngleConfig {
  id: 'side' | 'front' | 'perspective' | 'top' | 'rear' | 'sole';
  title: string;
  subtitle: string;
  desc: string;
  recommendedFilename: string;
}

const COLORWAYS = [
  { id: 'orange', name: 'Mustard Ochre & White', hex: '#e5a13c', isTarget: true },
  { id: 'blue', name: 'Deep Royal Navy & White Air', hex: '#1a367c', isTarget: false },
];

const ALL_ANGLES: AngleConfig[] = [
  {
    id: 'side',
    title: 'Lateral Profile View (Main Image)',
    subtitle: 'Side View',
    desc: 'Dual visible air capsules, white sculpted foam, and aerodynamic racing stripes',
    recommendedFilename: 'Mustard sneaker side cutout.png',
  },
  {
    id: 'front',
    title: 'Front Elevation View',
    subtitle: 'Front View',
    desc: 'Direct head-on view with rubber toe bumper and symmetrical eyelet stripes',
    recommendedFilename: 'Mustard sneaker front.png',
  },
  {
    id: 'perspective',
    title: '3/4 Perspective Angle',
    subtitle: 'Perspective View',
    desc: 'Ergonomic toe spring and dynamic athletic 3D stance',
    recommendedFilename: 'Mustard sneaker 3-4 perspective.png',
  },
  {
    id: 'top',
    title: 'Aerial Insole & Laces View',
    subtitle: 'Top View',
    desc: 'Breathable engineered honeycomb mesh upper and branded sockliner',
    recommendedFilename: 'Mustard sneaker top insole.png',
  },
  {
    id: 'rear',
    title: 'Rear Air Pods & Pull Tab',
    subtitle: 'Heel View',
    desc: 'Dual pressurized air pods, molded TPU heel counter, and apex woven pull loop',
    recommendedFilename: 'Mustard sneaker rear heel.png',
  },
  {
    id: 'sole',
    title: 'Carbon Rubber Tread Outsole',
    subtitle: 'Sole View',
    desc: 'Wave flex grooves and durable road traction pods on carbon rubber outsole',
    recommendedFilename: 'Mustard sneaker outsole.png',
  },
];

export const UploadImageModal: React.FC<UploadImageModalProps> = ({
  isOpen,
  onClose,
  onImageUpdated,
  initialColorwayId = 'orange',
}) => {
  const [activeColorwayId, setActiveColorwayId] = useState<string>(initialColorwayId);
  const [images, setImages] = useState<Record<string, string | null>>({
    side: null,
    front: null,
    perspective: null,
    top: null,
    rear: null,
    sole: null,
  });

  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isBatchDragOver, setIsBatchDragOver] = useState(false);

  const batchInputRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Sync initial colorway when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveColorwayId(initialColorwayId);
      loadImagesForColorway(initialColorwayId);
    }
  }, [isOpen, initialColorwayId]);

  // Load stored photos from IndexedDB whenever colorway tab changes
  useEffect(() => {
    if (isOpen) {
      loadImagesForColorway(activeColorwayId);
    }
  }, [activeColorwayId]);

  const loadImagesForColorway = async (colorId: string) => {
    try {
      const stored = await getAllShoeImages(colorId);
      setImages(stored);
    } catch (err) {
      console.warn('Failed to load images for colorway:', colorId, err);
    }
  };

  if (!isOpen) return null;

  const showSaveSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSingleUpload = async (file: File, slotId: string) => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsProcessing((prev) => ({ ...prev, [slotId]: true }));
    try {
      const optimizedDataUrl = await optimizeImageDataUrl(file);
      if (optimizedDataUrl) {
        // Save to IndexedDB specifically for this colorway
        await saveShoeImage(slotId, optimizedDataUrl, activeColorwayId);
        setImages((prev) => ({ ...prev, [slotId]: optimizedDataUrl }));
        showSaveSuccess(`"${slotId.toUpperCase()}" photo saved permanently to ${activeColorwayId.toUpperCase()}!`);
        if (onImageUpdated) onImageUpdated();
      }
    } catch (err) {
      console.error('Error saving image:', err);
    } finally {
      setIsProcessing((prev) => ({ ...prev, [slotId]: false }));
    }
  };

  const handleClearSlot = async (slotId: string) => {
    await removeShoeImage(slotId, activeColorwayId);
    setImages((prev) => ({ ...prev, [slotId]: null }));
    showSaveSuccess('Photo removed successfully.');
    if (onImageUpdated) onImageUpdated();
  };

  const handleClearAll = async () => {
    await clearAllShoeImages(activeColorwayId);
    setImages({
      side: null,
      front: null,
      perspective: null,
      top: null,
      rear: null,
      sole: null,
    });
    showSaveSuccess(`All custom photos for ${activeColorInfo.name} removed.`);
    if (onImageUpdated) onImageUpdated();
  };

  const handleBatchFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    for (const file of files) {
      const name = file.name.toLowerCase();
      let targetSlot: string | null = null;

      if (name.includes('front')) targetSlot = 'front';
      else if (name.includes('side') || name.includes('crisp') || name.includes('lateral')) targetSlot = 'side';
      else if (name.includes('perspective') || name.includes('angle') || name.includes('3-4')) targetSlot = 'perspective';
      else if (name.includes('top') || name.includes('insole') || name.includes('aerial')) targetSlot = 'top';
      else if (name.includes('rear') || name.includes('heel') || name.includes('back')) targetSlot = 'rear';
      else if (name.includes('sole') || name.includes('tread') || name.includes('bottom')) targetSlot = 'sole';

      if (!targetSlot) {
        const emptySlot = ALL_ANGLES.find((a) => !images[a.id]);
        targetSlot = emptySlot ? emptySlot.id : 'side';
      }

      await handleSingleUpload(file, targetSlot);
    }
  };

  const activeColorInfo = COLORWAYS.find((c) => c.id === activeColorwayId) || COLORWAYS[0];
  const uploadedCount = Object.values(images).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Hidden Batch Input */}
      <input
        ref={batchInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleBatchFiles(e.target.files);
          }
        }}
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-xs text-white"
              style={{ backgroundColor: activeColorInfo.hex }}
            >
              <Palette className="w-5 h-5 text-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Asset Photo Manager
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  {uploadedCount}/6 Photos Active
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-neutral-900 font-brand-display">
                Upload Photos for {activeColorInfo.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Colorway Selection Bar */}
        <div className="mt-4">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Select target colorway to manage photos:
          </span>
          <div className="mt-1.5 p-1.5 bg-neutral-100 rounded-xl flex items-center gap-1.5 overflow-x-auto">
            {COLORWAYS.map((c) => {
              const isSelected = c.id === activeColorwayId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveColorwayId(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-neutral-900 shadow-xs ring-2 ring-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  <code className="text-[10px] font-mono opacity-60">{c.hex}</code>
                  {c.id === 'orange' && (
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                      #e5a13c
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Toast */}
        {saveSuccessMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Global Batch Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsBatchDragOver(true);
          }}
          onDragLeave={() => setIsBatchDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsBatchDragOver(false);
            if (e.dataTransfer.files) {
              handleBatchFiles(e.dataTransfer.files);
            }
          }}
          onClick={() => batchInputRef.current?.click()}
          className={`mt-4 p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
            isBatchDragOver
              ? 'border-neutral-950 bg-neutral-100 scale-101'
              : 'border-neutral-300 bg-neutral-50/80 hover:border-neutral-900 hover:bg-white'
          }`}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-xs text-white"
            style={{ backgroundColor: activeColorInfo.hex }}
          >
            <Upload className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
              Drag & Drop All {activeColorInfo.name} ({activeColorInfo.hex}) Photos Here
            </h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Drop one or multiple photos to auto-assign slots. Files are saved permanently to <strong>{activeColorInfo.name}</strong>.
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="mt-5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeColorInfo.hex }}
            />
            <span className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
              {activeColorInfo.name} — 6 Available Angles:
            </span>
          </div>
          {uploadedCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove All Photos for this Color</span>
            </button>
          )}
        </div>

        {/* 6 Individual Slots Grid */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ALL_ANGLES.map((angle, index) => {
            const currentImg = images[angle.id];
            const slotLoading = isProcessing[angle.id];

            return (
              <div
                key={angle.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  currentImg
                    ? 'border-neutral-900 bg-white ring-1 ring-neutral-900/10 shadow-xs'
                    : 'border-neutral-200 bg-neutral-50/60 hover:border-neutral-300'
                }`}
              >
                {/* Hidden Input for this slot */}
                <input
                  ref={(el) => {
                    inputRefs.current[angle.id] = el;
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSingleUpload(e.target.files[0], angle.id);
                    }
                  }}
                />

                {/* Slot Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 font-mono">
                      0{index + 1} · {angle.subtitle}
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900 leading-tight">
                      {angle.title}
                    </h5>
                  </div>

                  {slotLoading ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                      <Loader2 className="w-3 h-3 animate-spin text-amber-600" /> Saving...
                    </span>
                  ) : currentImg ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      <Check className="w-3 h-3" /> Saved
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-neutral-400 shrink-0">
                      Default Illustration
                    </span>
                  )}
                </div>

                {/* Preview / Upload Box */}
                <div className="mt-2.5">
                  {currentImg ? (
                    <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
                      <div className="w-16 h-12 bg-white rounded flex items-center justify-center p-1 border border-neutral-100 shrink-0 overflow-hidden">
                        <img
                          src={currentImg}
                          alt={angle.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-emerald-700 font-semibold truncate">
                          ✓ Custom {activeColorInfo.hex} photo active
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => inputRefs.current[angle.id]?.click()}
                            className="text-[11px] font-bold text-neutral-900 hover:text-amber-600 underline cursor-pointer"
                          >
                            Replace
                          </button>
                          <span className="text-neutral-300">·</span>
                          <button
                            onClick={() => handleClearSlot(angle.id)}
                            className="text-[11px] font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => inputRefs.current[angle.id]?.click()}
                      className="py-3 px-3 bg-white rounded-lg border border-dashed border-neutral-300 hover:border-neutral-900 cursor-pointer flex items-center justify-center gap-2 text-center transition-all group"
                    >
                      <Upload className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-900" />
                      <span className="text-[11px] font-semibold text-neutral-700 group-hover:text-neutral-950">
                        Choose {activeColorInfo.name} Photo
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-[10px] text-neutral-400 leading-tight">
                  {angle.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5 font-semibold">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeColorInfo.hex }}
            />
            {activeColorInfo.name} ({activeColorInfo.hex}) photos saved permanently in IndexedDB
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
