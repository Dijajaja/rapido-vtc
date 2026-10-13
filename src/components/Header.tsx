import React, { useState } from 'react';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { translations } from '../lib/translations';
import { NotificationsDropdown } from './NotificationsDropdown';
import type { NotificationItem, AdminUser } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lang: 'FR' | 'AR';
  onToggleLang: () => void;
  hasActiveSos?: boolean;
  onOpenSos?: () => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  onMarkAllNotifsRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  lang,
  onToggleLang,
  hasActiveSos,
  onOpenSos,
  notifications,
  unreadNotifsCount,
  onMarkAllNotifsRead,
  onNotificationClick,
  adminUser,
  onLogout,
}) => {
  const t = translations[lang];
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.search_placeholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Right Tools & Status */}
      <div className="flex items-center gap-3">
        {/* SOS Quick alert if active */}
        {hasActiveSos && (
          <button
            onClick={onOpenSos}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold animate-pulse hover:bg-red-100 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>SOS</span>
          </button>
        )}

        {/* System Health Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{t.system_operational}</span>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            title="Notifications (Nouvelles courses & dossiers)"
            className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer ${
              showNotifs ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
            )}
          </button>

          <NotificationsDropdown
            isOpen={showNotifs}
            onClose={() => setShowNotifs(false)}
            notifications={notifications}
            unreadCount={unreadNotifsCount}
            onMarkAllRead={() => {
              onMarkAllNotifsRead();
            }}
            onNotificationClick={(notif) => {
              setShowNotifs(false);
              onNotificationClick(notif);
            }}
          />
        </div>

        {/* Language switch FR / AR */}
        <button
          onClick={onToggleLang}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          title="Changer la langue (Français / Arabe)"
        >
          <span className={lang === 'FR' ? 'text-orange-600 font-bold' : 'text-slate-400'}>FR</span>
          <span className="text-slate-300">|</span>
          <span
            className={
              lang === 'AR'
                ? 'text-orange-600 font-bold font-["Tajawal"]'
                : 'text-slate-400 font-["Tajawal"]'
            }
          >
            ع
          </span>
        </button>

        {/* Admin Profile Chip with Menu */}
        {adminUser && (
          <div className="relative pl-1 border-l border-slate-200">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center border border-orange-200">
                {adminUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {adminUser.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {adminUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in duration-100">
                  <div className="p-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                        SB
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{adminUser.name}</div>
                        <div className="text-[10px] text-slate-500">{adminUser.email}</div>
                      </div>
                    </div>
                  </div>

                  {onLogout && (
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Déconnexion sécurisée</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
