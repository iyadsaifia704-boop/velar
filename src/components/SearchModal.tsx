import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product, Language, Currency } from '../types';
import { VELAR_PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  language,
  currency,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const dict = t[language];
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return VELAR_PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;

      const nameMatch =
        p.name.ar.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.name.fr.toLowerCase().includes(q);
      const descMatch =
        p.description.ar.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q) ||
        p.description.fr.toLowerCase().includes(q);
      const compMatch =
        p.composition.ar.toLowerCase().includes(q) ||
        p.composition.en.toLowerCase().includes(q);

      return matchesCategory && (nameMatch || descMatch || compMatch);
    });
  }, [query, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D1117] border border-slate-800 rounded-sm shadow-2xl p-6 sm:p-8">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-700/80 pb-4">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث بالاسم، الخامة (كشمير، صوف بكر)، أو القطعة...'
                : 'Search by silhouette, luxury fabric (cashmere, merino)...'
            }
            className="w-full bg-transparent px-4 text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none font-light"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 text-xs">
          {[
            { id: 'all', label: dict.shop.all },
            { id: 'coats', label: language === 'ar' ? 'معاطف' : 'Coats' },
            { id: 'blazers', label: language === 'ar' ? 'بدل وسترات' : 'Suits & Blazers' },
            { id: 'knitwear', label: language === 'ar' ? 'صوف ومحبوكات' : 'Knitwear' },
            { id: 'polos', label: language === 'ar' ? 'بولو' : 'Polos' },
            { id: 'trousers', label: language === 'ar' ? 'بناطيل' : 'Trousers' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-medium border ${
                selectedCategory === cat.id
                  ? 'border-white bg-white text-slate-950 font-semibold'
                  : 'border-slate-800 bg-[#121820] text-slate-300 hover:border-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-6 max-h-[50vh] overflow-y-auto space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {language === 'ar'
                ? 'لم يتم العثور على قطع تطابق بحثك. جرب البحث عن: كشمير، بدلة، صوف، بولو.'
                : 'No pieces matched your search. Try: Cashmere, Blazer, Merino, Polo.'}
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xs border border-slate-800/80 bg-[#11161C] hover:bg-[#151D26] hover:border-slate-700 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 aspect-[3/4] bg-[#161D26] rounded-xs overflow-hidden shrink-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.name[language]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                      {prod.categoryName[language]}
                    </span>
                    <h4 className="text-xs sm:text-sm font-medium text-white group-hover:text-slate-200">
                      {prod.name[language]}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-light line-clamp-1">
                      {prod.subtitle[language]}
                    </p>
                  </div>
                </div>

                <div className="text-end shrink-0 pl-3">
                  <span className="text-xs sm:text-sm font-semibold text-white tabular-nums block">
                    {formatPrice(prod.priceDZD, currency, language)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider group-hover:text-slate-200">
                    {dict.shop.viewDetails} →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
