/** Modal konfirmasi hapus (Bahasa Indonesia). */

import { AlertTriangle } from "lucide-react";

import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  title = "Konfirmasi",
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-3 flex items-center gap-2 text-brand-navy">
          <AlertTriangle className="h-5 w-5 text-brand-teal" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
