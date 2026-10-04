import React, { useState } from 'react';
import { Heart, Plus, Eye } from 'lucide-react';
import { Product, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, selectedColor: string, selectedSize: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const dict = t[language];

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const defaultSize = product.sizes[0] || 'M';

  return (
    <div
      className="group relative flex flex-col bg-[#11161C] border border-slate-800/80 rounded-sm overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#161D26]">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name[language]}
          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-103"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Subtle unboxed metadata tag (Zero-Pill compliant) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] tracking-widest uppercase font-medium pointer-events-none">
          {product.isNewArrival ? (
            <span className="text-slate-200 drop-shadow-sm font-semibold">
              {dict.shop.sortNewest}
            </span>
          ) : product.stockCount <= 5 ? (
            <span className="text-amber-300 drop-shadow-sm">
              {dict.shop.lowStock}
            </span>
          ) : (
            <span />
          )}

          {/* Availability indicator */}
          <span className="text-slate-400 text-[10px] tracking-wider drop-shadow-sm">
            {product.stockCount > 0 ? dict.shop.inStock : ''}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 end-3 p-2 rounded-full transition-colors backdrop-blur-sm ${
            isWishlisted
              ? 'bg-white text-slate-950 shadow-md'
              : 'bg-black/30 hover:bg-black/60 text-slate-300 hover:text-white'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
        </button>

        {/* Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={() => onSelectProduct(product)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#090C10]/90 hover:bg-black text-white text-[11px] uppercase tracking-wider font-medium py-2.5 px-3 rounded-xs border border-slate-700 backdrop-blur-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{dict.shop.viewDetails}</span>
          </button>
          <button
            onClick={() => onQuickAdd(product, activeColor.colorName, defaultSize)}
            className="inline-flex items-center justify-center bg-white hover:bg-slate-200 text-slate-950 p-2.5 rounded-xs transition-colors shadow-sm"
            title={dict.shop.quickAdd}
            aria-label="Quick Add to Bag"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category / Sub-Kicker */}
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1 font-medium">
            {product.categoryName[language]}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-medium text-slate-100 line-clamp-1 cursor-pointer hover:text-white transition-colors"
          >
            {product.name[language]}
          </h3>

          {/* Short subtitle */}
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-light">
            {product.subtitle[language]}
          </p>
        </div>

        {/* Bottom row: Price & Color Swatches */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-slate-100 tabular-nums">
              {formatPrice(product.priceDZD, currency, language)}
            </span>
            {product.originalPriceDZD && (
              <span className="text-xs text-slate-500 line-through tabular-nums">
                {formatPrice(product.originalPriceDZD, currency, language)}
              </span>
            )}
          </div>

          {/* Subtle Color Swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color, idx) => (
              <button
                key={color.colorName}
                onClick={() => setSelectedColorIdx(idx)}
                className={`w-3 h-3 rounded-full border transition-transform ${
                  selectedColorIdx === idx
                    ? 'scale-125 border-white ring-1 ring-slate-400'
                    : 'border-slate-600 opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.colorHex }}
                title={color.colorName}
                aria-label={color.colorName}
              />
            ))}
          </div>
        </div>

        {/* Mobile Quick Tap to View */}
        <button
          onClick={() => onSelectProduct(product)}
          className="mt-3 sm:hidden w-full text-center py-2 text-[11px] uppercase tracking-wider font-semibold text-slate-300 border border-slate-800 bg-slate-900/60 rounded-xs"
        >
          {dict.shop.viewDetails}
        </button>
      </div>
    </div>
  );
};
