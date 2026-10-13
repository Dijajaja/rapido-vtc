import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, CheckCircle2, X, MapPin, Radio } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, onResolve }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-red-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 px-6 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Alerte SOS · Course #R-48207</h3>
              <p className="text-xs text-red-100">Déclenchée en direct à Tevragh Zeina il y a 2 min</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Situation Summary */}
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-red-700">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <span>Signal d'urgence passager actif</span>
            </div>
            <p className="text-slate-700">
              Passagère : <strong className="text-slate-900">Khadija M. (+222 44 12 34 56)</strong>
            </p>
            <p className="text-slate-700">
              Chauffeur : <strong className="text-slate-900">Zeidane B. (+222 36 99 88 11)</strong> · Toyota Corolla 3109 AB 00
            </p>
            <p className="text-slate-700">
              Position GPS : <span className="font-mono text-slate-800">18.0942° N, 15.9785° W</span> (Tevragh Zeina Nord)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Actions d'intervention immédiates :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+22244123456"
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2.5 font-bold text-slate-800 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-orange-500" />
                <span>Appeler la passagère</span>
              </a>
              <a
                href="tel:+22236998811"
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2.5 font-bold text-slate-800 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-blue-500" />
                <span>Appeler le chauffeur</span>
              </a>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-700" />
                <div>
                  <div className="font-bold text-slate-800">Police Nationale / Gendarmerie</div>
                  <div className="text-[11px] text-slate-500">Numéro d'urgence Mauritanie (117)</div>
                </div>
              </div>
              <a
                href="tel:117"
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800"
              >
                Appeler 117
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold"
          >
            Fermer sans résoudre
          </button>
          <button
            onClick={onResolve}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Résoudre l'incident</span>
          </button>
        </div>
      </div>
    </div>
  );
};
