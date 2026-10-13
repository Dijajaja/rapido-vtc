import React, { useState } from 'react';
import {
  Route,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Car,
  Phone,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Wallet,
  Coins,
  MapPin,
  Calendar,
  X,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import type { Ride, RideStatus } from '../types';
import { translations, Lang } from '../lib/translations';

interface RidesManagementViewProps {
  rides: Ride[];
  lang?: Lang;
  onOpenSosRide?: (ride: Ride) => void;
}

export const RidesManagementView: React.FC<RidesManagementViewProps> = ({
  rides,
  lang = 'FR',
  onOpenSosRide,
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RideStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  // Fallback demo rides if none provided
  const enrichedRides: Ride[] = rides.length > 0 ? rides : [
    {
      id: 'ride-01',
      ref: '#R-48213',
      passengerName: 'Mariem S.',
      passengerPhone: '+222 44 12 34 56',
      driverName: 'Amadou O.C.',
      driverPhone: '+222 46 55 43 21',
      from: 'Tevragh Zeina (Ambassade USA)',
      to: 'Marché Capitale (Nouakchott)',
      category: 'Confort',
      amountMru: 1200,
      paymentMethod: 'Bankily',
      status: 'En cours',
      time: 'Il y a 4 min',
      distanceKm: 6.4,
      durationMin: 14,
      commissionMru: 120,
    },
    {
      id: 'ride-02',
      ref: '#R-48212',
      passengerName: 'Cheikh B.',
      passengerPhone: '+222 22 99 88 77',
      driverName: 'Moussa D.',
      driverPhone: '+222 36 21 98 44',
      from: 'Aéroport Oumtounsy',
      to: 'Hôtel Mauricenter (Tevragh)',
      category: 'Premium',
      amountMru: 2400,
      paymentMethod: 'Masrvi',
      status: 'Terminée',
      time: 'Il y a 18 min',
      distanceKm: 18.2,
      durationMin: 28,
      commissionMru: 240,
    },
    {
      id: 'ride-03',
      ref: '#R-48209',
      passengerName: 'Fatimetou M.',
      passengerPhone: '+222 41 55 66 77',
      driverName: null,
      from: 'Carrefour Madrid (Arafat)',
      to: 'Centre Hospitalier National',
      category: 'Économique',
      amountMru: 800,
      paymentMethod: 'Cash',
      status: 'En recherche',
      time: 'Il y a 2 min',
      distanceKm: 4.1,
      durationMin: 12,
      commissionMru: 80,
    },
    {
      id: 'ride-04',
      ref: '#R-48207',
      passengerName: 'Khadija M.',
      passengerPhone: '+222 37 88 99 00',
      driverName: 'Zeidane B.',
      driverPhone: '+222 26 77 88 99',
      from: 'Tevragh Zeina Nord',
      to: 'Carrefour BMD (Ksar)',
      category: 'Confort',
      amountMru: 1400,
      paymentMethod: 'Bankily',
      status: 'En cours',
      time: 'Il y a 7 min',
      distanceKm: 5.8,
      durationMin: 16,
      hasSosAlert: true,
      sosReason: 'Choc léger signalé à Carrefour Sabah',
      commissionMru: 140,
    },
    {
      id: 'ride-05',
      ref: '#R-48201',
      passengerName: 'Ahmed Salem',
      passengerPhone: '+222 49 00 11 22',
      driverName: 'Yacoub Sow',
      driverPhone: '+222 33 44 55 66',
      from: 'Université Nouakchott Al Aasriya',
      to: 'Sebkha Cinquième',
      category: 'Économique',
      amountMru: 900,
      paymentMethod: 'Cash',
      status: 'Terminée',
      time: 'Il y a 45 min',
      distanceKm: 7.2,
      durationMin: 19,
      commissionMru: 90,
    },
    {
      id: 'ride-06',
      ref: '#R-48195',
      passengerName: 'Bilal Ould Amar',
      passengerPhone: '+222 27 33 44 55',
      driverName: 'Sidi El Moctar',
      driverPhone: '+222 22 88 14 02',
      from: 'Port de l\'Amitié (PANPA)',
      to: 'Teyarett',
      category: 'Van / Famille',
      amountMru: 2800,
      paymentMethod: 'Bankily',
      status: 'Terminée',
      time: 'Il y a 1 h',
      distanceKm: 14.5,
      durationMin: 32,
      commissionMru: 280,
    },
    {
      id: 'ride-07',
      ref: '#R-48189',
      passengerName: 'Zeinabou Diop',
      passengerPhone: '+222 32 44 55 66',
      driverName: null,
      from: 'Dar Naim',
      to: 'Marché Capitale',
      category: 'Économique',
      amountMru: 850,
      paymentMethod: 'Cash',
      status: 'Annulée',
      time: 'Il y a 1 h 20',
      distanceKm: 6.0,
      durationMin: 15,
      commissionMru: 0,
    },
  ];

  // Filtering
  const filteredRides = enrichedRides.filter((r) => {
    const matchesSearch =
      r.ref.toLowerCase().includes(search.toLowerCase()) ||
      r.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      (r.driverName && r.driverName.toLowerCase().includes(search.toLowerCase())) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const countInProgress = enrichedRides.filter((r) => r.status === 'En cours').length;
  const countCompleted = enrichedRides.filter((r) => r.status === 'Terminée').length;
  const countSearching = enrichedRides.filter((r) => r.status === 'En recherche').length;
  const countCancelled = enrichedRides.filter((r) => r.status === 'Annulée').length;

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Courses</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs">
              {enrichedRides.length} courses aujourd'hui
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervision en direct des trajets commandés, en cours et terminés à Nouakchott (tarification MRU & commissions).
          </p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Toutes ({enrichedRides.length})
            </button>
            <button
              onClick={() => setStatusFilter('En cours')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'En cours'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              En cours ({countInProgress})
            </button>
            <button
              onClick={() => setStatusFilter('En recherche')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === 'En recherche'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              En recherche ({countSearching})
            </button>
            <button
              onClick={() => setStatusFilter('Terminée')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'Terminée'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Terminées ({countCompleted})
            </button>
            <button
              onClick={() => setStatusFilter('Annulée')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'Annulée'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Annulées ({countCancelled})
            </button>
          </div>

          {/* Search Input & Category selector */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Réf #R-..., passager, chauffeur, quartier..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Économique">Économique</option>
              <option value="Confort">Confort</option>
              <option value="Premium">Premium</option>
              <option value="Van / Famille">Van / Famille</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Rides Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">RÉF.</th>
                <th className="py-3.5 px-4">PASSAGER</th>
                <th className="py-3.5 px-4">CHAUFFEUR</th>
                <th className="py-3.5 px-4">TRAJET (NOUAKCHOTT)</th>
                <th className="py-3.5 px-4">CATÉGORIE</th>
                <th className="py-3.5 px-4">PAIEMENT</th>
                <th className="py-3.5 px-4 text-right">MONTANT & COMM.</th>
                <th className="py-3.5 px-4 text-center">STATUT</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRides.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Aucune course trouvée correspondant à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredRides.map((ride) => {
                  return (
                    <tr
                      key={ride.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        ride.hasSosAlert ? 'bg-red-50/40' : ''
                      }`}
                    >
                      {/* Ref */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span>{ride.ref}</span>
                          {ride.hasSosAlert && (
                            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black animate-pulse">
                              SOS
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{ride.time}</div>
                      </td>

                      {/* Passenger */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{ride.passengerName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{ride.passengerPhone || '+222 4X XX XX XX'}</span>
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="py-3.5 px-4">
                        {ride.driverName ? (
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1">
                              <span>{ride.driverName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{ride.driverPhone || '+222 46 55 43 21'}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                            <Clock className="w-2.5 h-2.5" />
                            En attente d'assignation
                          </span>
                        )}
                      </td>

                      {/* Itinerary */}
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium truncate">
                          <span className="text-slate-900">{ride.from}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-slate-900">{ride.to}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ride.distanceKm} km · env. {ride.durationMin} min
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ride.category === 'Premium'
                              ? 'bg-purple-100 text-purple-700'
                              : ride.category === 'Confort'
                              ? 'bg-blue-100 text-blue-700'
                              : ride.category === 'Van / Famille'
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ride.category}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            ride.paymentMethod === 'Bankily'
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : ride.paymentMethod === 'Masrvi'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <Wallet className="w-2.5 h-2.5" />
                          <span>{ride.paymentMethod || 'Bankily'}</span>
                        </span>
                      </td>

                      {/* Amount & Commission */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-slate-900">
                          {ride.amountMru.toLocaleString()} MRU
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          Comm. {(ride.commissionMru || Math.round(ride.amountMru * 0.1))} MRU (10%)
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            ride.status === 'En cours'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ride.status === 'Terminée'
                              ? 'bg-slate-100 text-slate-700'
                              : ride.status === 'En recherche'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {ride.status === 'En cours' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          )}
                          {ride.status === 'Terminée' && <CheckCircle2 className="w-3 h-3 text-slate-400" />}
                          {ride.status === 'En recherche' && <Clock className="w-3 h-3 text-amber-500" />}
                          {ride.status === 'Annulée' && <XCircle className="w-3 h-3 text-rose-500" />}
                          <span>{ride.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRide(ride)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Détails</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ride Detail Inspector Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Route className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Course {selectedRide.ref}</h3>
                  <div className="text-[11px] text-slate-500">{selectedRide.time} · {selectedRide.category}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRide(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* SOS Notice if active */}
              {selectedRide.hasSosAlert && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-900">Incident SOS en direct</h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      {selectedRide.sosReason || 'Alerte déclenchée par le passager à bord.'}
                    </p>
                    {onOpenSosRide && (
                      <button
                        onClick={() => {
                          setSelectedRide(null);
                          onOpenSosRide(selectedRide);
                        }}
                        className="mt-2 px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700 shadow-2xs"
                      >
                        Ouvrir le protocole d'urgence SOS
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Itinerary Visual */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Itinéraire Nouakchott</div>
                <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[19px] top-1 border-2 border-white"></span>
                    <div className="text-[11px] text-slate-400">Point de départ</div>
                    <div className="font-semibold text-slate-900 text-xs">{selectedRide.from}</div>
                  </div>
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 absolute -left-[19px] top-1 border-2 border-white"></span>
                    <div className="text-[11px] text-slate-400">Destination</div>
                    <div className="font-semibold text-slate-900 text-xs">{selectedRide.to}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>Distance : <b>{selectedRide.distanceKm} km</b></span>
                  <span>Durée estimée : <b>{selectedRide.durationMin} min</b></span>
                </div>
              </div>

              {/* Passenger & Driver Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Passager</div>
                  <div className="font-bold text-slate-900 text-xs mt-1">{selectedRide.passengerName}</div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{selectedRide.passengerPhone || '+222 4X XX XX XX'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Chauffeur</div>
                  <div className="font-bold text-slate-900 text-xs mt-1">
                    {selectedRide.driverName || 'Non assigné'}
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <Car className="w-3 h-3 text-slate-400" />
                    <span>{selectedRide.category}</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Règlement & Ventilation financière
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Prix total course</span>
                  <span className="font-bold text-slate-900">{selectedRide.amountMru} MRU</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Commission Rapido (10%)</span>
                  <span className="font-semibold text-emerald-600">
                    -{(selectedRide.commissionMru || Math.round(selectedRide.amountMru * 0.1))} MRU
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pt-2 border-t border-slate-200 font-bold">
                  <span>Gain net chauffeur</span>
                  <span className="text-slate-900">
                    {selectedRide.amountMru - (selectedRide.commissionMru || Math.round(selectedRide.amountMru * 0.1))} MRU
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Mode de paiement</span>
                  <span className="font-semibold text-slate-700">{selectedRide.paymentMethod || 'Bankily'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRide(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200/60"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
