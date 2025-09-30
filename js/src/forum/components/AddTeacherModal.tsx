import React, { useState } from 'react';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeacher: (name: string) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onAddTeacher }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddTeacher(name.trim());
      setName('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-flarum-bg-primary rounded-xl p-8 shadow-2xl w-full max-w-md transform transition-all border border-flarum-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-flarum-text-primary">Öğretmen Ekle</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Öğretmen Adı Soyadı"
            className="w-full bg-flarum-bg-secondary text-flarum-text-primary p-3 rounded-md border border-flarum-border focus:ring-2 focus:ring-brand-primary focus:outline-none"
            autoFocus
          />
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-flarum-bg-tertiary text-flarum-text-secondary hover:bg-opacity-80 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition-colors"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
