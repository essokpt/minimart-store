import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Prop {

  label?: string;

}

export function Loading({
  label
}: Prop) {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Loading {label}...</p>
    </div>
  );
}
