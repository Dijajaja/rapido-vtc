import React from 'react';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  CreditCard,
  ChevronRight,
  X
} from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAllRead,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'sos':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'driver':
        return <UserCheck className="w-4 h-4 text-orange-600" />;
      case 'peak':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'finance':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'sos':
        return 'bg-red-50 border-red-200';
      case 'driver':
        return 'bg-orange-50 border-orange-200';
      case 'peak':
        return 'bg-blue-50 border-blue-200';
      case 'finance':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <>
      {/* Invisible backdrop to close on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover dropdown container */}
      <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="p-3.5 px-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {/* List of notifications */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick(notif)}
                  className={`p-3.5 px-4 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50/90 ${
                    !notif.read ? 'bg-orange-50/20' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getBgColor(
                      notif.type
                    )}`}
                  >
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs truncate ${
                          !notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {notif.timeAgo}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2"></span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 px-4 bg-slate-50/60 border-t border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 font-medium">
            Alertes en temps réel synchronisées avec le backend Rapido
          </span>
        </div>
      </div>
    </>
  );
};
