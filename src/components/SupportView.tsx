import React, { useState } from 'react';
import {
  Headphones,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Car,
  Filter,
  Send,
  Check,
  X
} from 'lucide-react';
import type { SupportTicket } from '../types';
import type { Lang } from '../lib/translations';

interface SupportViewProps {
  tickets: SupportTicket[];
  onResolveTicket: (id: string, response: string) => void;
  lang?: Lang;
}

export const SupportView: React.FC<SupportViewProps> = ({
  tickets,
  onResolveTicket,
  lang = 'FR'
}) => {
  const [ticketList, setTicketList] = useState<SupportTicket[]>(tickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ouvert' | 'en_cours' | 'resolu'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const isArabic = lang === 'AR';

  const filtered = ticketList.filter((t) => {
    const matchSearch =
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSendResponse = (id: string) => {
    if (!responseText.trim()) return;
    onResolveTicket(id, responseText);
    setTicketList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolu', adminResponse: responseText } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: 'resolu', adminResponse: responseText } : null
      );
    }
    setResponseText('');
    setToast(isArabic ? 'تم الرد على التذكرة وإغلاقها بنجاح' : 'Réponse envoyée et ticket clôturé avec succès');
    setTimeout(() => setToast(null), 3500);
  };

  const openCount = ticketList.filter((t) => t.status === 'ouvert').length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-xs font-bold mb-3">
            <Headphones className="w-3.5 h-3.5" />
            {isArabic ? 'خدمة العملاء والشكاوى' : 'Support & Réclamations · Rapido Nouakchott'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isArabic ? 'مركز الدعم والمساعدة' : 'Assistance & Signalements'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {isArabic
              ? 'معالجة شكاوى الركاب والسائقين (المفقودات، خلافات الدفع، المشاكل التقنية).'
              : 'Gérez les réclamations clients et chauffeurs, contestations tarifaires et déclarations d\'objets perdus.'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div className="text-center px-2">
            <div className="text-xl font-black text-rose-600">{openCount}</div>
            <div className="text-[11px] font-semibold text-slate-500">
              {isArabic ? 'تذاكر مفتوحة' : 'En attente'}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <div className="text-xl font-black text-emerald-600">
              {ticketList.filter((t) => t.status === 'resolu').length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              {isArabic ? 'تم حلها' : 'Résolus'}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isArabic ? 'بحث في التذاكر أو اسم المستخدم...' : 'Rechercher par référence, nom ou objet...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isArabic ? 'الكل' : 'Tous'} ({ticketList.length})
          </button>
          <button
            onClick={() => setStatusFilter('ouvert')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'ouvert'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            {isArabic ? 'مفتوح' : 'Ouverts'} ({ticketList.filter((t) => t.status === 'ouvert').length})
          </button>
          <button
            onClick={() => setStatusFilter('resolu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'resolu'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isArabic ? 'محلول' : 'Résolus'} ({ticketList.filter((t) => t.status === 'resolu').length})
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
                selectedTicket?.id === ticket.id
                  ? 'border-orange-500 ring-1 ring-orange-500/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {ticket.ref}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                      ticket.userType === 'chauffeur'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {ticket.userType === 'chauffeur' ? <Car className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {ticket.userType === 'chauffeur' ? 'Chauffeur' : 'Passager'}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    ticket.status === 'resolu'
                      ? 'bg-emerald-50 text-emerald-700'
                      : ticket.priority === 'urgente'
                      ? 'bg-rose-50 text-rose-700 animate-pulse'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {ticket.status === 'resolu' ? 'Résolu' : ticket.priority === 'urgente' ? 'Urgent' : 'En cours'}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-1">{ticket.subject}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                {ticket.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">{ticket.userName} ({ticket.userPhone})</span>
                <span>{ticket.createdAt}</span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
              Aucun ticket correspondant aux filtres.
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs h-fit sticky top-6 space-y-4">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-600">{selectedTicket.ref}</span>
                  <h3 className="font-bold text-slate-900 text-base">{selectedTicket.subject}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTicket.status === 'resolu' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedTicket.status === 'resolu' ? 'Résolu' : 'Ouvert'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Émetteur :</span>
                  <span className="font-bold text-slate-900">{selectedTicket.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Téléphone :</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedTicket.userPhone}</span>
                </div>
                {selectedTicket.rideRef && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Course liée :</span>
                    <span className="font-mono text-orange-600 font-bold">{selectedTicket.rideRef}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message :</label>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200">
                  {selectedTicket.description}
                </div>
              </div>

              {selectedTicket.adminResponse && (
                <div>
                  <label className="block text-xs font-bold text-emerald-700 mb-1">Réponse de l'administrateur :</label>
                  <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 leading-relaxed border border-emerald-200">
                    {selectedTicket.adminResponse}
                  </div>
                </div>
              )}

              {selectedTicket.status !== 'resolu' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800">Répondre et clôturer le ticket :</label>
                  <textarea
                    rows={3}
                    placeholder="Tapez votre réponse pour l'utilisateur..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => handleSendResponse(selectedTicket.id)}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Envoyer et marquer comme résolu
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Sélectionnez un ticket dans la liste pour afficher le dossier complet et y répondre.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
