import React, { useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (q: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const quickTrends = [
    'Palm Angels Flame Low-Tops',
    'Palm Angels Tracksuits',
    'Burning Head Monogram T-Shirt',
    'Streetwear Low-Top Canvas',
    'New Season Sneakers',
    'Skate Vulcanized Shoes',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative max-w-2xl mx-auto mt-20 px-4 z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 p-6 overflow-hidden">
          <div className="relative flex items-center border-b border-neutral-200 pb-4">
            <Search className="w-5 h-5 text-neutral-400 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search designers, sneakers, styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base font-medium placeholder-neutral-400 text-neutral-900 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 ml-2"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-6 space-y-4">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Trending Searches
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickTrends.map((trend) => (
                <button
                  key={trend}
                  onClick={() => {
                    onSelectQuery(trend);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 text-left text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors group"
                >
                  <span>{trend}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
