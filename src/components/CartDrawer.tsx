import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { CartItem, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  language: Language;
  currency: Currency;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  language,
  currency,
}) => {
  if (!isOpen) return null;

  const dict = t[language];
  const isRtl = language === 'ar';

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceDZD * item.quantity,
    0
  );

  const freeShippingThreshold = 30000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
        <div className="w-screen max-w-md bg-[#0D1117] border-s border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 bg-[#11161C] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-slate-300" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-white">
                {dict.cart.title}
              </h2>
              <span className="text-xs text-slate-400 tabular-nums">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-[#141A22] border-b border-slate-800/60 text-xs">
              <div className="flex items-center justify-between text-slate-300 mb-1.5 font-light">
                {isFreeShipping ? (
                  <span className="text-emerald-400 font-medium">
                    {dict.cart.freeShippingQualified}
                  </span>
                ) : (
                  <span>
                    {dict.cart.freeShippingThreshold.replace(
                      '{amount}',
                      formatPrice(amountToFreeShipping, currency, language)
                    )}
                  </span>
                )}
                <span className="font-mono text-[10px] text-slate-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFreeShipping ? 'bg-emerald-400' : 'bg-slate-300'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="text-sm font-medium text-slate-200 uppercase tracking-wider">
                  {dict.cart.empty}
                </h3>
                <p className="text-xs text-slate-400 font-light max-w-xs leading-relaxed">
                  {dict.cart.emptyDesc}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs uppercase tracking-widest font-semibold text-white underline underline-offset-4 hover:text-slate-300 transition-colors"
                >
                  {dict.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                  className="flex gap-4 pb-5 border-b border-slate-800/60"
                >
                  {/* Thumbnail */}
                  <div className="w-20 aspect-[3/4] bg-[#161D26] rounded-xs overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name[language]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-medium text-white line-clamp-1">
                          {item.product.name[language]}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                          title={dict.cart.remove}
                          aria-label={dict.cart.remove}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>{item.selectedColor}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-300">{item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-800 rounded-xs bg-[#11161C]">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-white min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-semibold text-white tabular-nums">
                        {formatPrice(item.product.priceDZD * item.quantity, currency, language)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-[#11161C] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>{dict.cart.subtotal}</span>
                  <span className="text-slate-200 font-medium tabular-nums">
                    {formatPrice(subtotal, currency, language)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>{dict.cart.delivery}</span>
                  <span className="tabular-nums">
                    {isFreeShipping ? (
                      <span className="text-emerald-400 font-medium uppercase tracking-wider text-[11px]">
                        {dict.cart.freeDelivery}
                      </span>
                    ) : (
                      formatPrice(1200, currency, language)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-sm font-semibold text-white">
                  <span>{dict.cart.total}</span>
                  <span className="tabular-nums text-base">
                    {formatPrice(subtotal + (isFreeShipping ? 0 : 1200), currency, language)}
                  </span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-[0.2em] py-3.5 px-6 rounded-xs transition-colors shadow-lg"
                >
                  <span>{dict.cart.checkout}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-center text-xs text-slate-400 hover:text-white py-2 font-medium tracking-wider uppercase transition-colors"
                >
                  {dict.cart.continueShopping}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest pt-1">
                <Shield className="w-3 h-3 text-slate-400" />
                <span>Paiement Sécurisé · الدفع عند الاستلام</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
