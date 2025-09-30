import React, { useState } from 'react';

export interface AppSettings {
  title: string;
  criteria: string[];
}

interface SettingsProps {
  currentSettings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentSettings, onSave, onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, title: e.target.value }));
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...settings.criteria];
    newCriteria[index] = value;
    setSettings(prev => ({ ...prev, criteria: newCriteria }));
  };

  const handleAddCriterion = () => {
    setSettings(prev => ({ ...prev, criteria: [...prev.criteria, ''] }));
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = settings.criteria.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, criteria: newCriteria }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty criteria before saving
    const finalSettings = {
        ...settings,
        criteria: settings.criteria.filter(c => c.trim() !== '')
    };
    onSave(finalSettings);
  };

  return (
    <div className="p-4 md:p-8">
       <button onClick={onBack} className="mb-6 bg-flarum-bg-primary border border-flarum-border hover:bg-flarum-bg-tertiary text-flarum-text-secondary font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Geri Dön
        </button>

      <div className="bg-flarum-bg-primary border border-flarum-border p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-flarum-text-primary mb-6">Eklenti Ayarları</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-flarum-text-secondary mb-2">Eklenti Başlığı</label>
            <input
              id="title"
              type="text"
              value={settings.title}
              onChange={handleTitleChange}
              className="w-full bg-flarum-bg-secondary text-flarum-text-primary p-3 rounded-md border border-flarum-border focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-flarum-text-secondary mb-2">Puanlama Kıstasları</h3>
            <div className="space-y-3">
                {settings.criteria.map((criterion, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <input
                        type="text"
                        value={criterion}
                        onChange={(e) => handleCriteriaChange(index, e.target.value)}
                        placeholder="Kıstas Adı (örn: Materyal Kalitesi)"
                        className="flex-grow bg-flarum-bg-secondary text-flarum-text-primary p-3 rounded-md border border-flarum-border focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                        />
                        <button type="button" onClick={() => handleRemoveCriterion(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
             <button
              type="button"
              onClick={handleAddCriterion}
              className="mt-4 bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center shadow-sm border border-green-200"
            >
              <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Yeni Kıstas Ekle
            </button>
          </div>

          <div className="pt-6 border-t border-flarum-border flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Ayarları Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
