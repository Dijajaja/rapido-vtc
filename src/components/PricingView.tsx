import React, { useState } from 'react';
import {
  Tag,
  DollarSign,
  Car,
  MapPin,
  Clock,
  Moon,
  Zap,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  Sliders,
  Plane
} from 'lucide-react';
import type { PricingSettings } from '../types';
import type { Lang } from '../lib/translations';

interface PricingViewProps {
  pricing: PricingSettings;
  onUpdatePricing: (newPricing: PricingSettings) => void;
  lang?: Lang;
}

export const PricingView: React.FC<PricingViewProps> = ({
  pricing,
  onUpdatePricing,
  lang = 'FR'
}) => {
  const [current, setCurrent] = useState<PricingSettings>(pricing);
  const [toast, setToast] = useState<string | null>(null);

  const isArabic = lang === 'AR';

  const handleRuleChange = (
    category: 'economique' | 'confort' | 'premium' | 'van',
    field: keyof PricingSettings['rules']['economique'],
    val: number
  ) => {
    const safeVal = Math.max(0, Number(val) || 0);
    setCurrent((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [category]: {
          ...prev.rules[category],
          [field]: safeVal
        }
      }
    }));
  };

  const handleFlatRateChange = (id: string, price: number) => {
    const safePrice = Math.max(0, Number(price) || 0);
    setCurrent((prev) => ({
      ...prev,
      flatRates: prev.flatRates.map((fr) => (fr.id === id ? { ...fr, priceMru: safePrice } : fr))
    }));
  };

  const handleSave = () => {
    onUpdatePricing(current);
    setToast(
      isArabic
        ? 'تم حفظ تعريفة الأسعار بنجاح!'
        : 'La grille tarifaire Rapido a été mise à jour avec succès !'
    );
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-xs font-bold mb-3">
            <Tag className="w-3.5 h-3.5" />
            {isArabic ? 'التعريفة والأسعار' : 'Grille Tarifaire · Nouakchott MRU'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isArabic ? 'إدارة أسعار الرحلات' : 'Tarification des Courses'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {isArabic
              ? 'تحديد سعر الكيلومتر، فتح العداد، وسعر الدقيقة لكل فئة من فئات السيارات في نواكشوط.'
              : 'Configurez la prise en charge de base, le tarif kilométrique et les forfaits aéroport en Ouguiya (MRU).'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition self-start md:self-center"
        >
          <Save className="w-4 h-4" />
          {isArabic ? 'حفظ الأسعار' : 'Enregistrer la grille'}
        </button>
      </div>

      {/* Category Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {(['economique', 'confort', 'premium', 'van'] as const).map((cat) => {
          const rule = current.rules[cat];
          const titles = {
            economique: { fr: 'Économique', ar: 'اقتصادي', badge: 'Standard' },
            confort: { fr: 'Confort', ar: 'مريح', badge: 'Climatisé' },
            premium: { fr: 'Premium', ar: 'بريميوم VIP', badge: 'Haut de gamme' },
            van: { fr: 'Van / Famille', ar: 'عائلي 7 مقاعد', badge: 'Grand volume' },
          };

          return (
            <div key={cat} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isArabic ? titles[cat].ar : titles[cat].fr}
                  </h3>
                  <span className="text-[10px] font-semibold text-orange-600 uppercase">
                    {titles[cat].badge}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Car className="w-4 h-4" />
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">
                    {isArabic ? 'فتح العداد (Prise en charge) :' : 'Prise en charge de base :'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={rule.baseFareMru}
                      onChange={(e) => handleRuleChange(cat, 'baseFareMru', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <span className="text-[11px] font-bold text-slate-400">MRU</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">
                    {isArabic ? 'سعر الكيلومتر (Prix / km) :' : 'Prix au kilomètre :'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={rule.pricePerKmMru}
                      onChange={(e) => handleRuleChange(cat, 'pricePerKmMru', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <span className="text-[11px] font-bold text-slate-400">MRU</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">
                    {isArabic ? 'سعر الدقيقة (Prix / min) :' : 'Prix à la minute :'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={rule.pricePerMinMru}
                      onChange={(e) => handleRuleChange(cat, 'pricePerMinMru', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <span className="text-[11px] font-bold text-slate-400">MRU</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">
                    {isArabic ? 'الحد الأدنى للرحلة :' : 'Course minimale :'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={rule.minFareMru}
                      onChange={(e) => handleRuleChange(cat, 'minFareMru', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <span className="text-[11px] font-bold text-slate-400">MRU</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flat Rates (Airport & Long Distance) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isArabic ? 'الأسعار الثابتة للمطار والمحاور الخاصة' : 'Forfaits Fixes Nouakchott (Aéroport Oumtounsy)'}
              </h3>
              <p className="text-xs text-slate-500">
                Tarifs garantis sans compteur pour les liaisons stratégiques
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {current.flatRates.map((flat) => (
            <div key={flat.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-bold text-slate-900">{flat.from} ➔ {flat.to}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{flat.category}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Prix forfaitaire :</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={flat.priceMru}
                    onChange={(e) => handleFlatRateChange(flat.id, Number(e.target.value))}
                    className="w-20 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-500">MRU</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
