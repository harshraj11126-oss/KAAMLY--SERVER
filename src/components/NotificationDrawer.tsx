import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Briefcase,
  MessageSquare,
  Star,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { NotificationItem } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onRefresh: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
  onNotificationClick
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => KaamlyStore.markNotificationAsRead(n.id));
    onRefresh();
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'job_application':
      case 'application_accepted':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'booking_confirmed':
      case 'job_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'new_review':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Notifications</h3>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full">
                {notifications.filter((n) => !n.read).length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors text-xs"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-slate-500">
                Job applications, work updates and messages will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  KaamlyStore.markNotificationAsRead(n.id);
                  onRefresh();
                  onNotificationClick(n);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-950/80 shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate pr-1">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.body}</p>
                    <span className="text-[10px] text-slate-500 mt-1.5 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
