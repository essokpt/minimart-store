import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  className?: string;
  error?: string | null;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  className = '',
  error
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto no-scrollbar">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={cn(
              "relative w-full bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col",
              maxWidth,
              className
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
              <h2 className="text-xl font-headline font-extrabold text-on-surface">
                {title}
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant/60 hover:text-on-surface"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] no-scrollbar space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="text-error mt-0.5 shrink-0" size={18} />
                  <p className="text-sm text-error font-medium leading-relaxed">
                    {error}
                  </p>
                </motion.div>
              )}
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30 flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
