import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Car,
  CreditCard,
  Wallet,
  XCircle,
  Download,
  Calendar,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Share2
} from 'lucide-react';
import type { Ride, HourlyData, DailyRevenueData, PlatformOverview } from '../types';

interface OverviewViewProps {
  overview: PlatformOverview;
  hourly: HourlyData[];
  revenue14Days: DailyRevenueData[];
  recentRides: Ride[];
  pendingValidationCount: number;
  onGoToValidation: () => void;
  onGoToRides: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  overview,
  hourly,
  revenue14Days,
  recentRides,
  pendingValidationCount,
  onGoToValidation,
  onGoToRides,
}) => {
  const [period, setPeriod] = useState<'today' | '7d' | '30d' | 'custom'>('today');
  const [hoveredHour, setHoveredHour] = useState<HourlyData | null>(
    hourly.find((h) => h.isPeak) || hourly[18] || null
  );

  const handleExportData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'RÉF,PASSAGER,CHAUFFEUR,TRAJET,CATÉGORIE,MONTANT_MRU,STATUT\n' +
      recentRides
        .map(
          (r) =>
            `${r.ref},"${r.passengerName}","${r.driverName || 'N/A'}","${r.from} -> ${r.to}",${r.category},${r.amountMru},"${r.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapido-vtc-courses-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute SVG polyline for the 14 days chart
  const minVal = 1.0;
  const maxVal = 1.6;
  const chartHeight = 120;
  const chartWidth = 420;
  const points = revenue14Days
    .map((d, index) => {
      const x = (index / (revenue14Days.length - 1)) * chartWidth;
      const y = chartHeight - ((d.valueM - minVal) / (maxVal - minVal)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vue d'ensemble</h1>
          <p className="text-xs text-slate-500 mt-1">
            Jeudi 8 octobre 2026 · données en direct, mises à jour il y a 12 s
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 text-xs font-medium">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'today'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === '7d'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 jours
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === '30d'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 jours
            </button>
            <button
              onClick={() => setPeriod('custom')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                period === 'custom'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Personnalisé</span>
            </button>
          </div>

          {/* Exporter Button */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Courses aujourd'hui */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Courses aujourd'hui</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">
            {overview.ridesToday.toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Card 2: Volume d'affaires */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Volume d'affaires</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>{overview.volumeMru}</span>
            <span className="text-sm font-semibold text-slate-400">MRU</span>
          </div>
        </div>

        {/* Card 3: Commissions plateforme */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Commissions plateforme</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>{overview.commissionsMru}</span>
            <span className="text-sm font-semibold text-slate-400">MRU</span>
          </div>
        </div>

        {/* Card 4: Chauffeurs en ligne */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Chauffeurs en ligne</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>{overview.driversOnline}</span>
            <span className="text-xs font-medium text-slate-400">/ {overview.driversActiveTotal} actifs</span>
          </div>
        </div>

        {/* Card 5: Taux d'annulation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Taux d'annulation</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">
            {overview.cancellationRate}
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Courses par heure */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Courses par heure</h2>
              <p className="text-xs text-slate-500">Aujourd'hui · pic à 18 h</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/60">
              Heure de pointe 17 h – 20 h
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="relative mt-6 pt-6">
            {/* Tooltip on peak bar */}
            {hoveredHour && (
              <div
                className="absolute -top-1 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg transform -translate-x-1/2 pointer-events-none transition-all z-10"
                style={{
                  left: `${
                    ((hourly.findIndex((h) => h.hour === hoveredHour.hour) + 0.5) / hourly.length) * 100
                  }%`,
                }}
              >
                {hoveredHour.hour} · {hoveredHour.rides} courses
              </div>
            )}

            <div className="h-44 flex items-end gap-1.5 border-b border-slate-100 pb-1">
              {hourly.map((h, i) => {
                const heightPercent = (h.rides / 140) * 100;
                const isSelected = hoveredHour?.hour === h.hour;
                return (
                  <div
                    key={h.hour}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    onMouseEnter={() => setHoveredHour(h)}
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all duration-200 ${
                        h.isPeak
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : isSelected
                          ? 'bg-amber-400'
                          : 'bg-amber-200/80 hover:bg-amber-300'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>00h</span>
              <span>03h</span>
              <span>06h</span>
              <span>09h</span>
              <span>12h</span>
              <span>15h</span>
              <span>18h</span>
              <span>21h</span>
            </div>
          </div>
        </div>

        {/* Right: Volume d'affaires 14 jours */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900">Volume d'affaires · 14 jours</h2>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>En millions de MRU</span>
              <span className="text-emerald-600 font-semibold">· +37 % sur la période</span>
            </div>
          </div>

          {/* SVG Trendline */}
          <div className="my-6 relative">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 pr-2 pointer-events-none">
              <span>1,6 M</span>
              <span>1,4 M</span>
              <span>1,2 M</span>
              <span>1,0 M</span>
            </div>

            <div className="ml-10 h-36 relative">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100 pointer-events-none">
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
                <div className="w-full" />
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#1E293B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <polygon
                  points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                  fill="url(#revenueGradient)"
                />

                {/* Line stroke */}
                <polyline
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Active last point */}
                <circle
                  cx={chartWidth}
                  cy={
                    chartHeight -
                    ((revenue14Days[revenue14Days.length - 1].valueM - minVal) / (maxVal - minVal)) *
                      chartHeight
                  }
                  r="4.5"
                  fill="#1E293B"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Dates along the bottom */}
            <div className="ml-10 flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
              <span>25/09</span>
              <span>27/09</span>
              <span>29/09</span>
              <span>01/10</span>
              <span>03/10</span>
              <span>05/10</span>
              <span>07/10</span>
              <span className="font-bold text-slate-700">Auj.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Rides & Categories / Validation Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dernières courses Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Dernières courses</h2>
            <button
              onClick={onGoToRides}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
            >
              <span>Tout voir</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Réf.</th>
                  <th className="pb-3 font-semibold">Passager</th>
                  <th className="pb-3 font-semibold">Chauffeur</th>
                  <th className="pb-3 font-semibold">Trajet</th>
                  <th className="pb-3 font-semibold">Catégorie</th>
                  <th className="pb-3 font-semibold text-right">Montant</th>
                  <th className="pb-3 font-semibold text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentRides.slice(0, 5).map((ride) => (
                  <tr key={ride.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">{ride.ref}</td>
                    <td className="py-3.5 text-slate-800">{ride.passengerName}</td>
                    <td className="py-3.5">
                      {ride.driverName ? (
                        <span>{ride.driverName}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {ride.from} → {ride.to}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {ride.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900">
                      {ride.amountMru.toLocaleString('fr-FR')} MRU
                    </td>
                    <td className="py-3.5 text-right">
                      {ride.status === 'Terminée' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Terminée
                        </span>
                      )}
                      {ride.status === 'En cours' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                          En cours
                        </span>
                      )}
                      {ride.status === 'En recherche' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          En recherche
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Courses par catégorie & Callout validation */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Courses par catégorie card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex-1">
            <h2 className="text-base font-bold text-slate-900 mb-4">Courses par catégorie</h2>
            <div className="space-y-4">
              {/* Économique */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-800 font-semibold">Économique</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800">612</strong> · moy. 800 MRU
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '48%' }} />
                </div>
              </div>

              {/* Confort */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-800 font-semibold">Confort</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800">418</strong> · moy. 1 200 MRU
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '33%' }} />
                </div>
              </div>

              {/* Premium */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-800 font-semibold">Premium</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800">156</strong> · moy. 2 000 MRU
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '13%' }} />
                </div>
              </div>

              {/* Van / Famille */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-800 font-semibold">Van / Famille</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800">98</strong> · moy. 1 800 MRU
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Orange Callout Box: 14 dossiers chauffeurs à valider */}
          <button
            onClick={onGoToValidation}
            className="w-full p-4 rounded-2xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition-all text-left flex items-center justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {pendingValidationCount} dossiers chauffeurs à valider
                </div>
                <div className="text-xs text-slate-500">Le plus ancien attend depuis 31 h</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
