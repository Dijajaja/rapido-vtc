import React from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import type { DriverDocument } from '../types';

interface DocumentModalProps {
  document: DriverDocument | null;
  driverName: string;
  driverNameAr?: string;
  onClose: () => void;
  onUpdateStatus: (docId: string, status: 'conforme' | 'a_verifier' | 'illisible') => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  driverName,
  driverNameAr,
  onClose,
  onUpdateStatus,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-slate-900 text-sm">{document.title}</h3>
              <span className="text-xs text-slate-400 font-medium">· {document.subtitle}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chauffeur : <strong className="text-slate-800">{driverName}</strong> {driverNameAr && `(${driverNameAr})`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Document Preview Area */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center min-h-[320px] relative">
          {/* Simulated High-Res Mauritanian Official Document */}
          <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-md border border-slate-200 relative select-none">
            {/* Watermark header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  République Islamique de Mauritanie
                </div>
                <div className="text-[9px] text-slate-400 font-arabic">الجمهورية الإسلامية الموريتانية</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-700">DOCUMENT OFFICIEL</div>
                <div className="text-[9px] text-emerald-600 font-semibold">AUTHENTIFIÉ</div>
              </div>
            </div>

            {/* Document Body Graphic */}
            <div className="space-y-2 py-2">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-lg bg-slate-200 border border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-slate-300 mb-1" />
                  <span className="text-[9px] font-bold">PHOTO</span>
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Titulaire :</span>
                    <div className="font-bold text-slate-800">{driverName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Type :</span>
                    <div className="font-semibold text-slate-700">{document.title}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Référence :</span>
                    <div className="font-mono text-xs text-slate-600">{document.subtitle}</div>
                  </div>
                </div>
              </div>

              {/* Security barcode / pattern */}
              <div className="mt-4 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-slate-400 h-6"
                      style={{ opacity: (i % 3 === 0 ? 0.9 : 0.4) }}
                    />
                  ))}
                </div>
                <div className="text-[9px] font-mono text-slate-400">MRU-SEC-VERIFIED</div>
              </div>
            </div>

            {/* Document current evaluation badge */}
            <div className="absolute top-3 right-3">
              {document.status === 'conforme' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Conforme ✓
                </span>
              )}
              {document.status === 'a_verifier' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  À vérifier ⚠
                </span>
              )}
              {document.status === 'illisible' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                  Illisible ✕
                </span>
              )}
            </div>
          </div>

          {/* Quick Inspector Toolbar */}
          <div className="mt-4 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <button className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors" title="Zoomer">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors" title="Dézoomer">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors" title="Faire pivoter">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Evaluation Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-white flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Évaluer cette pièce :</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateStatus(document.id, 'illisible');
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Marquer Illisible</span>
            </button>

            <button
              onClick={() => {
                onUpdateStatus(document.id, 'a_verifier');
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>À vérifier</span>
            </button>

            <button
              onClick={() => {
                onUpdateStatus(document.id, 'conforme');
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Conforme ✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
