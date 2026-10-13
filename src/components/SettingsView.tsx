import React, { useState } from 'react';
import {
  Percent,
  Calculator,
  Save,
  CheckCircle2,
  DollarSign,
  Car,
  ShieldAlert,
  Wallet,
  Building,
  HelpCircle,
  Clock,
  ArrowRight,
  Sliders,
  RotateCcw
} from 'lucide-react';
import type { CommissionSettings } from '../types';
import type { Lang } from '../lib/translations';

interface SettingsViewProps {
  settings: CommissionSettings;
  onUpdateSettings: (newSettings: CommissionSettings) => void;
  onNavigateToPayments?: () => void;
  lang?: Lang;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onNavigateToPayments,
  lang = 'FR'
}) => {
  const [current, setCurrent] = useState<CommissionSettings>(settings);
  const [simulatedAmount, setSimulatedAmount] = useState<number>(150); // Default simulated ride in MRU
  const [selectedCategory, setSelectedCategory] = useState<'economique' | 'confort' | 'premium' | 'van'>('economique');
  const [toast, setToast] = useState<string | null>(null);

  const isArabic = lang === 'AR';

  const handleGlobalRateChange = (newRate: number) => {
    const clamped = Math.max(1, Math.min(30, newRate));
    setCurrent((prev) => ({
      ...prev,
      globalRate: clamped,
      rateByCategory: {
        economique: clamped,
        confort: Math.min(30, clamped + 2),
        premium: Math.min(30, clamped + 5),
        van: Math.min(30, clamped + 2),
      }
    }));
  };

  const handleCategoryRateChange = (cat: 'economique' | 'confort' | 'premium' | 'van', val: number) => {
    setCurrent((prev) => ({
      ...prev,
      rateByCategory: {
        ...prev.rateByCategory,
        [cat]: Math.max(1, Math.min(35, val))
      }
    }));
  };

  const handleSave = () => {
    onUpdateSettings(current);
    setToast(
      isArabic
        ? 'تم حفظ إعدادات العمولة والمعايير بنجاح!'
        : 'Les paramètres de commission Rapido ont été enregistrés avec succès !'
    );
    setTimeout(() => setToast(null), 3500);
  };

  const handleReset = () => {
    const defaults: CommissionSettings = {
      globalRate: 10,
      rateByCategory: {
        economique: 10,
        confort: 12,
        premium: 15,
        van: 12,
      },
      driverPayoutFrequency: 'instant',
      cashCollectionMode: 'wallet_deduction',
      minBalanceToTakeRides: 200,
      taxIncluded: true
    };
    setCurrent(defaults);
    onUpdateSettings(defaults);
    setToast(isArabic ? 'تمت استعادة القيم الافتراضية' : 'Valeurs par défaut restaurées');
    setTimeout(() => setToast(null), 3500);
  };

  // Calculations for simulator
  const activeRate = current.rateByCategory[selectedCategory];
  const commissionAmount = Math.round((simulatedAmount * activeRate) / 100);
  const driverShare = simulatedAmount - commissionAmount;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
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
            <Percent className="w-3.5 h-3.5" />
            {isArabic ? 'إعدادات المنصة والعمولة' : 'Configuration Financière · Rapido VTC'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isArabic ? 'إعدادات العمولة والمدفوعات' : 'Paramètres de la Commission & Encaissements'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {isArabic
              ? 'تحديد نسبة العمولة المقتطعة من السائقين على كل رحلة منجزة، وطريقة تحصيل عمولة الرحلات النقدية (Cash).'
              : 'Définissez le taux de commission prélevé sur les courses, les règles par catégorie de véhicule et le mode de recouvrement sur les paiements en Cash.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4" />
            {isArabic ? 'الافتراضي (10%)' : 'Réinitialiser (10%)'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            {isArabic ? 'حفظ التعديلات' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Commission Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Global Commission Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isArabic ? 'نسبة العمولة العامة للمنصة' : 'Taux de Commission Global Rapido'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic ? 'القيمة المطبقة كقاعدة أساسية لجميع الرحلات' : 'Taux de référence appliqué sur le montant total de la course'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-orange-600">{current.globalRate}%</span>
              </div>
            </div>

            {/* Slider */}
            <div className="py-6 space-y-3">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>5 % (Incitatif)</span>
                <span className="font-bold text-orange-600">{current.globalRate} %</span>
                <span>25 % (Standard VTC)</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={current.globalRate}
                onChange={(e) => handleGlobalRateChange(Number(e.target.value))}
                className="w-full accent-orange-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 self-center me-2">
                {isArabic ? 'نسب شائعة :' : 'Paliers rapides :'}
              </span>
              {[8, 10, 12, 15, 18, 20].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleGlobalRateChange(rate)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    current.globalRate === rate
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rate} %
                </button>
              ))}
            </div>
          </div>

          {/* Rates by Vehicle Category */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Car className="w-5 h-5 text-slate-400" />
                  {isArabic ? 'العمولة حسب فئة السيارة' : 'Taux différenciés par Catégorie de Véhicule'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isArabic
                    ? 'يمكنك تحديد نسبة خاصة لكل فئة (اقتصادي، مريح، بريميوم، عائلي)'
                    : 'Ajustez le pourcentage selon le niveau de gamme du service'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Économique */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{isArabic ? 'اقتصادي (Éco)' : 'Économique'}</div>
                  <div className="text-[11px] text-slate-500">Toyota Corolla, Yaris, Accent</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={current.rateByCategory.economique}
                    onChange={(e) => handleCategoryRateChange('economique', Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>

              {/* Confort */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{isArabic ? 'مريح (Confort)' : 'Confort'}</div>
                  <div className="text-[11px] text-slate-500">Climatisation, berlines récentes</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={current.rateByCategory.confort}
                    onChange={(e) => handleCategoryRateChange('confort', Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>

              {/* Premium */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{isArabic ? 'بريميوم (Premium)' : 'Premium / VIP'}</div>
                  <div className="text-[11px] text-slate-500">Véhicules haut de gamme, SUV</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="35"
                    value={current.rateByCategory.premium}
                    onChange={(e) => handleCategoryRateChange('premium', Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>

              {/* Van */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{isArabic ? 'عائلي (Van / Famille)' : 'Van / 7 Places'}</div>
                  <div className="text-[11px] text-slate-500">Groupes & transferts aéroport</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="35"
                    value={current.rateByCategory.van}
                    onChange={(e) => handleCategoryRateChange('van', Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cash Recouvrement Rules */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Wallet className="w-5 h-5 text-orange-500" />
              {isArabic
                ? 'آلية تحصيل العمولة على الرحلات النقدية (Cash)'
                : 'Recouvrement de la Commission sur les Courses en Espèces (Cash)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isArabic
                ? 'نظرًا لأن الركاب يدفعون نقدًا للسائقين، كيف تستوفي الشركة عمولتها؟'
                : 'Comme le passager remet le cash directement au chauffeur, voici comment Rapido récupère sa commission :'}
            </p>

            <div className="space-y-3 pt-1">
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  current.cashCollectionMode === 'wallet_deduction'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="collectionMode"
                  checked={current.cashCollectionMode === 'wallet_deduction'}
                  onChange={() => setCurrent((prev) => ({ ...prev, cashCollectionMode: 'wallet_deduction' }))}
                  className="mt-1 accent-orange-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {isArabic ? 'الخصم الفوري من المحفظة الرقمية للسائق (موصى به)' : 'Déduction instantanée sur le Portefeuille Chauffeur (Recommandé)'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isArabic
                      ? 'يشحن السائق رصيده مسبقًا، وتخصم عمولة Rapido تلقائيًا عند إنهاء كل رحلة.'
                      : 'Le chauffeur recharge son solde compte conducteur à l\'avance. À chaque fin de course cash, la commission est débitée automatiquement de son solde.'}
                  </div>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  current.cashCollectionMode === 'weekly_invoice'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="collectionMode"
                  checked={current.cashCollectionMode === 'weekly_invoice'}
                  onChange={() => setCurrent((prev) => ({ ...prev, cashCollectionMode: 'weekly_invoice' }))}
                  className="mt-1 accent-orange-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {isArabic ? 'فواتير دورية أسبوعية' : 'Décompte et facturation hebdomadaire'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isArabic
                      ? 'يتم إصدار كشف حساب كل يوم أحد مع سداد العمولة المجمعة.'
                      : 'Un relevé est généré chaque semaine et le chauffeur règle ses commissions dues au bureau Rapido ou par virement.'}
                  </div>
                </div>
              </label>
            </div>

            {/* Minimum balance requirement */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {isArabic ? 'الحد الأدنى للرصيد لقبول رحلات Cash :' : 'Solde chauffeur minimum pour accepter des courses Cash :'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isArabic
                    ? 'إذا انخفض الرصيد عن هذا الحد، يجب على السائق الشحن للاستمرار'
                    : 'En dessous de ce seuil, le chauffeur est invité à recharger avant de recevoir des courses'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="1000"
                  step="50"
                  value={current.minBalanceToTakeRides}
                  onChange={(e) =>
                    setCurrent((prev) => ({
                      ...prev,
                      minBalanceToTakeRides: Number(e.target.value)
                    }))
                  }
                  className="w-20 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
                <span className="text-xs font-bold text-slate-500">MRU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Live Simulator & Quick Links */}
        <div className="space-y-6">
          {/* Live Simulator Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/30">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {isArabic ? 'محاكي الأرباح والعمولة' : 'Simulateur de Répartition'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isArabic ? 'تجربة حية لحساب حصة السائق والمنصة' : 'Calcul en temps réel selon vos réglages'}
                </p>
              </div>
            </div>

            {/* Select category */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isArabic ? 'فئة الخدمة :' : 'Catégorie de course :'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['economique', 'confort', 'premium', 'van'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold capitalize transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {cat} ({current.rateByCategory[cat]}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Input simulated ride amount */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isArabic ? 'سعر الرحلة المفترض (MRU) :' : 'Montant de la course (MRU) :'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="2000"
                  step="10"
                  value={simulatedAmount}
                  onChange={(e) => setSimulatedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-lg text-white focus:outline-none focus:border-orange-500"
                />
                <span className="text-xs font-bold text-orange-400 shrink-0">MRU</span>
              </div>
            </div>

            {/* Result Breakdown */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isArabic ? 'سعر الرحلة الإجمالي :' : 'Montant réglé par le client :'}</span>
                <span className="font-bold text-white">{simulatedAmount} MRU</span>
              </div>

              <div className="flex items-center justify-between text-xs text-orange-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  {isArabic ? 'عمولة Rapido VTC' : 'Commission Rapido'} ({activeRate}%) :
                </span>
                <span className="font-extrabold text-sm">+{commissionAmount} MRU</span>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {isArabic ? 'صافي ربح السائق' : 'Revenu net du chauffeur'} ({100 - activeRate}%) :
                </span>
                <span className="font-extrabold text-sm">{driverShare} MRU</span>
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="text-[11px] text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
              💡 <strong>{isArabic ? 'ملاحظة :' : 'Bon à savoir :'}</strong>{' '}
              {isArabic
                ? 'عند تحصيل الرحلة نقدًا، يستلم السائق الـ 150 أوقية كاملة في يده، ويقوم النظام باقتطاع الـ 15 أوقية من رصيد محفظته تلقائيًا.'
                : 'En paiement espèces (Cash), le passager remet les 150 MRU au chauffeur. Le système déduit automatiquement les 15 MRU du solde portefeuille du chauffeur.'}
            </div>
          </div>

          {/* Quick link to Payments tab */}
          {onNavigateToPayments && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {isArabic ? 'طرق الدفع والتطبيقات البنكية' : 'Moyens de Paiement'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isArabic ? 'تفعيل أو تعطيل Bankily, Masrvi, Sedad...' : 'Activer / désactiver Cash, Bankily, Masrvi...'}
                  </p>
                </div>
                <button
                  onClick={onNavigateToPayments}
                  className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  {isArabic ? 'إدارة' : 'Gérer'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
