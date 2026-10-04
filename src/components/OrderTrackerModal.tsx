import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, MapPin, AlertCircle } from 'lucide-react';
import { Order, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { t } from '../utils/translations';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  initialOrderNumber?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  language,
  currency,
  initialOrderNumber = '',
}) => {
  if (!isOpen) return null;

  const dict = t[language];
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || 'VLR-94812');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const fetchOrder = async (queryNum: string) => {
    if (!queryNum.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(queryNum.trim())}`);
      if (!res.ok) {
        throw new Error('Order not found');
      }
      const data = await res.json();
      setTrackedOrder(data.order);
    } catch (err) {
      setTrackedOrder(null);
      setError(dict.tracking.notFound);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderQuery(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    } else {
      fetchOrder('VLR-94812');
    }
  }, [initialOrderNumber]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D1117] border border-slate-800 rounded-sm shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-light text-white uppercase tracking-wider">
              {dict.tracking.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              {dict.tracking.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Close Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrder(orderQuery)}
              placeholder={dict.tracking.placeholder}
              className="w-full bg-[#131922] border border-slate-800 focus:border-slate-400 rounded-xs pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none uppercase font-mono tracking-wider"
            />
          </div>

          <button
            onClick={() => fetchOrder(orderQuery)}
            disabled={loading}
            className="bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xs transition-colors shadow-sm disabled:opacity-50 shrink-0"
          >
            {loading ? '...' : dict.tracking.trackBtn}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/80 rounded-xs text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracked Order Details */}
        {trackedOrder && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            {/* Summary header */}
            <div className="p-4 bg-[#11161C] border border-slate-800 rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
                  {dict.orderConfirmation.orderNumberLabel}
                </span>
                <span className="text-sm font-mono font-bold text-white block mt-0.5">
                  {trackedOrder.orderNumber}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
                  {dict.checkout.fullName}
                </span>
                <span className="text-slate-200 block mt-0.5 font-medium">
                  {trackedOrder.customer.fullName}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
                  {dict.checkout.wilaya}
                </span>
                <span className="text-slate-200 block mt-0.5">
                  {trackedOrder.customer.wilaya}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
                  {dict.cart.total}
                </span>
                <span className="text-white block mt-0.5 font-semibold tabular-nums">
                  {formatPrice(trackedOrder.total, currency, language)}
                </span>
              </div>
            </div>

            {/* Stages Timeline */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-300 mb-4">
                {dict.tracking.timelineTitle}
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {trackedOrder.timeline.map((step, idx) => {
                  const label =
                    language === 'ar'
                      ? step.labelAr
                      : language === 'fr'
                      ? step.labelFr
                      : step.labelEn;

                  return (
                    <div key={idx} className="relative flex items-start gap-4 text-xs">
                      {/* Node Bullet */}
                      <span
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                          step.completed
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                            : 'bg-[#11161C] border-slate-700 text-slate-500'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        )}
                      </span>

                      {/* Content */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span
                          className={`font-medium ${
                            step.completed ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {step.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary in parcel */}
            <div className="pt-4 border-t border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-3 font-semibold">
                {language === 'ar' ? 'محتويات الشحنة الفاخرة:' : 'Parcel Contents:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trackedOrder.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-[#11161C] border border-slate-800 rounded-xs text-xs">
                    <div className="w-10 aspect-[3/4] bg-[#151D26] rounded-xs overflow-hidden shrink-0">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white line-clamp-1">{it.name}</h5>
                      <span className="text-[11px] text-slate-400">
                        {it.color} · {it.size} · Qty {it.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
