import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { useNotificationStore, NotificationType } from '../../store/useNotificationStore';

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="text-success" size={20} />,
  error: <AlertCircle className="text-error" size={20} />,
  warning: <AlertTriangle className="text-warning" size={20} />,
  info: <Info className="text-primary" size={20} />,
};

const bgColors: Record<NotificationType, string> = {
  success: 'bg-success/10 border-success/20',
  error: 'bg-error/10 border-error/20',
  warning: 'bg-warning/10 border-warning/20',
  info: 'bg-primary/10 border-primary/20',
};

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3 pointer-events-none w-80">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
            layout
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-sm border shadow-2xl backdrop-blur-md ${bgColors[notification.type]}`}
          >
            <div className="mt-0.5 shrink-0">
              {icons[notification.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface mb-0.5">
                {notification.type}
              </p>
              <p className="text-[13px] font-medium text-on-surface-variant leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-on-surface-variant/40 hover:text-on-surface transition-colors shrink-0"
            >
              <X size={16} />
            </button>
            {notification.duration && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-0.5 ${
                  notification.type === 'success' ? 'bg-success' :
                  notification.type === 'error' ? 'bg-error' :
                  notification.type === 'warning' ? 'bg-warning' : 'bg-primary'
                } opacity-30`}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
