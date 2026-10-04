import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  language: Language;
  currency: Currency;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  language,
  currency,
}) => {
  if (!isOpen) return null;

  const dict = t[language];
  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
        <div className="w-screen max-w-md bg-[#0D1117] border-s border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-[#11161C] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-white">
                {language === 'ar' ? 'قائمة الأمنيات الخاصة' : 'Private Wishlist'}
              </h2>
              <span className="text-xs text-slate-400 tabular-nums">
                ({wishlist.length})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Heart className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="text-sm font-medium text-slate-200 uppercase tracking-wider">
                  {language === 'ar' ? 'قائمتك فارغة حالياً' : 'Your Wishlist is Empty'}
                </h3>
                <p className="text-xs text-slate-400 font-light max-w-xs leading-relaxed">
                  {language === 'ar'
                    ? 'احفظ قطع فيلار المفضلة لديك بالضغط على رمز القلب لتتبعها وحجزها في أي وقت.'
                    : 'Save your favorite VELAR pieces to reserve or acquire later.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs uppercase tracking-widest font-semibold text-white underline underline-offset-4 hover:text-slate-300 transition-colors"
                >
                  {dict.cart.continueShopping}
                </button>
              </div>
            ) : (
              wishlist.map((prod) => (
                <div
                  key={prod.id}
                  className="flex gap-4 p-3 bg-[#11161C] border border-slate-800 rounded-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-16 aspect-[3/4] bg-[#161D26] rounded-xs overflow-hidden shrink-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.name[language]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-medium text-white line-clamp-1">
                          {prod.name[language]}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(prod)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-white tabular-nums block mt-1">
                        {formatPrice(prod.priceDZD, currency, language)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(
                          prod,
                          prod.colors[0]?.colorName || 'Standard',
                          prod.sizes[0] || 'M',
                          1
                        );
                        onRemoveFromWishlist(prod);
                      }}
                      className="mt-2 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-200 text-slate-950 text-[11px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded-xs transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'نقل للحقيبة' : 'Move to Bag'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
