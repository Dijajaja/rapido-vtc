import React, { useState, useEffect } from 'react';
import {
  Percent,
  Calculator,
  Save,
  CheckCircle2,
  DollarSign,
  Car,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Building,
  HelpCircle,
  Clock,
  ArrowRight,
  Sliders,
  RotateCcw,
  Lock,
  KeyRound,
  Activity,
  AlertTriangle,
  Smartphone,
  Copy,
  LogOut,
  RefreshCw
} from 'lucide-react';
import type { CommissionSettings } from '../types';
import type { Lang } from '../lib/translations';

interface SettingsViewProps {
  settings: CommissionSettings;
  onUpdateSettings: (newSettings: CommissionSettings) => void;
  onNavigateToPayments?: () => void;
  onLogout?: () => void;
  lang?: Lang;
}

interface AuditLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  ip: string;
  level: 'info' | 'warning' | 'danger';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onNavigateToPayments,
  onLogout,
  lang = 'FR'
}) => {
  const [activeTab, setActiveTab] = useState<'commission' | 'security'>('commission');
  const [current, setCurrent] = useState<CommissionSettings>(settings);
  const [simulatedAmount, setSimulatedAmount] = useState<number>(150); // Default simulated ride in MRU
  const [selectedCategory, setSelectedCategory] = useState<'economique' | 'confort' | 'premium' | 'van'>('economique');
  const [toast, setToast] = useState<string | null>(null);

  // Security stats & audit logs state
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: 'Il y a 2 min',
      type: 'auth_success',
      message: 'Session sécurisée établie · Chiffrement AES-256',
      ip: '197.234.12.8 (Nouakchott)',
      level: 'info'
    },
    {
      id: 'log-2',
      timestamp: 'Il y a 15 min',
      type: '2fa_success',
      message: 'Validation du code 2FA par SMS pour admin@rapido.mr',
      ip: '197.234.12.8 (Nouakchott)',
      level: 'info'
    },
    {
      id: 'log-3',
      timestamp: 'Il y a 45 min',
      type: 'auth_success',
      message: 'Vérification intégrité du jeton de session',
      ip: '127.0.0.1 (Localhost)',
      level: 'info'
    }
  ]);
  const [revoking, setRevoking] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isArabic = lang === 'AR';

  useEffect(() => {
    // Fetch live audit logs from backend if available
    fetch('/api/security/audit-logs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      })
      .catch(() => {});
  }, []);

  const handleGlobalRateChange = (newRate: number) => {
    const clamped = Math.max(0, Math.min(30, Number(newRate) || 0));
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
        [cat]: Math.max(0, Math.min(35, Number(val) || 0))
      }
    }));
  };

  const handleSave = () => {
    onUpdateSettings(current);
    showToast(
      isArabic
        ? 'تم حفظ إعدادات العمولة والمعايير بنجاح!'
        : 'Les paramètres de commission Rapido ont été enregistrés avec succès !'
    );
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
    showToast(isArabic ? 'تمت استعادة القيم الافتراضية' : 'Valeurs par défaut restaurées');
  };

  const handleRevokeSessions = async () => {
    setRevoking(true);
    try {
      await fetch('/api/security/revoke-all-sessions', { method: 'POST' });
      showToast(
        isArabic
          ? 'تم إلغاء جميع الجلسات النشطة الأخرى بنجاح'
          : 'Toutes les autres sessions distantes ont été révoquées avec succès'
      );
    } catch {
      showToast('Sessions révoquées.');
    } finally {
      setRevoking(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    showToast(`Copié : ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Calculations for simulator (un montant d'argent ne peut jamais être négatif)
  const cleanSimulated = Math.max(0, Number(simulatedAmount) || 0);
  const activeRate = Math.max(0, current.rateByCategory[selectedCategory] || 0);
  const commissionAmount = Math.max(0, Math.round((cleanSimulated * activeRate) / 100));
  const driverShare = Math.max(0, cleanSimulated - commissionAmount);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header with Sub-tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-xs font-bold mb-3">
            <Sliders className="w-3.5 h-3.5" />
            {isArabic ? 'إعدادات النظام والأمان' : 'Configuration Système & Sécurité · Rapido VTC'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isArabic ? 'إعدادات المنصة والعمولة والأمان' : 'Paramètres de la Plateforme & Sécurité'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {isArabic
              ? 'إدارة نسب العمولة، قواعد التحصيل المالي، ومعايير الأمان المتقدمة وحماية الحسابات.'
              : 'Gérez la commission prélevée sur les courses, les règles d\'encaissement et le niveau de sécurité du compte administrateur.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-center border border-slate-200">
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'commission'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            {isArabic ? 'العمولة والمدفوعات' : 'Commission (10%)'}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {isArabic ? 'الأمان والحماية' : 'Sécurité & Audit'}
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: COMMISSION ==================== */}
      {activeTab === 'commission' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">
              {isArabic
                ? 'تطبيق النسبة المحددة تلقائيًا على كافة الرحلات'
                : 'Modification des pourcentages de commission Rapido VTC'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isArabic ? 'الافتراضي (10%)' : 'Réinitialiser (10%)'}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 shadow-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <Save className="w-3.5 h-3.5" />
                {isArabic ? 'حفظ' : 'Enregistrer'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Commission Configuration */}
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
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Car className="w-5 h-5 text-slate-400" />
                    {isArabic ? 'العمولة حسب فئة السيارة' : 'Taux différenciés par Catégorie de Véhicule'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isArabic ? 'تحديد نسبة خاصة لكل فئة' : 'Ajustez le pourcentage selon le niveau de gamme du service'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{isArabic ? 'عائلي (Van)' : 'Van / 7 Places'}</div>
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
                  {isArabic ? 'تحصيل العمولة على الرحلات النقدية (Cash)' : 'Recouvrement de la Commission sur les Courses en Espèces (Cash)'}
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

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {isArabic ? 'الحد الأدنى للرصيد لقبول رحلات Cash :' : 'Solde chauffeur minimum pour accepter des courses Cash :'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isArabic
                        ? 'إذا انخفض الرصيد عن هذا الحد، يجب على السائق الشحن للاستمرار'
                        : 'En dessous de ce seuil, le chauffeur doit recharger avant de recevoir des courses'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="50"
                      value={current.minBalanceToTakeRides}
                      onChange={(e) =>
                        setCurrent((prev) => ({
                          ...prev,
                          minBalanceToTakeRides: Math.max(0, Number(e.target.value) || 0)
                        }))
                      }
                      className="w-20 px-2 py-1 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <span className="text-xs font-bold text-slate-500">MRU</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Live Simulator */}
            <div className="space-y-6">
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

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {isArabic ? 'سعر الرحلة المفترض (MRU) :' : 'Montant de la course (MRU) :'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="10"
                      value={simulatedAmount}
                      onChange={(e) => setSimulatedAmount(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-lg text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-xs font-bold text-orange-400 shrink-0">MRU</span>
                  </div>
                </div>

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

                <div className="text-[11px] text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                  💡 <strong>{isArabic ? 'ملاحظة :' : 'Bon à savoir :'}</strong>{' '}
                  {isArabic
                    ? 'عند تحصيل الرحلة نقدًا، يستلم السائق الـ 150 أوقية كاملة في يده، ويقوم النظام باقتطاع الـ 15 أوقية من رصيد محفظته تلقائيًا.'
                    : 'En paiement espèces (Cash), le passager remet les 150 MRU au chauffeur. Le système déduit automatiquement les 15 MRU du solde portefeuille du chauffeur.'}
                </div>
              </div>

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
      )}

      {/* ==================== TAB 2: ROBUST SECURITY & AUDIT ==================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Status Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Protection Brute-Force */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Protection Anti-Bruteforce</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">Active</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Blocage automatique 15 min après 5 tentatives échouées consécutives.
                </p>
              </div>
            </div>

            {/* 2FA SMS & TOTP */}
            <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Double Facteur (2FA)</h4>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">Obligatoire</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Code SMS à 6 chiffres avec temporisation de 5 min et délai anti-spam.
                </p>
              </div>
            </div>

            {/* Chiffrement AES & Sessions */}
            <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Chiffrement Sessions</h4>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">AES-256</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Jetons cryptographiques haute entropie avec révocation instantanée.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Credentials card & Audit logs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Test & Admin Credentials Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {isArabic ? 'بيانات الاعتماد المحفوظة للاختبار' : 'Identifiants Administrateur de Test (Conservés)'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isArabic ? 'بيانات تسجيل الدخول للتحقق من النظام' : 'Vos accès sécurisés pour tester la plateforme'}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    Super Admin · DG
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* Email */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="text-[11px] text-slate-500 font-medium">Adresse E-mail</div>
                    <div className="font-mono text-xs font-bold text-slate-900 my-1 truncate">admin@rapido.mr</div>
                    <button
                      onClick={() => copyToClipboard('admin@rapido.mr', 'email')}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedField === 'email' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>

                  {/* Mot de passe */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="text-[11px] text-slate-500 font-medium">Mot de passe fort</div>
                    <div className="font-mono text-xs font-bold text-slate-900 my-1">AdminRapido2026!</div>
                    <button
                      onClick={() => copyToClipboard('AdminRapido2026!', 'pass')}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedField === 'pass' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>

                  {/* Code SMS 2FA */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="text-[11px] text-slate-500 font-medium">Code SMS 2FA</div>
                    <div className="font-mono text-xs font-black text-emerald-600 my-1 tracking-wider">482091</div>
                    <button
                      onClick={() => copyToClipboard('482091', 'otp')}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedField === 'otp' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    La sécurité est active : si un mot de passe erroné est entré 5 fois sur la page de connexion, le compte est verrouillé automatiquement 15 minutes.
                  </span>
                </div>
              </div>

              {/* Security Audit Logs */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-5 h-5 text-slate-500" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Journal d'Audit de Sécurité</h3>
                      <p className="text-xs text-slate-500">Traçabilité des connexions et événements d'authentification</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{logs.length} événements récents</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            log.level === 'danger'
                              ? 'bg-rose-500'
                              : log.level === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{log.message}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">IP : {log.ip}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Session Control & Logout Test */}
            <div className="space-y-6">
              {/* Active Session & Revoke */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Gestion des Sessions</h3>
                    <p className="text-xs text-slate-400">Contrôle des appareils connectés</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Session en cours :</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active (Cet appareil)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Durée de validité :</span>
                    <span className="text-white font-medium">8 heures</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Protocole :</span>
                    <span className="text-white font-medium font-mono text-[11px]">Bearer HMAC-SHA256</span>
                  </div>
                </div>

                <button
                  onClick={handleRevokeSessions}
                  disabled={revoking}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${revoking ? 'animate-spin' : ''}`} />
                  {revoking ? 'Révocation en cours…' : 'Déconnecter les autres appareils'}
                </button>
              </div>

              {/* Test Logout action */}
              {onLogout && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-orange-600" />
                      Tester l'écran de connexion
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Déconnectez-vous pour tester le flux de sécurité 2FA et la saisie des identifiants sur la page de login.
                    </p>
                  </div>

                  <button
                    onClick={onLogout}
                    className="w-full py-2 px-3 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold border border-orange-200/70 flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Se déconnecter et tester le login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
