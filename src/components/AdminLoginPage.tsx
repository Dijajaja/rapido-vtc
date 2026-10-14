import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import type { AdminUser } from '../types';

type AuthLanguage = 'FR' | 'AR';
type AuthStep = 'credentials' | 'twoFactor';

interface AdminLoginPageProps {
  lang: AuthLanguage;
  onLanguageChange: (language: AuthLanguage) => void;
  onSuccess: (user: AdminUser, token: string, rememberMe: boolean) => void;
}

const copy = {
  FR: {
    backOffice: 'Back-office · Nouakchott',
    heroFirst: 'Pilotez votre flotte',
    heroAccent: 'en temps réel.',
    heroArabic: 'إدارة أسطولك في الوقت الفعلي',
    heroDescription: "Courses, chauffeurs, validations de dossiers et commissions : toute l’activité de la plateforme au même endroit.",
    onlineDrivers: 'Chauffeurs en ligne',
    ridesToday: "Courses aujourd’hui",
    pendingFiles: 'Dossiers à valider',
    french: 'Français',
    arabic: 'العربية',
    loginTitle: 'Connexion administrateur',
    loginArabic: 'تسجيل دخول المسؤول',
    loginSubtitle: 'Connectez-vous avec vos identifiants professionnels.',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    forgotMessage: 'La réinitialisation du mot de passe doit être effectuée par votre administrateur.',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    remember: 'Rester connecté sur cet appareil (8 h)',
    fill: 'Remplir',
    login: 'Se connecter',
    signingIn: 'Vérification en cours…',
    loginInfo: 'Un code de vérification vous sera envoyé par SMS après la saisie du mot de passe. Après 5 tentatives échouées, le compte est bloqué 15 minutes.',
    footer: 'Accès réservé au personnel autorisé',
    encrypted: 'Connexion chiffrée',
    return: 'Retour',
    twoFactorTitle: 'Vérification en 2 étapes',
    twoFactorArabic: 'التحقق بخطوتين',
    twoFactorSubtitle: 'Saisissez le code à 6 chiffres envoyé au',
    expiry: 'Code valide pendant',
    resendIn: 'Renvoyer le code dans',
    resend: 'Renvoyer le code',
    verify: 'Vérifier et accéder au tableau de bord',
    verifying: 'Vérification en cours…',
    backup: 'Utiliser un code de secours',
    backupUnavailable: 'Les codes de secours ne sont pas configurés.',
    account: 'Super admin · Nouvel appareil',
    city: 'Nouakchott',
    invalidCode: 'Code de vérification invalide.',
    expiredCode: 'Code de vérification expiré. Revenez aux identifiants pour en demander un nouveau.',
    codeResent: 'Un nouveau code a été envoyé.',
    codeInput: 'Chiffre du code de vérification',
    otpTest: 'Code SMS de test (simulé) :',
  },
  AR: {
    backOffice: 'الإدارة · نواكشوط',
    heroFirst: 'أدر أسطولك',
    heroAccent: 'في الوقت الفعلي.',
    heroArabic: 'إدارة أسطولك في الوقت الفعلي',
    heroDescription: 'الرحلات والسائقون والتحقق من الملفات والعمولات: جميع أنشطة المنصة في مكان واحد.',
    onlineDrivers: 'السائقون المتصلون',
    ridesToday: 'رحلات اليوم',
    pendingFiles: 'ملفات بانتظار المراجعة',
    french: 'Français',
    arabic: 'العربية',
    loginTitle: 'تسجيل دخول المسؤول',
    loginArabic: 'Connexion administrateur',
    loginSubtitle: 'سجّل الدخول باستخدام بياناتك المهنية.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    forgotMessage: 'يرجى التواصل مع مسؤول النظام لإعادة تعيين كلمة المرور.',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    remember: 'البقاء متصلاً على هذا الجهاز (8 ساعات)',
    fill: 'تعبئة',
    login: 'تسجيل الدخول',
    signingIn: 'جارٍ التحقق…',
    loginInfo: 'سيتم إرسال رمز تحقق عبر الرسائل القصيرة بعد إدخال كلمة المرور. بعد 5 محاولات فاشلة، سيتم حظر الحساب لمدة 15 دقيقة.',
    footer: 'الدخول مخصص للموظفين المصرح لهم',
    encrypted: 'اتصال مشفر',
    return: 'رجوع',
    twoFactorTitle: 'التحقق بخطوتين',
    twoFactorArabic: 'Vérification en 2 étapes',
    twoFactorSubtitle: 'أدخل الرمز المكون من 6 أرقام المرسل إلى',
    expiry: 'صلاحية الرمز',
    resendIn: 'إعادة إرسال الرمز بعد',
    resend: 'إعادة إرسال الرمز',
    verify: 'التحقق والدخول إلى لوحة التحكم',
    verifying: 'جارٍ التحقق…',
    backup: 'استخدام رمز احتياطي',
    backupUnavailable: 'لم يتم إعداد الرموز الاحتياطية.',
    account: 'المسؤول · جهاز جديد',
    city: 'نواكشوط',
    invalidCode: 'رمز التحقق غير صحيح.',
    expiredCode: 'انتهت صلاحية رمز التحقق. ارجع إلى بيانات الدخول لطلب رمز جديد.',
    codeResent: 'تم إرسال رمز جديد.',
    codeInput: 'رقم رمز التحقق',
    otpTest: 'رمز SMS تجريبي:',
  },
} as const;

