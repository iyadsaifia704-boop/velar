import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Truck, RefreshCw, ChevronDown, ChevronUp, ZoomIn, Ruler, Sparkles } from 'lucide-react';
import { Product, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onBuyNow: (product: Product, color: string, size: string, quantity: number) => void;
  onOpenAtelierWithProduct: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  language,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenAtelierWithProduct,
}) => {
  if (!isOpen || !product) return null;

  const dict = t[language];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('composition');

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-250">
        <div className="relative w-full max-w-5xl bg-[#0D1117] border border-slate-800 rounded-xs shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#11161C] shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-medium">
                {product.categoryName[language]}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] font-mono text-slate-400">
                {product.sku}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-full transition-colors ${
                  isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                }`}
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body (2 Columns Desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x lg:divide-slate-800/80">
            {/* Left Column: Gallery Stage */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col gap-4 bg-[#090C10]">
              <div
                className="relative aspect-[3/4] w-full bg-[#151D26] rounded-xs overflow-hidden cursor-zoom-in border border-slate-800"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name[language]}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                />

                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white p-1.5 rounded text-xs flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">
                    {isZoomed ? 'Click to Reset' : 'Zoom Detail'}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIdx(idx);
                      setIsZoomed(false);
                    }}
                    className={`aspect-[3/4] rounded-xs overflow-hidden border transition-all ${
                      selectedImageIdx === idx
                        ? 'border-white ring-1 ring-white/50 opacity-100'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0D1117]">
              <div>
                {/* Title & Subtitle */}
                <h1 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                  {product.name[language]}
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                  {product.subtitle[language]}
                </p>

                {/* Price Baseline */}
                <div className="mt-4 pb-4 border-b border-slate-800/80 flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-white tabular-nums">
                    {formatPrice(product.priceDZD, currency, language)}
                  </span>
                  {product.originalPriceDZD && (
                    <span className="text-sm text-slate-500 line-through tabular-nums">
                      {formatPrice(product.originalPriceDZD, currency, language)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mt-4">
                  {product.description[language]}
                </p>

                {/* Color Selection */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
                      {dict.product.selectColor}:
                    </span>
                    <span className="text-slate-400 font-medium">
                      {activeColor.colorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c, idx) => (
                      <button
                        key={c.colorName}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColorIdx === idx
                            ? 'border-white scale-110 shadow-sm'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        title={c.colorName}
                        aria-label={c.colorName}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-slate-600"
                          style={{ backgroundColor: c.colorHex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
                      {dict.product.selectSize}
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white uppercase tracking-wider underline underline-offset-4"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{dict.product.sizeGuide}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-colors ${
                          selectedSize === s
                            ? 'border-white bg-white text-slate-950'
                            : 'border-slate-800 bg-[#131922] text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Stock */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
                    {dict.product.quantity}
                  </span>
                  <div className="flex items-center border border-slate-800 rounded-xs bg-[#11161C]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-400 hover:text-white text-sm"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-semibold tabular-nums text-white min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="px-3 py-1.5 text-slate-400 hover:text-white text-sm"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Buy CTAs */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      onAddToCart(product, activeColor.colorName, selectedSize, quantity);
                    }}
                    className="w-full bg-white hover:bg-slate-200 text-slate-950 text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-xs transition-colors shadow-lg"
                  >
                    {dict.product.addToCart}
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow(product, activeColor.colorName, selectedSize, quantity);
                    }}
                    className="w-full bg-transparent hover:bg-slate-800/60 text-slate-200 hover:text-white text-xs uppercase tracking-[0.2em] font-semibold py-3 px-6 rounded-xs border border-slate-700 transition-colors"
                  >
                    {dict.product.buyNow}
                  </button>
                </div>

                {/* Atelier AI Styling Affordance */}
                <button
                  onClick={() => onOpenAtelierWithProduct(product)}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider text-slate-400 hover:text-white py-2 transition-colors border border-dashed border-slate-800 rounded-xs hover:border-slate-600"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                  <span>
                    {language === 'ar'
                      ? 'استشر الخياط الذكي حول تنسيق هذه القطعة'
                      : 'Consult Atelier AI on styling this garment'}
                  </span>
                </button>
              </div>

              {/* Informational Accordion Sections */}
              <div className="mt-8 border-t border-slate-800/80 divide-y divide-slate-800/60">
                {/* Composition */}
                <div>
                  <button
                    onClick={() => toggleAccordion('composition')}
                    className="w-full py-3 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{dict.product.composition}</span>
                    {openAccordion === 'composition' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openAccordion === 'composition' && (
                    <div className="pb-3 text-xs text-slate-400 leading-relaxed font-light">
                      {product.composition[language]}
                    </div>
                  )}
                </div>

                {/* Fit Blueprint */}
                <div>
                  <button
                    onClick={() => toggleAccordion('fit')}
                    className="w-full py-3 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{dict.product.fit}</span>
                    {openAccordion === 'fit' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openAccordion === 'fit' && (
                    <div className="pb-3 text-xs text-slate-400 leading-relaxed font-light">
                      {product.fitGuide[language]}
                    </div>
                  )}
                </div>

                {/* Master Care */}
                <div>
                  <button
                    onClick={() => toggleAccordion('care')}
                    className="w-full py-3 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{dict.product.care}</span>
                    {openAccordion === 'care' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openAccordion === 'care' && (
                    <div className="pb-3 text-xs text-slate-400 leading-relaxed font-light">
                      {product.careInstructions[language]}
                    </div>
                  )}
                </div>

                {/* Shipping & Delivery */}
                <div>
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-3 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{dict.product.shipping}</span>
                    {openAccordion === 'shipping' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="pb-3 text-xs text-slate-400 leading-relaxed font-light space-y-2">
                      <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        <span>{dict.product.shippingNotice}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        <span>{dict.product.freeDeliveryNotice}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        <span>{dict.product.satisfactionGuarantee}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        language={language}
        category={product.category}
      />
    </>
  );
};
