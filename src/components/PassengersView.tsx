import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Star,
  Phone,
  Calendar,
  CheckCircle2,
  Ban,
  ShieldCheck,
  CreditCard,
  Banknote,
  DollarSign,
  ArrowUpDown,
  MoreVertical,
  UserCheck
} from 'lucide-react';
import type { Passenger } from '../types';
import type { Lang } from '../lib/translations';

interface PassengersViewProps {
  passengers: Passenger[];
  onTogglePassengerStatus: (id: string) => void;
  lang?: Lang;
}

export const PassengersView: React.FC<PassengersViewProps> = ({
  passengers,
  onTogglePassengerStatus,
  lang = 'FR'
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'actif' | 'bloque'>('all');
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  const isArabic = lang === 'AR';

  const filtered = passengers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalSpent = passengers.reduce((sum, p) => sum + p.spentMru, 0);
  const totalRides = passengers.reduce((sum, p) => sum + p.totalRides, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5" />
            {isArabic ? 'إدارة الركاب' : 'Répertoire Clients · Nouakchott'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isArabic ? 'حسابات الركاب والعملاء' : 'Gestion des Passagers'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {isArabic
              ? 'متابعة نشاط الركاب، تقييماتهم، وتاريخ طلباتهم في نواكشوط مع إمكانية إدارة الحظر.'
              : 'Consultez la liste des passagers actifs, leurs notes moyennes, volumes de courses et historique.'}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div className="text-center px-2">
            <div className="text-xl font-black text-slate-900">{passengers.length}</div>
            <div className="text-[11px] font-semibold text-slate-500">
              {isArabic ? 'إجمالي العملاء' : 'Passagers'}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <div className="text-xl font-black text-orange-600">{totalRides}</div>
            <div className="text-[11px] font-semibold text-slate-500">
              {isArabic ? 'رحلات منجزة' : 'Courses'}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <div className="text-xl font-black text-emerald-600">
              {(totalSpent / 1000).toFixed(1)}k MRU
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {isArabic ? 'حجم المعاملات' : 'Volume'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isArabic ? 'البحث بالاسم أو رقم الهاتف (+222)...' : 'Rechercher par nom ou téléphone (+222)...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isArabic ? 'الكل' : 'Tous'} ({passengers.length})
          </button>
          <button
            onClick={() => setFilterStatus('actif')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'actif'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isArabic ? 'نشط' : 'Actifs'} ({passengers.filter((p) => p.status === 'actif').length})
          </button>
          <button
            onClick={() => setFilterStatus('bloque')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'bloque'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            {isArabic ? 'محظور' : 'Suspendus'} ({passengers.filter((p) => p.status === 'bloque').length})
          </button>
        </div>
      </div>

      {/* Passengers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">{isArabic ? 'الراكب' : 'Passager'}</th>
                <th className="py-3.5 px-4">{isArabic ? 'الهاتف' : 'Téléphone'}</th>
                <th className="py-3.5 px-4">{isArabic ? 'التقييم' : 'Note moyenne'}</th>
                <th className="py-3.5 px-4">{isArabic ? 'الرحلات' : 'Courses'}</th>
                <th className="py-3.5 px-4">{isArabic ? 'إجمالي الإنفاق' : 'Total dépensé'}</th>
                <th className="py-3.5 px-4">{isArabic ? 'الدفع المفضل' : 'Mode habituel'}</th>
                <th className="py-3.5 px-4">{isArabic ? 'الحالة' : 'Statut'}</th>
                <th className="py-3.5 px-5 text-right">{isArabic ? 'إجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((passenger) => (
                <tr key={passenger.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {passenger.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{passenger.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Inscrit le {passenger.joinedDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-medium text-slate-700">
                    {passenger.phone}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{passenger.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {passenger.totalRides} courses
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {passenger.spentMru.toLocaleString()} MRU
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {passenger.preferredPayment === 'Cash' ? (
                        <Banknote className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <CreditCard className="w-3 h-3 text-blue-600" />
                      )}
                      {passenger.preferredPayment}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        passenger.status === 'actif'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          passenger.status === 'actif' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {passenger.status === 'actif' ? (isArabic ? 'نشط' : 'Actif') : isArabic ? 'محظور' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onTogglePassengerStatus(passenger.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        passenger.status === 'actif'
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {passenger.status === 'actif'
                        ? isArabic
                          ? 'حظر الحساب'
                          : 'Suspendre'
                        : isArabic
                        ? 'إلغاء الحظر'
                        : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            Aucun passager trouvé correspondant à votre recherche.
          </div>
        )}
      </div>
    </div>
  );
};