const vehicleLocations = [
  { left: '23%', top: '27%' },
  { left: '67%', top: '20%' },
  { left: '86%', top: '32%' },
  { left: '50%', top: '45%' },
  { left: '19%', top: '48%' },
  { left: '81%', top: '43%' },
];

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  lang,
  onLanguageChange,
  onSuccess,
}) => {
  const t = copy[lang];
  const isArabic = lang === 'AR';
  const [step, setStep] = useState<AuthStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [phoneMasked, setPhoneMasked] = useState('+222 •• •• 43 21');
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [resendSecondsRemaining, setResendSecondsRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otpCode = otpDigits.join('');

  useEffect(() => {
    if (step !== 'twoFactor' || expiresAt === null) {
      setSecondsRemaining(0);
      setResendSecondsRemaining(0);
      return;
    }

    const updateCountdowns = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      const resendRemaining = resendAvailableAt === null
        ? 0
        : Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      setResendSecondsRemaining(resendRemaining);
      if (remaining === 0) setErrorMessage(t.expiredCode);
      return remaining;
    };

    if (updateCountdowns() === 0) return;
    const intervalId = window.setInterval(() => {
      if (updateCountdowns() === 0) window.clearInterval(intervalId);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt, resendAvailableAt, step, t.expiredCode]);

  useEffect(() => {
    if (step === 'twoFactor') otpRefs.current[0]?.focus();
  }, [step]);


  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setNoticeMessage(null);
    setLockoutMinutes(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data.locked && typeof data.remainingMinutes === 'number') {
          setLockoutMinutes(data.remainingMinutes);
        }
        setErrorMessage(typeof data.error === 'string' ? data.error : t.invalidCode);
        return;
      }

      setTempToken(data.tempToken);
      setPhoneMasked(data.phoneMasked || '+222 •• •• 43 21');
      setExpiresAt(typeof data.expiresAt === 'number' ? data.expiresAt : Date.now() + 5 * 60 * 1000);
      setResendAvailableAt(typeof data.resendAvailableAt === 'number' ? data.resendAvailableAt : Date.now() + 60 * 1000);
      setOtpHint(typeof data.devOtpHint === 'string' ? data.devOtpHint : null);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('twoFactor');
    } catch {
      setErrorMessage('Impossible de joindre le serveur Rapido. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tempToken || otpCode.length !== 6 || secondsRemaining === 0) return;

    setErrorMessage(null);
    setNoticeMessage(null);
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code: otpCode, rememberMe }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMessage(typeof data.error === 'string' ? data.error : t.invalidCode);
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }
      onSuccess(data.user as AdminUser, data.token as string, rememberMe);
    } catch {
      setErrorMessage('Erreur lors de la validation du code 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!tempToken || resendSecondsRemaining > 0 || secondsRemaining === 0 || resending) return;

    setErrorMessage(null);
    setNoticeMessage(null);
    setResending(true);
    try {
      const response = await fetch('/api/auth/resend-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (typeof data.resendAvailableAt === 'number') setResendAvailableAt(data.resendAvailableAt);
        setErrorMessage(typeof data.error === 'string' ? data.error : t.invalidCode);
        return;
      }
      setExpiresAt(typeof data.expiresAt === 'number' ? data.expiresAt : Date.now() + 5 * 60 * 1000);
      setResendAvailableAt(
        typeof data.resendAvailableAt === 'number' ? data.resendAvailableAt : Date.now() + 60 * 1000
      );
      setOtpHint(typeof data.devOtpHint === 'string' ? data.devOtpHint : null);
      setOtpDigits(['', '', '', '', '', '']);
      setNoticeMessage(t.codeResent);
      otpRefs.current[0]?.focus();
    } catch {
      setErrorMessage('Impossible de renvoyer le code. Vérifiez votre connexion.');
    } finally {
      setResending(false);
    }
  };

  const goBackToCredentials = () => {
    setStep('credentials');
    setTempToken(null);
    setOtpHint(null);
    setExpiresAt(null);
    setResendAvailableAt(null);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    setNoticeMessage(null);
  };

  const handleOtpChange = (index: number, rawValue: string) => {
    const pastedDigits = rawValue.replace(/\D/g, '');
    if (pastedDigits.length > 1) {
      setOtpDigits((previous) => {
        const next = [...previous];
        pastedDigits.slice(0, 6 - index).split('').forEach((digit, offset) => {
          next[index + offset] = digit;
        });
        return next;
      });
      otpRefs.current[Math.min(index + pastedDigits.length, 5)]?.focus();
      return;
    }

    const digit = pastedDigits;
    setOtpDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });
    if (digit && index < otpRefs.current.length - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setOtpDigits(Array.from({ length: 6 }, (_, index) => pasted[index] || ''));
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const deviceName = /Edg\//.test(navigator.userAgent)
    ? 'Edge'
    : /Firefox\//.test(navigator.userAgent)
      ? 'Firefox'
      : /Chrome\//.test(navigator.userAgent)
        ? 'Chrome'
        : /Safari\//.test(navigator.userAgent)
          ? 'Safari'
          : 'Web';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={isArabic ? 'ar' : 'fr'}
      className={`auth-page min-h-dvh bg-white text-auth-ink ${isArabic ? 'font-tajawal' : ''}`}
    >
      <section className="auth-brand-panel relative isolate flex min-h-[260px] flex-col overflow-hidden px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-dvh lg:px-12 xl:px-20" dir="ltr">
        <div className="auth-map-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="auth-route-lines pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-auth-orange text-white shadow-lg shadow-orange-950/20">
            <Car className="size-7" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight sm:text-2xl">VTC Admin</div>
            <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-300 sm:text-base">
              <span aria-hidden="true">🇲🇷</span>
              <span>{t.backOffice}</span>
            </div>
          </div>
        </div>

        <div className="auth-vehicle-markers pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden="true">
          {vehicleLocations.map((location, index) => (
            <div
              key={`${location.left}-${location.top}`}
              className={`absolute flex size-10 items-center justify-center rounded-full border-[3px] border-white bg-auth-orange text-white shadow-md ${index % 2 === 1 ? 'bg-white text-auth-orange' : ''}`}
              style={{
                ...location,
                color: index % 2 === 1 ? 'var(--color-auth-orange)' : '#fff',
              }}
            >
              <Car className="size-4" />
            </div>
          ))}
          <span className="auth-map-label auth-map-label-one">TEVRAGH ZEINA</span>
          <span className="auth-map-label auth-map-label-two">KSAR</span>
        </div>

        <div className="relative z-10 mt-auto hidden max-w-[700px] pb-16 pt-16 lg:block">
          <h1 className="text-[clamp(2rem,2.65vw,3.375rem)] font-extrabold leading-[1.08] tracking-tight">
            {t.heroFirst}<br />
            <span className="text-auth-orange">{t.heroAccent}</span>
          </h1>
          <p className="mt-4 text-xl font-semibold text-slate-300">{t.heroArabic}</p>
          <p className="mt-4 max-w-[650px] text-base leading-relaxed text-slate-300 xl:text-lg">{t.heroDescription}</p>
          <div className="mt-10 grid max-w-[750px] grid-cols-3 gap-3 xl:gap-4">
            {[
              { label: t.onlineDrivers, value: '212', accent: false },
              { label: t.ridesToday, value: '1 284', accent: false },
              { label: t.pendingFiles, value: '14', accent: true },
            ].map((metric) => (
              <div key={metric.label} className={`rounded-2xl border px-3 py-3 xl:px-5 xl:py-4 ${metric.accent ? 'border-orange-500/50 bg-orange-500/10' : 'border-white/10 bg-white/[0.07]'}`}>
                <div className={`text-xs font-semibold xl:text-sm ${metric.accent ? 'text-orange-200' : 'text-slate-300'}`}>{metric.label}</div>
                <div className={`mt-1 text-2xl font-extrabold xl:text-3xl ${metric.accent ? 'text-orange-300' : 'text-white'}`}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="auth-form-panel relative flex min-h-[calc(100dvh-260px)] flex-col bg-auth-panel px-5 py-16 sm:px-10 lg:min-h-dvh lg:px-12 lg:py-24 [@media(min-width:1024px)_and_(max-height:950px)]:!py-12 xl:px-20">
        <div className="absolute end-5 top-5 z-10 sm:end-10 sm:top-8 lg:end-10 lg:top-10 xl:end-14">
          <div className="flex rounded-2xl border border-slate-200/80 bg-white/30 p-1" role="group" aria-label={isArabic ? 'اختيار اللغة' : 'Choix de la langue'}>
            <button
              type="button"
              onClick={() => onLanguageChange('FR')}
              aria-pressed={!isArabic}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${!isArabic ? 'bg-white text-auth-ink shadow-sm' : 'text-auth-muted hover:text-auth-ink'}`}
            >
              {t.french}
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('AR')}
              aria-pressed={isArabic}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${isArabic ? 'bg-white text-auth-ink shadow-sm' : 'text-auth-muted hover:text-auth-ink'}`}
            >
              {t.arabic}
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center lg:translate-y-12">
          <div className="w-full max-w-[626px]">
            {step === 'credentials' ? (
              <form onSubmit={handleLoginSubmit} className="w-full">
                <div className="mb-7 flex size-20 items-center justify-center rounded-[26px] bg-orange-100/80 text-auth-orange">
                  <ShieldCheck className="size-9" strokeWidth={2.4} aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-auth-ink sm:text-4xl">{t.loginTitle}</h2>
                <p className="mt-2 text-xl font-extrabold text-auth-orange">{t.loginArabic}</p>
                <p className="mt-2 text-base text-auth-muted sm:text-lg">{t.loginSubtitle}</p>

                {/* Bouton d'accès rapide / Remplissage automatique test */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-orange-50 border border-orange-200/90 p-3.5">
                  <div className="text-xs text-orange-900">
                    <span className="font-bold">Compte test :</span> <code className="font-mono font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded text-[11px]">admin@rapido.mr</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@rapido.mr');
                      setPassword('AdminRapido2026!');
                    }}
                    className="shrink-0 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer shadow-sm shadow-orange-500/20"
                  >
                    ⚡ Remplir
                  </button>
                </div>

                {(errorMessage || noticeMessage) && (
                  <div className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${errorMessage ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`} role={errorMessage ? 'alert' : 'status'}>
                    <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">{errorMessage || noticeMessage}</div>
                      {lockoutMinutes && <div className="mt-1 text-xs">Réessayez dans {lockoutMinutes} min.</div>}
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="admin-email" className="mb-2 block text-sm font-bold text-auth-muted">{t.email}</label>
                    <div className="relative">
                      <Mail className="absolute start-5 top-1/2 size-5 -translate-y-1/2 text-[#23446B]" aria-hidden="true" />
                      <input
                        id="admin-email"
                        dir="ltr"
                        type="email"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="nom@vtc-admin.mr"
                        className="h-[74px] w-full rounded-2xl border border-auth-line bg-white ps-14 pe-5 text-base font-semibold text-auth-ink outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#294B75] focus:ring-4 focus:ring-[#294B75]/10 sm:text-lg [@media(min-width:1024px)_and_(max-height:950px)]:!h-16"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="admin-password" className="text-sm font-bold text-auth-muted">{t.password}</label>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(t.forgotMessage);
                          setNoticeMessage(null);
                        }}
                        className="text-sm font-bold text-auth-orange hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-orange"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute start-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input
                        id="admin-password"
                        dir="ltr"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••••"
                        className="h-[74px] w-full rounded-2xl border border-auth-line bg-white ps-14 pe-14 text-base font-semibold tracking-wide text-auth-ink outline-none transition placeholder:text-slate-400 focus:border-[#294B75] focus:ring-4 focus:ring-[#294B75]/10 sm:text-lg [@media(min-width:1024px)_and_(max-height:950px)]:!h-16"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? t.hidePassword : t.showPassword}
                        className="absolute end-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-orange"
                      >
                        {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-semibold text-auth-muted sm:text-base">
                  <span className="relative size-8 shrink-0">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="peer size-8 cursor-pointer appearance-none rounded-xl border border-auth-line bg-white transition checked:border-auth-orange checked:bg-auth-orange focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-auth-orange/20"
                    />
                    <Check className="pointer-events-none absolute inset-0 m-auto size-5 text-white opacity-0 peer-checked:opacity-100" aria-hidden="true" />
                  </span>
                  <span>{t.remember}</span>
                </label>


                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 flex h-[76px] w-full items-center justify-center gap-3 rounded-2xl bg-auth-orange px-5 text-lg font-extrabold text-white shadow-[0_14px_24px_rgba(255,121,0,0.22)] transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-auth-orange/30 disabled:cursor-wait disabled:opacity-60 sm:text-xl [@media(min-width:1024px)_and_(max-height:950px)]:!mt-5 [@media(min-width:1024px)_and_(max-height:950px)]:!h-16"
                >
                  {loading ? t.signingIn : t.login}
                  {!loading && <ArrowRight className={`size-6 ${isArabic ? 'rotate-180' : ''}`} aria-hidden="true" />}
                </button>

                <div className="mt-7 flex items-start gap-3 rounded-2xl bg-auth-info px-5 py-4 text-sm leading-relaxed text-[#344B68] sm:text-base">
                  <Info className="mt-1 size-4 shrink-0 text-[#294B75]" aria-hidden="true" />
                  <p>{t.loginInfo}</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifySubmit} className="w-full">
                <button
                  type="button"
                  onClick={goBackToCredentials}
                  className="mb-8 flex items-center gap-3 rounded-xl text-base font-bold text-auth-muted transition hover:text-auth-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-orange"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-auth-line bg-white text-auth-ink shadow-sm">
                    <ArrowLeft className={`size-6 ${isArabic ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </span>
                  {t.return}
                </button>

                <div className="mb-7 flex size-20 items-center justify-center rounded-[26px] bg-orange-100/80 text-auth-orange">
                  <Phone className="size-9" strokeWidth={2.4} aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-auth-ink sm:text-4xl">{t.twoFactorTitle}</h2>
                <p className="mt-2 text-xl font-extrabold text-auth-orange">{t.twoFactorArabic}</p>
                <p className="mt-2 text-base text-auth-muted sm:text-lg">
                  {t.twoFactorSubtitle}{' '}
                  <strong className="whitespace-nowrap font-extrabold text-auth-ink" dir="ltr">{phoneMasked}</strong>.
                </p>

                {(errorMessage || noticeMessage) && (
                  <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${errorMessage ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`} role={errorMessage ? 'alert' : 'status'}>
                    {errorMessage || noticeMessage}
                  </div>
                )}

                {otpHint && (
                  <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <span><strong>{t.otpTest}</strong> <code className="ms-1 font-bold tracking-[0.2em]">{otpHint}</code></span>
                    <button
                      type="button"
                      onClick={() => {
                        const digits = Array.from({ length: 6 }, (_, index) => otpHint[index] || '');
                        setOtpDigits(digits);
                        otpRefs.current[5]?.focus();
                      }}
                      className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800"
                    >
                      <Check className="me-1 inline size-3.5" aria-hidden="true" />{t.fill}
                    </button>
                  </div>
                )}

                <div className="mt-9 grid grid-cols-6 gap-2 sm:gap-4" dir="ltr">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => { otpRefs.current[index] = element; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      aria-label={`${t.codeInput} ${index + 1}`}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onPaste={handleOtpPaste}
                      onKeyDown={(event) => {
                        if (event.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1]?.focus();
                        if (event.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
                        if (event.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus();
                      }}
                      className="h-[68px] min-w-0 rounded-2xl border border-auth-line bg-white text-center text-3xl font-extrabold text-auth-ink outline-none transition focus:border-auth-orange focus:ring-4 focus:ring-auth-orange/15 sm:h-[94px] sm:text-4xl"
                    />
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm sm:text-base">
              <span
                    className="text-auth-muted"
                    role="timer"
                    aria-label={`${t.expiry} ${formatTime(secondsRemaining)}`}
                    aria-live="off"
                  >
                    {t.expiry} <strong className="font-extrabold text-auth-ink">{formatTime(secondsRemaining)}</strong>
                  </span>
                  <div className="text-auth-muted">
                    {resendSecondsRemaining > 0 ? (
                      <>{t.resendIn} <strong className="font-extrabold text-auth-ink">{formatTime(resendSecondsRemaining)}</strong></>
                    ) : (
                      <button type="button" onClick={handleResend} disabled={resending || secondsRemaining === 0} className="font-bold text-auth-orange transition hover:text-orange-700 disabled:cursor-not-allowed disabled:text-slate-400">
                        {resending ? t.signingIn : t.resend}
                      </button>
                    )}
                  </div>
                  <button type="button" disabled title={t.backupUnavailable} className="cursor-not-allowed font-semibold text-slate-400">
                    {t.backup}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6 || secondsRemaining === 0}
                  className="mt-8 flex h-[76px] w-full items-center justify-center gap-3 rounded-2xl bg-auth-orange px-5 text-lg font-extrabold text-white shadow-[0_14px_24px_rgba(255,121,0,0.22)] transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-auth-orange/30 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xl"
                >
                  {loading ? t.verifying : t.verify}
                </button>

                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-auth-line bg-white px-5 py-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#E8EFF8] text-base font-extrabold text-[#23446B]">SB</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-auth-ink sm:text-base" dir="ltr">{email}</div>
                    <div className="mt-0.5 text-sm text-slate-400">{t.account} · {deviceName}, {t.city}</div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 lg:text-sm">
          <span>© 2026 VTC Admin · {t.footer}</span>
          <span className="flex items-center gap-2"><Lock className="size-4" aria-hidden="true" />{t.encrypted}</span>
        </footer>
      </main>
    </div>
  );
};
