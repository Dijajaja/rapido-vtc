import React from 'react';
import {
  LayoutDashboard,
  Route,
  Navigation,
  Car,
  ShieldCheck,
  Users,
  CreditCard,
  Tag,
  Headphones,
  Settings,
  FolderTree,
  GitBranch,
  Terminal,
  LogOut,
  Layers
} from 'lucide-react';
import type { AdminUser } from '../types';

export type NavTab =
  | 'overview'
  | 'rides'
  | 'tracking'
  | 'drivers'
  | 'validation'
  | 'passengers'
  | 'payments'
  | 'pricing'
  | 'support'
  | 'settings'
  | 'pages_roadmap'
  | 'git_guide'
  | 'api_explorer';

import { translations, Lang } from '../lib/translations';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingValidationCount: number;
  lang?: Lang;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingValidationCount,
  lang = 'FR',
  adminUser,
  onLogout,
}) => {
  const t = translations[lang];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none min-h-screen ${
        lang === 'AR' ? 'border-r-0 border-l' : ''
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 pb-4 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-lg">{t.brand_title}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <span className="text-sm">🇲🇷</span>
              <span>{t.city}</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Section: PILOTAGE */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {t.pilotage}
            </div>
            <nav className="space-y-1">
              {/* Vue d'ensemble */}
              <button
                onClick={() => onSelectTab('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'overview'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard
                  className={`w-4 h-4 ${currentTab === 'overview' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.overview}</span>
              </button>

              {/* Courses (Rides) - Registre dédié */}
              <button
                onClick={() => onSelectTab('rides')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'rides'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Route
                  className={`w-4 h-4 ${currentTab === 'rides' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span className="flex-1 text-left">{t.rides}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded">
                  Tableau
                </span>
              </button>

              {/* Suivi en direct (Live Tracking & Carte) */}
              <button
                onClick={() => onSelectTab('tracking')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'tracking'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Navigation
                  className={`w-4 h-4 ${currentTab === 'tracking' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span className="flex-1 text-left">{lang === 'AR' ? 'التتبع المباشر' : 'Suivi direct'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>

              {/* Chauffeurs (Directory) */}
              <button
                onClick={() => onSelectTab('drivers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'drivers'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Car
                  className={`w-4 h-4 ${currentTab === 'drivers' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.drivers}</span>
              </button>

              {/* Validation des dossiers */}
              <button
                onClick={() => onSelectTab('validation')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'validation'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className={`w-4 h-4 ${currentTab === 'validation' ? 'text-orange-500' : 'text-slate-400'}`}
                  />
                  <span>{t.validation}</span>
                </div>
                {pendingValidationCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500 text-white shadow-xs">
                    {pendingValidationCount}
                  </span>
                )}
              </button>

              {/* Passagers */}
              <button
                onClick={() => onSelectTab('passengers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'passengers'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users
                  className={`w-4 h-4 ${currentTab === 'passengers' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.passengers}</span>
              </button>

              {/* Paiements */}
              <button
                onClick={() => onSelectTab('payments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'payments'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <CreditCard
                  className={`w-4 h-4 ${currentTab === 'payments' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.payments}</span>
              </button>
            </nav>
          </div>

          {/* Section: CONFIGURATION */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {t.configuration}
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => onSelectTab('pricing')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'pricing'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Tag
                  className={`w-4 h-4 ${currentTab === 'pricing' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.pricing}</span>
              </button>

              <button
                onClick={() => onSelectTab('support')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'support'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Headphones
                  className={`w-4 h-4 ${currentTab === 'support' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.support}</span>
              </button>

              <button
                onClick={() => onSelectTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'settings'
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Settings
                  className={`w-4 h-4 ${currentTab === 'settings' ? 'text-orange-500' : 'text-slate-400'}`}
                />
                <span>{t.settings}</span>
              </button>
            </nav>
          </div>

          {/* Section: ARCHITECTURE & OUTILS DEV - COMMENTÉ
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              {lang === 'AR' ? 'الهندسة والمطور' : 'Architecture & Dev'}
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => onSelectTab('pages_roadmap')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'pages_roadmap'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FolderTree
                  className={`w-4 h-4 ${currentTab === 'pages_roadmap' ? 'text-blue-600' : 'text-slate-400'}`}
                />
                <span className="flex-1 text-left">Pages & Modules</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                  Doc
                </span>
              </button>

              <button
                onClick={() => onSelectTab('git_guide')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'git_guide'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <GitBranch
                  className={`w-4 h-4 ${currentTab === 'git_guide' ? 'text-indigo-600' : 'text-slate-400'}`}
                />
                <span className="flex-1 text-left">{t.git_guide}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                  Git
                </span>
              </button>

              <button
                onClick={() => onSelectTab('api_explorer')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'api_explorer'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Terminal
                  className={`w-4 h-4 ${currentTab === 'api_explorer' ? 'text-emerald-600' : 'text-slate-400'}`}
                />
                <span className="flex-1 text-left">{t.api_explorer}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                  REST
                </span>
              </button>
            </nav>
          </div>
          */}
        </div>
      </div>
      {adminUser && onLogout && (
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <LogOut className="size-4 text-slate-400" aria-hidden="true" />
            <span>{lang === 'AR' ? 'تسجيل الخروج' : 'Déconnexion'}</span>
          </button>
        </div>
      )}
    </aside>
  );
};
