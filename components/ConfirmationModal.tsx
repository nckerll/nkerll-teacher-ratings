import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onCancel}
    >
      <div
        className="bg-flarum-bg-primary rounded-xl p-8 shadow-2xl w-full max-w-md transform transition-all border border-flarum-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-flarum-text-primary">{title}</h2>
        <p className="text-flarum-text-secondary mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-flarum-bg-tertiary text-flarum-text-secondary hover:bg-opacity-80 transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};