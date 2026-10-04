import React from 'react';
import { CheckCircle2, PackageCheck, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { Order, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';
import { VelarLogo } from './VelarLogo';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
  language: Language;
  currency: Currency;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onTrackOrder,
  language,
  currency,
}) => {
  if (!isOpen || !order) return null;

  const dict = t[language];
  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D1117] border border-slate-800 rounded-sm shadow-2xl p-6 sm:p-10 my-auto text-center">
        {/* Emblem & Checkmark */}
        <div className="flex flex-col items-center mb-6">
          <VelarLogo variant="mark-only" size="md" />
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mt-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide uppercase font-display">
          {dict.orderConfirmation.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light max-w-md mx-auto leading-relaxed">
          {dict.orderConfirmation.subtitle}
        </p>

        {/* Order Reference Box */}
        <div className="mt-6 p-4 bg-[#131922] border border-slate-800 rounded-xs inline-block mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium block">
            {dict.orderConfirmation.orderNumberLabel}
          </span>
          <span className="text-lg font-mono font-bold tracking-widest text-white mt-1 block">
            {order.orderNumber}
          </span>
        </div>

        {/* Details Box */}
        <div className="mt-8 text-start p-5 bg-[#11161C] border border-slate-800/80 rounded-xs space-y-4 text-xs">
          <div className="flex justify-between pb-3 border-b border-slate-800/60 text-slate-300">
            <span className="text-slate-400">{dict.checkout.fullName}:</span>
            <span className="font-semibold text-white">{order.customer.fullName}</span>
          </div>

          <div className="flex justify-between pb-3 border-b border-slate-800/60 text-slate-300">
            <span className="text-slate-400">{dict.checkout.phone}:</span>
            <span className="font-mono text-white">{order.customer.phone}</span>
          </div>

          <div className="flex justify-between pb-3 border-b border-slate-800/60 text-slate-300">
            <span className="text-slate-400">{dict.checkout.wilaya}:</span>
            <span className="text-white">{order.customer.wilaya} · {order.customer.commune}</span>
          </div>

          <div className="flex justify-between pb-3 border-b border-slate-800/60 text-slate-300">
            <span className="text-slate-400">{dict.checkout.paymentMethod}:</span>
            <span className="font-semibold text-emerald-400">
              {order.paymentMethod === 'cod' ? dict.checkout.codTitle : 'Carte bancaire'}
            </span>
          </div>

          <div className="flex justify-between pt-1 text-sm font-semibold text-white">
            <span>{dict.cart.total}:</span>
            <span className="tabular-nums text-base">
              {formatPrice(order.total, currency, language)}
            </span>
          </div>
        </div>

        {/* Delivery Timeline Notice */}
        <div className="mt-5 p-3.5 bg-[#141A22] border border-slate-800/60 rounded-xs text-xs text-slate-300 flex items-center justify-center gap-2">
          <PackageCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{dict.orderConfirmation.deliveryEstimate}</span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onTrackOrder(order.orderNumber)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs uppercase tracking-[0.2em] font-semibold py-3.5 px-6 rounded-xs transition-colors shadow-lg"
          >
            <Compass className="w-4 h-4" />
            <span>{dict.orderConfirmation.trackButton}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto text-xs uppercase tracking-[0.2em] font-medium text-slate-400 hover:text-white py-3 px-6 transition-colors"
          >
            {dict.orderConfirmation.backHome}
          </button>
        </div>
      </div>
    </div>
  );
};
