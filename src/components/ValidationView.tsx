import React, { useState } from 'react';
import {
  Search,
  Filter,
  Check,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  FileText,
  Phone,
  ShieldCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import type { Driver, DriverDocument } from '../types';
import { DocumentModal } from './DocumentModal';

interface ValidationViewProps {
  drivers: Driver[];
  onApproveDriver: (driverId: string, note?: string) => void;
  onRejectDriver: (driverId: string, note?: string) => void;
  onRequestDocs: (driverId: string, note?: string) => void;
  onUpdateDocumentStatus: (driverId: string, docId: string, status: 'conforme' | 'a_verifier' | 'illisible') => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  drivers,
  onApproveDriver,
  onRejectDriver,
  onRequestDocs,
  onUpdateDocumentStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'en_attente' | 'documents_manquants' | 'approuve' | 'rejete'>('en_attente');
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || 'ch-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  const [inspectingDoc, setInspectingDoc] = useState<DriverDocument | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filter drivers by active tab and search
  const filteredDrivers = drivers.filter((d) => {
    const matchTab = d.status === activeTab;
    const matchSearch =
      searchQuery === '' ||
      d.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameAr.includes(searchQuery) ||
      d.nni.includes(searchQuery) ||
      d.immatriculation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const selectedDriver =
    drivers.find((d) => d.id === selectedDriverId) || filteredDrivers[0] || drivers[0];

  const handleApprove = () => {
    if (!selectedDriver) return;
    onApproveDriver(selectedDriver.id, decisionNote);
    setNotificationMsg(`Chauffeur ${selectedDriver.nameFr} approuvé ! SMS d'activation envoyé au ${selectedDriver.phone}`);
    setDecisionNote('');
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleReject = () => {
    if (!selectedDriver) return;
    onRejectDriver(selectedDriver.id, decisionNote);
    setNotificationMsg(`Dossier de ${selectedDriver.nameFr} rejeté. Motif notifié par SMS.`);
    setDecisionNote('');
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleRequestDoc = () => {
    if (!selectedDriver) return;
    const note = decisionNote || 'Merci de re-soumettre une photo nette de votre vignette et CNI verso.';
    onRequestDocs(selectedDriver.id, note);
    setNotificationMsg(`Demande de pièces complémentaires envoyée par SMS au ${selectedDriver.phone}`);
    setDecisionNote('');
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  // Status counts
  const pendingCount = drivers.filter((d) => d.status === 'en_attente').length;
  const missingCount = drivers.filter((d) => d.status === 'documents_manquants').length;
  const approvedCount = drivers.filter((d) => d.status === 'approuve').length;
  const rejectedCount = drivers.filter((d) => d.status === 'rejete').length;

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Toast notification */}
      {notificationMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-emerald-500 hover:text-emerald-800 text-xs font-bold">
            Fermer
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Validation des dossiers chauffeurs</h1>
          <p className="text-xs text-slate-500 mt-1">
            {pendingCount} en attente · délai moyen de traitement 18 h · objectif &lt; 48 h
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('en_attente')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'en_attente'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En attente ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('documents_manquants')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'documents_manquants'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Documents manquants ({missingCount})
          </button>
          <button
            onClick={() => setActiveTab('approuve')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'approuve'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approuvés ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejete')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'rejete'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejetés ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chauffeurs Queue */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          {/* Search in queue */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, plaque, NNI..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" title="Filtrer">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Drivers List */}
          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredDrivers.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                Aucun dossier dans cet état.
              </div>
            ) : (
              filteredDrivers.map((driver) => {
                const isSelected = selectedDriver?.id === driver.id;
                const initials = driver.nameFr
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('');

                return (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 border-orange-300 ring-1 ring-orange-400/40'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {driver.nameFr}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {driver.immatriculation} · {driver.vehicle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {driver.status === 'en_attente' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          Nouveau
                        </span>
                      )}
                      {driver.status === 'documents_manquants' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Document manquant
                        </span>
                      )}
                      {driver.status === 'approuve' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Approuvé
                        </span>
                      )}
                      {driver.status === 'rejete' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                          Rejeté
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        {driver.submittedTimeAgo}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Driver Inspection Detail Card */}
        {selectedDriver && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {/* Driver Identity Card Top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 text-base font-bold shadow-xs">
                  {selectedDriver.nameFr
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">{selectedDriver.nameFr}</h2>
                    <span className="text-sm font-arabic font-bold text-slate-600">
                      {selectedDriver.nameAr}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Dossier N° {selectedDriver.dossierNumber}</span>
                    <span>·</span>
                    <span>Soumis à {selectedDriver.submittedAt}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {selectedDriver.phone}
                    </span>
                    {selectedDriver.otpVerified && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                        OTP vérifié
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="sm:text-right">
                <div className="text-[11px] text-slate-500 font-medium">
                  Progression de la vérification
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedDriver.documentsVerifiedCount} / {selectedDriver.totalDocuments} documents
                </div>
                <div className="w-36 sm:ml-auto bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(selectedDriver.documentsVerifiedCount / selectedDriver.totalDocuments) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Metadata Pills Card */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NNI</span>
                <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                  <span>{selectedDriver.nni}</span>
                  {selectedDriver.nniVerified && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Immatriculation</span>
                <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                  <span>{selectedDriver.immatriculation}</span>
                  {selectedDriver.immatriculationVerified && (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Véhicule</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {selectedDriver.vehicle} {selectedDriver.year}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Couleur</span>
                <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <span>⚪</span>
                  <span>{selectedDriver.color}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Catégorie</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {selectedDriver.category} {selectedDriver.hasClim && '· CLIM'}
                </div>
              </div>
            </div>

            {/* Pièces Justificatives Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Pièces justificatives</h3>
                <span className="text-xs text-slate-400">Cliquez sur un document pour l'agrandir</span>
              </div>

              {/* Grid of 8 Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedDriver.documents.map((doc) => {
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setInspectingDoc(doc)}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-orange-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between group cursor-pointer"
                    >
                      {/* Document icon & thumbnail skeleton */}
                      <div className="relative mb-3 bg-slate-100 rounded-lg p-3 border border-slate-200/60 flex items-center justify-between group-hover:bg-orange-50/40 transition-colors">
                        <div className="space-y-1.5 flex-1 pr-2">
                          <div className="w-12 h-2.5 bg-slate-300/80 rounded" />
                          <div className="w-8 h-2 bg-slate-200 rounded" />
                        </div>
                        <div className="w-6 h-6 rounded-md bg-white text-slate-400 group-hover:text-orange-600 flex items-center justify-center border border-slate-200 shadow-2xs">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Document titles */}
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{doc.subtitle}</div>
                      </div>

                      {/* Status pill */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        {doc.status === 'conforme' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <Check className="w-3 h-3" />
                            <span>Conforme</span>
                          </span>
                        )}
                        {doc.status === 'a_verifier' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            <AlertCircle className="w-3 h-3" />
                            <span>À vérifier</span>
                          </span>
                        )}
                        {doc.status === 'illisible' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                            <XCircle className="w-3 h-3" />
                            <span>Illisible</span>
                          </span>
                        )}
                        {doc.status === 'manquant' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            <span>Non fourni</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision Bottom Block */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Décision
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    placeholder="Motif envoyé au chauffeur par SMS (ex: vignette illisible, veuillez la re-téléverser)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <button
                  onClick={handleReject}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rejeter</span>
                </button>

                <button
                  onClick={handleRequestDoc}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Demander un document</span>
                </button>

                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shadow-emerald-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Approuver le chauffeur</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Inspector Modal */}
      {inspectingDoc && selectedDriver && (
        <DocumentModal
          document={inspectingDoc}
          driverName={selectedDriver.nameFr}
          driverNameAr={selectedDriver.nameAr}
          onClose={() => setInspectingDoc(null)}
          onUpdateStatus={(docId, status) => {
            onUpdateDocumentStatus(selectedDriver.id, docId, status);
            // also update local inspecting doc
            setInspectingDoc({ ...inspectingDoc, status });
          }}
        />
      )}
    </div>
  );
};
