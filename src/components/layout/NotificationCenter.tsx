import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, Calendar, Package, AlertTriangle, Info, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification, NotificationType, NotificationPriority } from '../../types';
import { Link } from 'react-router-dom';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'expiry': return <Calendar className="text-error" size={18} />;
      case 'low_stock': return <Package className="text-warning" size={18} />;
      case 'order': return <Info className="text-primary" size={18} />;
      default: return <AlertTriangle className="text-on-surface-variant" size={18} />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'critical': return 'bg-error/10 text-error';
      case 'high': return 'bg-error/5 text-error/80';
      case 'medium': return 'bg-warning/10 text-warning';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-on-surface-variant/60 hover:bg-surface-container rounded-sm transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full border-2 border-surface flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-[400px] bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
              <div>
                <h3 className="font-headline font-bold text-on-surface">Notifications</h3>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">
                  {unreadCount} Unread Alerts
                </p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => markAllAsRead.mutate()}
                  className="p-2 text-on-surface-variant/60 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                  title="Mark all as read"
                >
                  <Check size={18} />
                </button>
                <Link 
                  to="/settings/notifications" 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-on-surface-variant/60 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                  title="Notification Settings"
                >
                  <Settings size={18} />
                </Link>
              </div>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-outline-variant/5">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => notification.status === 'unread' && markAsRead.mutate(notification.id)}
                      className={`p-4 flex gap-4 hover:bg-primary/[0.02] transition-colors cursor-pointer group ${notification.status === 'unread' ? 'bg-primary/[0.03]' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-outline-variant/10 ${getPriorityColor(notification.priority)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold truncate ${notification.status === 'unread' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                            {notification.title}
                          </p>
                          {notification.status === 'unread' && (
                            <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/40 font-mono mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
                    <Bell size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-on-surface">No notifications</p>
                    <p className="text-xs text-on-surface-variant">You're all caught up! No new alerts.</p>
                  </div>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-surface-container-low/30 border-t border-outline-variant/10">
                <button className="w-full py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-widest">
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
