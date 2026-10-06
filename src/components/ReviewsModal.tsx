import React from 'react';
import { X, Star, CheckCircle } from 'lucide-react';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  totalReviews: number;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  rating,
  totalReviews,
}) => {
  if (!isOpen) return null;

  const mockReviews = [
    {
      id: 1,
      author: 'Matteo V.',
      rating: 5,
      date: 'March 2026',
      title: 'Incredible comfort and sculptural silhouette',
      comment:
        'The technical knit hugs the foot like a second sock. The rear bungee system is genuinely useful for adjusting lock-down. The wave sole gets compliments everywhere in Milan.',
      verified: true,
    },
    {
      id: 2,
      author: 'Elena R.',
      rating: 4,
      date: 'February 2026',
      title: 'Bold mustard color and ultra lightweight',
      comment:
        'The orange knit is even richer in person. The wave-pod foam makes running and all-day walking feel effortless. True to Italian sizing.',
      verified: true,
    },
    {
      id: 3,
      author: 'Julian K.',
      rating: 5,
      date: 'January 2026',
      title: 'Precision KORVA craftsmanship',
      comment:
        'The elastic toggle cord keeps everything clean without loose laces flailing around. Premium knit that holds its shape after weeks of wear.',
      verified: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Verified Client Feedback
            </span>
            <h3 className="text-lg font-bold text-neutral-900">Product Reviews</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900"
            aria-label="Close reviews"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating summary */}
        <div className="my-5 p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-neutral-900 tabular-nums">4.8</div>
            <div className="flex items-center gap-1 text-amber-500 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < 4 ? 'fill-amber-500' : 'text-neutral-300'}`}
                />
              ))}
            </div>
          </div>
          <div className="text-right text-xs text-neutral-500">
            <p className="font-semibold text-neutral-800">{totalReviews} Verified Purchases</p>
            <p className="text-[11px] text-neutral-400">96% would recommend this fit</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {mockReviews.map((rev) => (
            <div key={rev.id} className="p-3.5 bg-white rounded-xl border border-neutral-100 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <span>{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-normal">
                      <CheckCircle className="w-3 h-3 inline" /> Verified
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">{rev.date}</span>
              </div>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500' : 'text-neutral-300'}`}
                  />
                ))}
              </div>
              <h4 className="text-xs font-semibold text-neutral-800">{rev.title}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
