import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  error
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      error={error}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="error"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center animate-pulse shadow-inner border border-error/10">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-headline font-bold text-on-surface">
            Are you sure?
          </h3>
          <p className="text-on-surface-variant font-medium leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
