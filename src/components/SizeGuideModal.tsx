import React, { useState } from 'react';
import { X, Ruler, CheckCircle, Info, Footprints } from 'lucide-react';

interface SizeEntry {
  eu: number;
  usMen: number;
  usWomen: number;
  uk: number;
  cm: number;
  inStock: boolean;
}

const SIZE_CONVERSIONS: SizeEntry[] = [
  { eu: 36, usMen: 4.5, usWomen: 6.0, uk: 3.5, cm: 22.8, inStock: false },
  { eu: 37, usMen: 5.0, usWomen: 6.5, uk: 4.0, cm: 23.5, inStock: true },
  { eu: 38, usMen: 6.0, usWomen: 7.5, uk: 5.0, cm: 24.2, inStock: true },
  { eu: 39, usMen: 6.5, usWomen: 8.0, uk: 5.5, cm: 24.8, inStock: true },
  { eu: 40, usMen: 7.5, usWomen: 9.0, uk: 6.5, cm: 25.5, inStock: true },
  { eu: 41, usMen: 8.0, usWomen: 9.5, uk: 7.0, cm: 26.2, inStock: true },
  { eu: 42, usMen: 9.0, usWomen: 10.5, uk: 8.0, cm: 26.8, inStock: true },
  { eu: 43, usMen: 9.5, usWomen: 11.0, uk: 8.5, cm: 27.5, inStock: false },
  { eu: 44, usMen: 10.5, usWomen: 12.0, uk: 9.5, cm: 28.2, inStock: false },
  { eu: 45, usMen: 11.5, usWomen: 13.0, uk: 10.5, cm: 28.8, inStock: false },
];

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSize: number;
  onSelectSize: (size: number) => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  currentSize,
  onSelectSize,
}) => {
  const [genderMode, setGenderMode] = useState<'men' | 'women'>('men');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Ruler className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                International Conversion Chart
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-brand-display uppercase tracking-tight">
                Shoe Size Guide & Fit Advice
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fit recommendations & Gender Tabs */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60 text-xs">
          <div className="flex items-center gap-2 text-neutral-700">
            <Info className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>
              <strong>Fit Advice:</strong> Runs true to size. Technical knit offers snug adaptive stretch.
            </span>
          </div>

          {/* Gender Segmented Switcher */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-neutral-200 shrink-0">
            <button
              onClick={() => setGenderMode('men')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                genderMode === 'men'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Men's US
            </button>
            <button
              onClick={() => setGenderMode('women')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                genderMode === 'women'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Women's US
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] uppercase tracking-wider bg-neutral-50/50">
                <th className="py-2.5 px-3 font-bold text-neutral-800">EU Size</th>
                <th className="py-2.5 px-3">
                  US ({genderMode === 'men' ? 'Men' : 'Women'})
                </th>
                <th className="py-2.5 px-3">UK</th>
                <th className="py-2.5 px-3">Foot Length</th>
                <th className="py-2.5 px-3 text-right">Status / Choose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 tabular-nums">
              {SIZE_CONVERSIONS.map((s) => {
                const isSelected = s.eu === currentSize;
                return (
                  <tr
                    key={s.eu}
                    onClick={() => {
                      if (s.inStock) {
                        onSelectSize(s.eu);
                        onClose();
                      }
                    }}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white font-bold'
                        : s.inStock
                        ? 'hover:bg-neutral-50 cursor-pointer text-neutral-800'
                        : 'text-neutral-300 bg-neutral-50/30 cursor-not-allowed'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-sm">EU {s.eu}</td>
                    <td className="py-2.5 px-3">
                      {genderMode === 'men' ? s.usMen : s.usWomen}
                    </td>
                    <td className="py-2.5 px-3">{s.uk}</td>
                    <td className="py-2.5 px-3">{s.cm} cm</td>
                    <td className="py-2.5 px-3 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-neutral-800 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Selected
                        </span>
                      ) : s.inStock ? (
                        <button
                          className="text-[11px] text-neutral-600 hover:text-neutral-950 font-sans font-semibold underline"
                        >
                          Select
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-sans uppercase">
                          Sold Out
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* How to Measure Step-by-Step Mini Guide */}
        <div className="mt-6 pt-5 border-t border-neutral-100">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <Footprints className="w-4 h-4 text-neutral-700" />
            <span>How to Measure Your Foot Length</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-1.5 pl-1 leading-relaxed">
            <li>Stand on a flat floor with your heel firmly against a straight wall.</li>
            <li>Place a ruler on the floor alongside the inside edge of your foot from heel to toe.</li>
            <li>Measure from the wall to your longest toe and compare with the CM column above.</li>
            <li>If between measurements, we recommend choosing the next half or full size up.</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Currently Selected: <strong>EU {currentSize}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
