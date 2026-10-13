import React, { useState } from 'react';
import {
  Car,
  Filter,
  List,
  Map as MapIcon,
  AlertTriangle,
  Flame,
  Clock,
  UserCheck,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Navigation
} from 'lucide-react';
import type { LiveVehicle, SurgeZone, Ride } from '../types';
import { SosModal } from './SosModal';

interface TrackingViewProps {
  vehicles: LiveVehicle[];
  surgeZones: SurgeZone[];
  sosRide?: Ride | null;
  onResolveSos: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  vehicles,
  surgeZones,
  sosRide,
  onResolveSos,
}) => {
  const [viewMode, setViewMode] = useState<'carte' | 'liste'>('carte');
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(vehicles[0] || null);
  const [showSosModal, setShowSosModal] = useState(false);

  const availableCount = vehicles.filter((v) => v.status === 'Disponible').length;
  const inTripCount = vehicles.filter((v) => v.status === 'En course' || v.status === 'En approche').length;

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suivi en temps réel</h1>
          <p className="text-xs text-slate-500 mt-1">
            Nouakchott · 212 chauffeurs en ligne · 87 courses en cours
          </p>
        </div>

        {/* View Switchers & Filter */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 text-xs font-medium">
            <button
              onClick={() => setViewMode('carte')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'carte'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Carte</span>
            </button>
            <button
              onClick={() => setViewMode('liste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'liste'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Liste des courses</span>
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs overflow-hidden relative">
          <div className="relative w-full h-[620px] bg-[#E8ECEF] rounded-xl overflow-hidden border border-slate-200/60 select-none">
            {/* SVG Base Map of Nouakchott */}
            <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
              {/* Coastline / Atlantic Ocean on the West */}
              <path
                d="M 0,0 L 140,0 Q 180,200 130,400 Q 100,500 120,600 L 0,600 Z"
                fill="#C6DBEF"
                opacity="0.8"
              />
              <text x="30" y="300" fill="#2B6CB0" fontSize="13" fontWeight="bold" opacity="0.6" transform="rotate(-90 30,300)">
                OCÉAN ATLANTIQUE
              </text>

              {/* City Grid Roads */}
              {/* Major arterial roads */}
              <line x1="130" y1="280" x2="800" y2="280" stroke="#CBD5E1" strokeWidth="6" /> {/* Av Gamal Abdel Nasser */}
              <line x1="140" y1="120" x2="700" y2="580" stroke="#CBD5E1" strokeWidth="5" /> {/* Diagonale */}
              <line x1="380" y1="40" x2="450" y2="580" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" /> {/* Route de Nouadhibou / Bd de l'Espoir */}
              <line x1="380" y1="40" x2="750" y2="100" stroke="#CBD5E1" strokeWidth="5" /> {/* Route Aéroport Oumtounsy */}

              {/* Secondary avenues */}
              <line x1="220" y1="80" x2="780" y2="80" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="200" y1="180" x2="800" y2="180" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="180" y1="360" x2="800" y2="360" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="160" y1="440" x2="800" y2="440" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="150" y1="520" x2="800" y2="520" stroke="#E2E8F0" strokeWidth="3" />

              <line x1="260" y1="40" x2="260" y2="580" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="520" y1="40" x2="520" y2="580" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="600" y1="40" x2="600" y2="580" stroke="#E2E8F0" strokeWidth="3" />
              <line x1="680" y1="40" x2="680" y2="580" stroke="#E2E8F0" strokeWidth="3" />

              {/* Highlight Avenue (Route de l'Espoir / Tevragh Zeina) */}
              <line x1="240" y1="100" x2="640" y2="460" stroke="#FED7AA" strokeWidth="7" opacity="0.9" />

              {/* District Labels */}
              <text x="340" y="160" fill="#64748B" fontSize="12" fontWeight="bold" letterSpacing="1">
                TEVRAGH ZEINA
              </text>
              <text x="360" y="320" fill="#64748B" fontSize="11" fontWeight="bold" letterSpacing="1">
                KSAR
              </text>
              <text x="240" y="420" fill="#64748B" fontSize="11" fontWeight="bold" letterSpacing="1">
                SEBKHA
              </text>
              <text x="440" y="470" fill="#64748B" fontSize="11" fontWeight="bold" letterSpacing="1">
                ARAFAT
              </text>
              <text x="560" y="240" fill="#64748B" fontSize="11" fontWeight="bold" letterSpacing="1">
                TEYARETT
              </text>
              <text x="640" y="340" fill="#64748B" fontSize="11" fontWeight="bold" letterSpacing="1">
                DAR NAIM
              </text>
              <text x="580" y="90" fill="#64748B" fontSize="11" fontWeight="bold" letterSpacing="1">
                AÉROPORT OUMTOUNSY ✈
              </text>
            </svg>

            {/* Interactive Vehicle Markers overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {vehicles.map((v) => {
                const isSelected = selectedVehicle?.id === v.id;
                const isAvailable = v.status === 'Disponible';
                return (
                  <div
                    key={v.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicle(v);
                    }}
                    style={{ left: `${v.x}%`, top: `${v.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-10"
                  >
                    {/* Pulsing ring for in-trip or selected */}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full bg-orange-400/30 animate-ping pointer-events-none" />
                    )}

                    {/* Car Marker Circle */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-125 ${
                        isAvailable
                          ? 'bg-[#1E293B] ring-2 ring-white'
                          : 'bg-orange-500 ring-2 ring-white shadow-orange-500/30'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                    </div>

                    {/* Quick tooltip on hover */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                      {v.driverName} ({v.plate})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top-Left Legend on Map */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs p-2.5 px-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4 text-xs font-bold text-slate-800 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />
                <span>Disponibles {availableCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>En course {inTripCount}</span>
              </div>
            </div>

            {/* Top-Right Zones à forte demande card on Map */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl shadow-sm border border-slate-200/80 space-y-2 text-xs min-w-[190px] z-10">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Zones à forte demande</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {surgeZones.slice(0, 3).map((zone) => (
                  <div key={zone.name} className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="truncate pr-2">{zone.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-bold text-[11px] border border-orange-200/60">
                      ×{zone.multiplier.toString().replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom-Left Stats Chips on Map */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
              <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-sm border border-slate-200/80">
                <div className="text-[10px] text-slate-500 font-medium">Attente moyenne passager</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">3 min 40 s</div>
              </div>

              <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-sm border border-slate-200/80">
                <div className="text-[10px] text-slate-500 font-medium">Demandes sans chauffeur</div>
                <div className="text-sm font-bold text-rose-600 mt-0.5">6</div>
              </div>
            </div>

            {/* Selected Vehicle Float Card (if any) */}
            {selectedVehicle && (
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-xl shadow-lg border border-slate-200 max-w-xs z-10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-xs text-slate-900">
                    {selectedVehicle.driverName}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedVehicle.status === 'Disponible'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {selectedVehicle.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Plaque : <strong className="text-slate-700">{selectedVehicle.plate}</strong></div>
                  <div>Secteur actuel : <strong className="text-slate-700">{selectedVehicle.currentZone}</strong></div>
                  {selectedVehicle.destination && (
                    <div>Destination : <strong className="text-slate-700">{selectedVehicle.destination}</strong> (ETA {selectedVehicle.etaMinutes}m)</div>
                  )}
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{selectedVehicle.rating}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: SOS Card & Chauffeurs actifs */}
        <div className="lg:col-span-4 space-y-4">
          {/* SOS Alert Banner Card */}
          {sosRide && (
            <div className="bg-white rounded-2xl border border-red-200 p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Alerte SOS · course {sosRide.ref}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Déclenchée par la passagère il y a 2 min
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSosModal(true)}
                className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Ouvrir
              </button>
            </div>
          )}

          {/* Chauffeurs actifs Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Chauffeurs actifs</h2>
              <button className="text-xs font-semibold text-orange-600 hover:underline">
                Tout voir
              </button>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {vehicles.map((v) => {
                const isSelected = selectedVehicle?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-300 bg-orange-50/50'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                        {v.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {v.driverName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {v.plate}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {v.currentZone}
                          {v.destination && ` → ${v.destination}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {v.status === 'En course' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200/60">
                          En course
                        </span>
                      )}
                      {v.status === 'Disponible' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Disponible
                        </span>
                      )}
                      {v.status === 'En approche' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          En approche
                        </span>
                      )}
                      <div className="flex items-center justify-end gap-1 text-[11px] text-amber-500 font-semibold mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{v.rating.toFixed(2)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <SosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        onResolve={() => {
          onResolveSos();
          setShowSosModal(false);
        }}
      />
    </div>
  );
};
