import React, { useState } from 'react';
import {
  Car,
  Search,
  Filter,
  Star,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Ban,
  MoreVertical,
  Calendar,
  DollarSign,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { translations, Lang } from '../lib/translations';

interface DriverItem {
  id: string;
  nameFr: string;
  nameAr: string;
  phone: string;
  plate: string;
  vehicle: string;
  year: number;
  category: string;
  rating: number;
  totalRides: number;
  totalEarningsMru: number;
  status: 'En ligne' | 'En course' | 'Hors ligne' | 'Suspendu';
  joinedDate: string;
}

interface DriversDirectoryViewProps {
  lang?: Lang;
}

export const DriversDirectoryView: React.FC<DriversDirectoryViewProps> = ({ lang = 'FR' }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [drivers, setDrivers] = useState<DriverItem[]>([
    {
      id: 'd-1',
      nameFr: 'Amadou Ould Cheikh',
      nameAr: 'أمادو ولد الشيخ',
      phone: '+222 46 55 43 21',
      plate: '4821 AB 00',
      vehicle: 'Toyota Corolla 2019',
      year: 2019,
      category: 'Confort · CLIM',
      rating: 4.86,
      totalRides: 412,
      totalEarningsMru: 348000,
      status: 'En course',
      joinedDate: '15/02/2026',
    },
    {
      id: 'd-2',
      nameFr: 'Moussa Diallo',
      nameAr: 'موسى ديالو',
      phone: '+222 36 21 98 44',
      plate: '1907 AC 00',
      vehicle: 'Hyundai Accent',
      year: 2021,
      category: 'Économique',
      rating: 4.91,
      totalRides: 589,
      totalEarningsMru: 492000,
      status: 'En ligne',
      joinedDate: '03/01/2026',
    },
    {
      id: 'd-3',
      nameFr: 'Yacoub Sow',
      nameAr: 'يعقوب صو',
      phone: '+222 33 44 55 66',
      plate: '5502 AC 00',
      vehicle: 'Peugeot 301',
      year: 2017,
      category: 'Économique',
      rating: 4.78,
      totalRides: 284,
      totalEarningsMru: 210000,
      status: 'En course',
      joinedDate: '22/04/2026',
    },
    {
      id: 'd-4',
      nameFr: 'Brahim El Moctar',
      nameAr: 'ابراهيم المختار',
      phone: '+222 22 88 14 02',
      plate: '6631 AB 00',
      vehicle: 'Kia Rio',
      year: 2018,
      category: 'Économique',
      rating: 4.95,
      totalRides: 630,
      totalEarningsMru: 512000,
      status: 'En ligne',
      joinedDate: '10/11/2025',
    },
    {
      id: 'd-5',
      nameFr: 'El Hacen Mahmoud',
      nameAr: 'الحسن محمود',
      phone: '+222 26 77 88 99',
      plate: '2288 AA 00',
      vehicle: 'Mercedes C200',
      year: 2018,
      category: 'Premium',
      rating: 4.88,
      totalRides: 198,
      totalEarningsMru: 386000,
      status: 'Hors ligne',
      joinedDate: '18/06/2026',
    },
    {
      id: 'd-6',
      nameFr: 'Khadijetou Bâ',
      nameAr: 'خديجة با',
      phone: '+222 49 11 00 77',
      plate: '7120 AB 00',
      vehicle: 'Toyota Yaris',
      year: 2020,
      category: 'Confort · CLIM',
      rating: 4.92,
      totalRides: 341,
      totalEarningsMru: 295000,
      status: 'Hors ligne',
      joinedDate: '09/03/2026',
    },
  ]);

  const filtered = drivers.filter((d) => {
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchSearch =
      search === '' ||
      d.nameFr.toLowerCase().includes(search.toLowerCase()) ||
      d.nameAr.includes(search) ||
      d.plate.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const handleToggleSuspend = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Suspendu' ? 'Hors ligne' : 'Suspendu' } : d
      )
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'AR' ? 'دليل أسطول السائقين' : 'Répertoire des chauffeurs'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'AR'
              ? '640 سائق مسجل في نواكشوط · 212 متصلون حالياً'
              : '640 chauffeurs enregistrés à Nouakchott · 212 connectés en direct'}
          </p>
        </div>

        {/* Status Quick Filter */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold border border-slate-200">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {lang === 'AR' ? 'الكل (6)' : 'Tous (6)'}
          </button>
          <button
            onClick={() => setStatusFilter('En ligne')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'En ligne' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            {lang === 'AR' ? 'متصل' : 'En ligne'}
          </button>
          <button
            onClick={() => setStatusFilter('En course')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'En course' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            {lang === 'AR' ? 'في رحلة' : 'En course'}
          </button>
          <button
            onClick={() => setStatusFilter('Hors ligne')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'Hors ligne' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            {lang === 'AR' ? 'غير متصل' : 'Hors ligne'}
          </button>
        </div>
      </div>

      {/* Search & Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {lang === 'AR' ? 'سائقون نشطون' : 'Chauffeurs actifs'}
            </div>
            <div className="text-lg font-bold text-slate-900">212 / 640</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {lang === 'AR' ? 'متوسط تقييم السائقين' : 'Note moyenne globale'}
            </div>
            <div className="text-lg font-bold text-slate-900">★ 4.88 / 5.0</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {lang === 'AR' ? 'متوسط عدد الرحلات' : 'Moyenne de courses'}
            </div>
            <div className="text-lg font-bold text-slate-900">415 courses / chauffeur</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {lang === 'AR' ? 'التحقق من الهوية NNI' : 'Vérification NNI & KYC'}
            </div>
            <div className="text-lg font-bold text-emerald-600">100 % vérifié</div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Search bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === 'AR'
                  ? 'بحث بالاسم، رقم اللوحة، الهاتف...'
                  : 'Rechercher par nom, plaque, téléphone...'
              }
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filtered.length} {lang === 'AR' ? 'سائق معروض' : 'chauffeurs affichés'}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">{lang === 'AR' ? 'السائق' : 'Chauffeur'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'الهاتف' : 'Téléphone'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'السيارة واللوحة' : 'Véhicule & Plaque'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'الفئة' : 'Catégorie'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'التقييم' : 'Note'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'إجمالي الرحلات' : 'Courses'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'الأرباح' : 'Gains générés'}</th>
                <th className="py-3 px-4">{lang === 'AR' ? 'الحالة' : 'Statut'}</th>
                <th className="py-3 px-4 text-right">{lang === 'AR' ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                        {driver.nameFr.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{driver.nameFr}</div>
                        <div className="text-[11px] text-slate-400 font-arabic">{driver.nameAr}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{driver.phone}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{driver.vehicle}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{driver.plate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                      {driver.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{driver.rating.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{driver.totalRides}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {driver.totalEarningsMru.toLocaleString('fr-FR')} MRU
                  </td>
                  <td className="py-3.5 px-4">
                    {driver.status === 'En ligne' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{lang === 'AR' ? 'متصل' : 'En ligne'}</span>
                      </span>
                    )}
                    {driver.status === 'En course' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        <span>{lang === 'AR' ? 'في رحلة' : 'En course'}</span>
                      </span>
                    )}
                    {driver.status === 'Hors ligne' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        <span>{lang === 'AR' ? 'غير متصل' : 'Hors ligne'}</span>
                      </span>
                    )}
                    {driver.status === 'Suspendu' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span>{lang === 'AR' ? 'معلق' : 'Suspendu'}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleSuspend(driver.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        driver.status === 'Suspendu'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      {driver.status === 'Suspendu'
                        ? lang === 'AR'
                          ? 'إلغاء التعليق'
                          : 'Réactiver'
                        : lang === 'AR'
                        ? 'تعليق'
                        : 'Suspendre'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
