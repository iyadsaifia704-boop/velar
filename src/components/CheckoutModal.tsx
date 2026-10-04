import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import { CartItem, Language, Currency, Order } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';
import { WILAYAS_OF_ALGERIA } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  currency: Currency;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  language,
  currency,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const dict = t[language];
  const isRtl = language === 'ar';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger (الجزائر العاصمة)');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceDZD * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 30000 ? 0 : 1200;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !commune.trim() || !address.trim()) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة لضمان دقة وسرعة التسليم.'
          : 'Please complete all required delivery fields.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName,
          phone,
          wilaya,
          commune,
          address,
          notes,
        },
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name[language],
          color: i.selectedColor,
          size: i.selectedSize,
          price: i.product.priceDZD,
          quantity: i.quantity,
          image: i.product.images[0],
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to record order');
      }

      const data = await res.json();
      if (data.order) {
        onOrderSuccess(data.order);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        language === 'ar'
          ? 'حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.'
          : 'Error placing order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0D1117] border border-slate-800 rounded-sm shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#11161C] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-light text-white uppercase tracking-wider">
              {dict.checkout.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              {dict.checkout.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Form on Left, Order Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x lg:divide-slate-800/80">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-xs flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-300 border-b border-slate-800 pb-2">
                1. {language === 'ar' ? 'معلومات العميل والتسليم' : 'Customer & Shipping Address'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">
                    {dict.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'محمد بن علي' : 'Alexander Wright'}
                    className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">
                    {dict.checkout.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550 00 00 00"
                    className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors tabular-nums"
                  />
                </div>
              </div>

              {/* Wilaya & Commune */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">
                    {dict.checkout.wilaya} *
                  </label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                  >
                    {WILAYAS_OF_ALGERIA.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">
                    {dict.checkout.commune} *
                  </label>
                  <input
                    type="text"
                    required
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder={language === 'ar' ? 'حيدرة / وهران / قسنطينة' : 'Hydra / City center'}
                    className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  {dict.checkout.address} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'ar' ? 'حي الأقحوان، عمارة 12، الطابق 3' : 'Street address, building, apartment'}
                  className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  {dict.checkout.notes}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'الاتصال قبل موعد التسليم بساعة...' : 'Preferred delivery time, landmark...'}
                  className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-300 border-b border-slate-800 pb-2">
                2. {dict.checkout.paymentMethod}
              </h3>

              {/* COD Option (Default & Prominent) */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xs border cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-white bg-[#141A22]'
                    : 'border-slate-800 bg-[#0F141A] opacity-75'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-white"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {dict.checkout.codTitle}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-medium">
                      Recommandé
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {dict.checkout.codDesc}
                  </p>
                </div>
              </label>

              {/* Card Option (Disabled / Coming Soon placeholder) */}
              <label className="flex items-start gap-3 p-4 rounded-xs border border-slate-800 bg-[#0F141A] opacity-50 cursor-not-allowed">
                <input
                  type="radio"
                  name="payment"
                  disabled
                  className="mt-1"
                />
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400">
                    {dict.checkout.cardTitle}
                  </span>
                  <p className="text-xs text-slate-500 font-light">
                    {dict.checkout.cardDesc}
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-[0.2em] py-4 px-6 rounded-xs transition-colors shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{dict.checkout.placingOrder}</span>
                ) : (
                  <>
                    <span>{dict.checkout.placeOrder}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>{dict.checkout.secureNotice}</span>
              </div>
            </div>
          </form>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0B0E13] flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-300 border-b border-slate-800 pb-2 mb-4">
                {dict.checkout.orderSummary}
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="w-14 aspect-[3/4] bg-[#161D26] rounded-xs overflow-hidden shrink-0 border border-slate-800">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name[language]}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white line-clamp-1">
                        {item.product.name[language]}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.selectedColor} · {item.selectedSize} · Qty {item.quantity}
                      </p>
                      <p className="font-semibold text-white mt-1 tabular-nums">
                        {formatPrice(item.product.priceDZD * item.quantity, currency, language)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{dict.cart.subtotal}</span>
                  <span className="tabular-nums text-slate-200">
                    {formatPrice(subtotal, currency, language)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>{dict.cart.delivery}</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 uppercase font-semibold text-[10px]">
                        {dict.cart.freeDelivery}
                      </span>
                    ) : (
                      formatPrice(deliveryFee, currency, language)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-semibold text-white">
                  <span>{dict.cart.total}</span>
                  <span className="tabular-nums text-base">
                    {formatPrice(total, currency, language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier Note */}
            <div className="p-3.5 bg-[#121820] border border-slate-800 rounded-xs text-xs text-slate-400 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                {language === 'ar'
                  ? 'يتم تسليم طلبات العاصمة والمدن الكبرى خلال 24 ساعة، وباقي الولايات خلال 48 ساعة كحد أقصى مع المعاينة قبل الدفع.'
                  : 'Delivered within 24-48 business hours with inspection on delivery.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
