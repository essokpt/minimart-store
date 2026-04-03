import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "We couldn't load the data. This might be a temporary connection issue.", onRetry }: ErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-error/5 border border-error/10 rounded-xl"
    >
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-headline font-bold text-on-surface">Oops! Something went wrong</h3>
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="px-8 border-error/20 hover:bg-error/10 hover:text-error transition-all">
          <RotateCcw size={18} className="mr-2" />
          Retry Connection
        </Button>
      )}
    </motion.div>
  );
}
