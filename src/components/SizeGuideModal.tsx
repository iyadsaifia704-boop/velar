import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { Language } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  category: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  category,
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isOpen) return null;

  const jacketSizes = [
    { size: '48 (M)', chestCm: '98 - 101', waistCm: '84 - 87', shoulderCm: '45.5', sleeveCm: '64.5', chestIn: '38.5 - 40', waistIn: '33 - 34', shoulderIn: '17.9', sleeveIn: '25.4' },
    { size: '50 (L)', chestCm: '102 - 105', waistCm: '88 - 91', shoulderCm: '46.5', sleeveCm: '65.5', chestIn: '40 - 41.5', waistIn: '34.5 - 36', shoulderIn: '18.3', sleeveIn: '25.8' },
    { size: '52 (XL)', chestCm: '106 - 109', waistCm: '92 - 95', shoulderCm: '47.5', sleeveCm: '66.5', chestIn: '41.5 - 43', waistIn: '36 - 37.5', shoulderIn: '18.7', sleeveIn: '26.2' },
    { size: '54 (XXL)', chestCm: '110 - 114', waistCm: '96 - 100', shoulderCm: '48.5', sleeveCm: '67.5', chestIn: '43 - 45', waistIn: '38 - 39.5', shoulderIn: '19.1', sleeveIn: '26.6' },
  ];

  const knitSizes = [
    { size: 'S', chestCm: '94 - 97', lengthCm: '67', sleeveCm: '63', chestIn: '37 - 38', lengthIn: '26.4', sleeveIn: '24.8' },
    { size: 'M', chestCm: '98 - 101', lengthCm: '69', sleeveCm: '64.5', chestIn: '38.5 - 40', lengthIn: '27.2', sleeveIn: '25.4' },
    { size: 'L', chestCm: '102 - 105', lengthCm: '71', sleeveCm: '66', chestIn: '40 - 41.5', lengthIn: '28.0', sleeveIn: '26.0' },
    { size: 'XL', chestCm: '106 - 110', lengthCm: '73', sleeveCm: '67.5', chestIn: '41.5 - 43.5', lengthIn: '28.7', sleeveIn: '26.6' },
  ];

  const trouserSizes = [
    { size: '40 (S)', waistCm: '78 - 81', hipCm: '96', inseamCm: '82', waistIn: '30.5 - 32', hipIn: '37.8', inseamIn: '32.3' },
    { size: '42 (M)', waistCm: '82 - 85', hipCm: '100', inseamCm: '83', waistIn: '32 - 33.5', hipIn: '39.4', inseamIn: '32.7' },
    { size: '44 (L)', waistCm: '86 - 89', hipCm: '104', inseamCm: '84', waistIn: '33.8 - 35', hipIn: '41.0', inseamIn: '33.1' },
    { size: '46 (XL)', waistCm: '90 - 93', hipCm: '108', inseamCm: '85', waistIn: '35.4 - 36.6', hipIn: '42.5', inseamIn: '33.5' },
    { size: '48 (XXL)', waistCm: '94 - 98', hipCm: '112', inseamCm: '86', waistIn: '37 - 38.5', hipIn: '44.1', inseamIn: '33.9' },
  ];

  const rows = category === 'trousers' ? trouserSizes : category === 'knitwear' || category === 'polos' ? knitSizes : jacketSizes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11161C] border border-slate-800 rounded-sm shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-slate-300" />
            <h3 className="text-base font-semibold text-white tracking-wider uppercase">
              {language === 'ar' ? 'دليل القياسات والمقاسات الرسمية' : 'Bespoke Size Blueprint'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between mt-5 mb-4">
          <span className="text-xs text-slate-400 font-light">
            {language === 'ar' ? 'جميع القياسات مأخوذة بدقة بالميليمتر لقصة إيطالية متوازنة' : 'All measurements calibrated for precise tailored drape'}
          </span>
          <div className="flex items-center border border-slate-800 rounded p-0.5 text-xs bg-[#090C10]">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded transition-colors ${unit === 'cm' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded transition-colors ${unit === 'in' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-sm">
          <table className="w-full text-xs text-start tabular-nums">
            <thead className="bg-[#151D26] text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                {category === 'trousers' ? (
                  <>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'الخصر' : 'Waist'}</th>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'الورك' : 'Hips'}</th>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'طول الساق الداخلي' : 'Inseam'}</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'محيط الصدر' : 'Chest'}</th>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'الخصر / الطول' : 'Waist / Length'}</th>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'عرض الكتفين' : 'Shoulders'}</th>
                    <th className="py-3 px-4 text-start font-medium">{language === 'ar' ? 'طول الكم' : 'Sleeve'}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rows.map((row: any) => (
                <tr key={row.size} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{row.size}</td>
                  {category === 'trousers' ? (
                    <>
                      <td className="py-3 px-4">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                      <td className="py-3 px-4">{unit === 'cm' ? row.hipCm : row.hipIn}</td>
                      <td className="py-3 px-4">{unit === 'cm' ? row.inseamCm : row.inseamIn}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                      <td className="py-3 px-4">{unit === 'cm' ? (row.waistCm || row.lengthCm) : (row.waistIn || row.lengthIn)}</td>
                      <td className="py-3 px-4">{unit === 'cm' ? (row.shoulderCm || '—') : (row.shoulderIn || '—')}</td>
                      <td className="py-3 px-4">{unit === 'cm' ? row.sleeveCm : row.sleeveIn}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expert Tip */}
        <div className="mt-5 p-3.5 bg-[#0D1117] border border-slate-800 rounded-sm text-xs text-slate-400">
          <p className="leading-relaxed">
            <span className="text-white font-medium">
              {language === 'ar' ? 'نصيحة خياط فيلار:' : 'Atelier Advisory:'}
            </span>{' '}
            {language === 'ar'
              ? 'إذا كنت متردداً بين مقاسين، نوصي باختيار المقاس الأكبر للقطع الخارجية كالمعاطف لسهولة ارتداء الكنزات أسفلها، أو استشر خبيرنا في تبويب المستشار الذكي.'
              : 'When positioned between sizes, we recommend sizing up for structured overcoats to accommodate knitwear layers.'}
          </p>
        </div>
      </div>
    </div>
  );
};
