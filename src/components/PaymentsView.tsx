import React, { useState } from 'react';
import {
  Banknote,
  Smartphone,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { PaymentMethodConfig } from '../types';
import type { Lang } from '../lib/translations';

interface PaymentsViewProps {
  paymentMethods: PaymentMethodConfig[];
  onUpdatePaymentMethods: (methods: PaymentMethodConfig[]) => void;
  lang?: Lang;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  paymentMethods,
  onUpdatePaymentMethods,
  lang = 'FR'
}) => {
  const [methods, setMethods] = useState<PaymentMethodConfig[]>(paymentMethods);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isArabic = lang === 'AR';

  // Toggle activation of a payment method
  const handleToggle = (id: string) => {
    const target = methods.find((m) => m.id === id);
    if (!target) return;

    if (target.id === 'cash' && target.enabled) {
      const otherEnabled = methods.some((m) => m.id !== 'cash' && m.enabled);
      if (!otherEnabled) {
        showToast(
          isArabic
            ? 'تنبيه: لا يمكن تعطيل الدفع نقدًا لأنه الخيار الوحيد النشط حاليًا للعملاء.'
            : 'Impossible de désactiver le Cash : au moins un moyen de paiement doit rester actif pour les clients.'
        );
        return;
      }
    }

    const updated = methods.map((m) => {
      if (m.id === id) {
        const nextEnabled = !m.enabled;
        return {
          ...m,
          enabled: nextEnabled,
          partnershipStatus: nextEnabled && m.id !== 'cash' ? ('active' as const) : m.partnershipStatus
        };
      }
      return m;
    });

    setMethods(updated);
    onUpdatePaymentMethods(updated);

    const toggled = updated.find((m) => m.id === id);
    const actionText = toggled?.enabled
      ? isArabic
        ? `تم تفعيل ${toggled.nameAr} بنجاح`
        : `${toggled?.name} activé avec succès`
      : isArabic
      ? `تم تعطيل ${toggled?.nameAr}`
      : `${toggled?.name} désactivé`;

    showToast(actionText);
  };

  const handleUpdateMerchantCode = (id: string, code: string) => {
    const updated = methods.map((m) => (m.id === id ? { ...m, merchantCode: code } : m));
    setMethods(updated);
    onUpdatePaymentMethods(updated);
    showToast(isArabic ? 'تم تحديث كود التاجر' : 'Code marchand mis à jour');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeCount = methods.filter((m) => m.enabled).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-xs font-bold mb-3">
              <Banknote className="w-3.5 h-3.5" />
              {isArabic ? 'إدارة وسائل الدفع' : 'Passerelle de Paiement · Rapido Nouakchott'}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isArabic ? 'طرق الدفع والتطبيقات البنكية' : 'Moyens de Paiement & Partenariats Bancaires'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-3xl">
              {isArabic
                ? 'حاليًا، يدفع العملاء نقدًا فقط (Cash). يمكنك تفعيل التطبيقات البنكية بمجرد توقيع اتفاقيات الشراكة.'
                : 'Pour le moment, les clients payent uniquement en Cash (espèces). Activez les passerelles bancaires mauritaniennes dès validation des accords de partenariat.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-slate-900">{activeCount}</div>
              <div className="text-[11px] font-semibold text-slate-500">
                {isArabic ? 'وسائل نشطة' : 'Moyens actifs'}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-orange-600">
                {methods.find((m) => m.id === 'cash')?.enabled ? (isArabic ? 'نقدًا' : 'Cash') : '—'}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {isArabic ? 'الوضع الافتراضي' : 'Mode principal'}
              </div>
            </div>
          </div>
        </div>

        {/* Current status alert */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>{isArabic ? 'توجيه الإدارة العامة :' : 'Règle opérationnelle en vigueur :'}</strong>{' '}
            {isArabic
              ? 'الدفع نقدًا (Cash) هو الوسيلة المفتوحة للركاب حاليًا. التطبيقات البنكية تفعل بنقرة واحدة عند توقيع الاتفاقية.'
              : 'Le paiement en espèces (Cash) est le mode de règlement actif par défaut pour les passagers à Nouakchott. Les intégrations bancaires peuvent être activées d\'un simple clic dès que vos conventions sont signées.'}
          </div>
        </div>
      </div>

      {/* Grid of Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {methods.map((method) => {
          const isCash = method.id === 'cash';

          return (
            <div
              key={method.id}
              className={`rounded-2xl border transition-all duration-200 bg-white p-5 flex flex-col justify-between shadow-xs ${
                method.enabled
                  ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                  : 'border-slate-200 opacity-90 hover:opacity-100'
              }`}
            >
              <div>
                {/* Card Top: Logo / Name / Toggle switch */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                      style={{ backgroundColor: method.color }}
                    >
                      {isCash ? <Banknote className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {isArabic ? method.nameAr : method.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{method.provider}</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(method.id)}
                    role="switch"
                    aria-checked={method.enabled}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      method.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        method.enabled ? (isArabic ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Partnership Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      method.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        method.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    {method.enabled
                      ? isArabic
                        ? 'متاح'
                        : 'Disponible'
                      : isArabic
                      ? 'معطل'
                      : 'Désactivé'}
                  </span>

                  {isCash && (
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold">
                      {isArabic ? 'الأساسي' : 'Défaut'}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Merchant code input for partner apps */}
              {!isCash && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{isArabic ? 'كود التاجر (Code Marchand) :' : 'Identifiant Marchand API :'}</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {method.merchantCode || (isArabic ? 'غير مضبوط' : 'Non configuré')}
                    </span>
                  </div>

                  <input
                    type="text"
                    defaultValue={method.merchantCode || ''}
                    placeholder={isArabic ? 'أدخل كود الشراكة...' : 'Ex: RAPIDO-BPM-2026'}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    onBlur={(e) => handleUpdateMerchantCode(method.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
