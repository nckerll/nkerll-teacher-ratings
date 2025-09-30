import React, { useState } from 'react';
import { Teacher, Rating, User } from '../../common/types';
import { TeacherList } from './TeacherList';
import { TeacherProfile } from './TeacherProfile';
import { AddTeacherModal } from './AddTeacherModal';
import { Toast } from './Toast';
import { ConfirmationModal } from './ConfirmationModal';
import { Settings, AppSettings } from './Settings';

declare const app: any;

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    ratings: [
      { id: 'r1', userId: 'u1', username: 'AliVeli', criteria: { 'Ders Anlatımı': 5, 'Sınavlarının Zorluğu': 3, 'Kişiliği': 4 }, comment: "Ahmet Hoca dersi çok akıcı anlatıyor, sınavları ortalama zorlukta." },
      { id: 'r2', userId: 'u2', username: 'AyseFatma', criteria: { 'Ders Anlatımı': 4, 'Sınavlarının Zorluğu': 4, 'Kişiliği': 5 }, comment: "Konulara hakim ve yardımsever bir öğretmen." },
    ],
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    ratings: [
      { id: 'r3', userId: 'u1', username: 'AliVeli', criteria: { 'Ders Anlatımı': 5, 'Sınavlarının Zorluğu': 2, 'Kişiliği': 5 }, comment: "Dersi Zeynep Hoca'dan almak bir ayrıcalık. Sınavları da oldukça kolaydı." },
    ],
  },
  {
    id: '3',
    name: 'Mustafa Demir',
    ratings: [],
  },
];

type View = 'list' | 'profile' | 'settings';
type ConfirmationState = {
  title: string;
  message: string;
  onConfirm: () => void;
} | null;

interface AppProps {
  currentUser: User | null;
  isAdmin: boolean;
}

const App: React.FC<AppProps> = ({ currentUser, isAdmin }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [view, setView] = useState<View>('list');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null);
  const [settings, setSettings] = useState<AppSettings>({
    title: "Öğretmenimi Puanlıyorum",
    criteria: ['Ders Anlatımı', 'Sınavlarının Zorluğu', 'Kişiliği']
  });

  const handleSelectTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setView('profile');
  };

  const handleBackToList = () => {
    setSelectedTeacher(null);
    setView('list');
  };
  
  const handleViewChange = (newView: View) => {
    if (newView === 'list') {
        setSelectedTeacher(null);
    }
    setView(newView);
  }

  const handleAddTeacher = (name: string) => {
    const existingTeacher = teachers.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existingTeacher) {
      setToast({ message: `'${name}' zaten mevcut. Puanlama yapabilirsiniz.`, type: 'warning' });
      handleSelectTeacher(existingTeacher);
      setAddModalOpen(false);
    } else {
      const newTeacher: Teacher = {
        id: new Date().toISOString(),
        name,
        ratings: [],
      };
      setTeachers(prev => [...prev, newTeacher]);
      setAddModalOpen(false);
      setToast({ message: `'${name}' başarıyla eklendi.`, type: 'success' });
    }
  };

  const handleRateTeacher = (teacherId: string, newRatingData: Omit<Rating, 'id' | 'userId' | 'username'>) => {
    if (!currentUser) {
      setToast({ message: 'Puanlama yapmak için giriş yapmalısınız.', type: 'warning' });
      return;
    }

    const newRating: Rating = {
      ...newRatingData,
      id: new Date().toISOString(),
      userId: currentUser.id,
      username: currentUser.username,
    };

    setTeachers(prevTeachers => {
      const updatedTeachers = prevTeachers.map(teacher => {
        if (teacher.id === teacherId) {
          return { ...teacher, ratings: [...teacher.ratings, newRating] };
        }
        return teacher;
      });
      
      const updatedSelectedTeacher = updatedTeachers.find(t => t.id === teacherId) || null;
      setSelectedTeacher(updatedSelectedTeacher);

      return updatedTeachers;
    });
    setToast({ message: 'Puanlamanız için teşekkürler!', type: 'success' });
  };
  
  const handleDeleteTeacher = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    setConfirmation({
      title: "Öğretmeni Sil",
      message: `'${teacher.name}' adlı öğretmeni kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      onConfirm: () => {
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        if (selectedTeacher?.id === teacherId) {
            handleBackToList();
        }
        setToast({ message: `'${teacher.name}' silindi.`, type: 'success' });
        setConfirmation(null);
      }
    });
  };
  
  const handleDeleteRating = (teacherId: string, ratingId: string) => {
    setConfirmation({
      title: "Puanlamayı Sil",
      message: "Bu puanlamayı kalıcı olarak silmek istediğinizden emin misiniz?",
      onConfirm: () => {
        setTeachers(prev => prev.map(t => {
          if (t.id === teacherId) {
            const updatedRatings = t.ratings.filter(r => r.id !== ratingId);
            const updatedTeacher = { ...t, ratings: updatedRatings };
            if (selectedTeacher?.id === teacherId) {
              setSelectedTeacher(updatedTeacher);
            }
            return updatedTeacher;
          }
          return t;
        }));
        setToast({ message: `Puanlama silindi.`, type: 'success' });
        setConfirmation(null);
      }
    });
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setToast({ message: 'Ayarlar başarıyla kaydedildi.', type: 'success' });
    setView('list');
  };

  const renderContent = () => {
    switch(view) {
        case 'profile':
            return selectedTeacher ? (
                 <TeacherProfile 
                  teacher={selectedTeacher} 
                  currentUser={currentUser}
                  onRateTeacher={handleRateTeacher} 
                  onBack={handleBackToList}
                  isAdmin={isAdmin}
                  onDeleteTeacher={handleDeleteTeacher}
                  onDeleteRating={handleDeleteRating}
                  criteriaLabels={settings.criteria}
                />
            ) : null;
        case 'settings':
            return isAdmin ? (
                <Settings 
                    currentSettings={settings}
                    onSave={handleSaveSettings}
                    onBack={handleBackToList}
                />
            ) : null;
        case 'list':
        default:
            return (
                <TeacherList 
                  teachers={teachers} 
                  onSelectTeacher={handleSelectTeacher}
                  onOpenAddModal={() => setAddModalOpen(true)}
                  isAdmin={isAdmin}
                  onDeleteTeacher={handleDeleteTeacher}
                  criteriaLabels={settings.criteria}
                />
              );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmationModal
        isOpen={!!confirmation}
        title={confirmation?.title || ''}
        message={confirmation?.message || ''}
        onConfirm={confirmation?.onConfirm || (() => {})}
        onCancel={() => setConfirmation(null)}
      />

      <div className="flex-1 w-full max-w-6xl mx-auto py-8">
        {currentUser ? (
          <div className="bg-flarum-bg-primary rounded-2xl shadow-2xl shadow-flarum-shadow-medium border border-flarum-border overflow-hidden flex min-h-[calc(85vh)]">
            <aside className="w-64 bg-flarum-bg-secondary p-6 flex-col shadow-lg hidden md:flex border-r border-flarum-border">
              <h1 className="text-2xl font-bold text-flarum-text-primary mb-10">{settings.title}</h1>
              <nav className="flex-1">
                <ul>
                  <li>
                    <button 
                      onClick={() => handleViewChange('list')} 
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 font-semibold ${
                        view === 'list' || view === 'profile' ? 'bg-brand-primary/10 text-brand-primary' : 'text-flarum-text-secondary hover:bg-flarum-bg-tertiary'
                      }`}
                    >
                      Öğretmenler
                    </button>
                  </li>
                  {isAdmin && (
                    <li className="mt-2">
                        <button 
                          onClick={() => handleViewChange('settings')} 
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 font-semibold ${
                            view === 'settings' ? 'bg-brand-primary/10 text-brand-primary' : 'text-flarum-text-secondary hover:bg-flarum-bg-tertiary'
                          }`}
                        >
                          Ayarlar
                        </button>
                    </li>
                  )}
                  <li className="mt-4 pt-4 border-t border-flarum-border">
                    <button 
                        onClick={() => app.router.push(app.route('index'))} 
                        className="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-flarum-text-secondary hover:bg-flarum-bg-tertiary flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-flarum-text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Forum Ana Sayfası
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="mt-auto">
                <div className="text-sm text-flarum-text-secondary">
                    Giriş Yapan: <span className="font-bold text-flarum-text-primary">{currentUser.username}</span>
                </div>
                <div className="text-sm text-flarum-text-secondary">
                    Rol: <span className="font-bold text-flarum-text-primary">{currentUser.role}</span>
                </div>
              </div>
            </aside>
            
            <main className="flex-1 overflow-y-auto">
              {renderContent()}
            </main>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full my-8 bg-flarum-bg-primary p-12 rounded-2xl border border-flarum-border shadow-2xl">
              <h2 className="text-3xl font-bold text-flarum-text-primary">İçeriği Görüntülemek İçin Giriş Yapın</h2>
              <p className="text-flarum-text-secondary mt-2 max-w-md">Bu eklenti sadece forum üyeleri tarafından kullanılabilir. Lütfen devam etmek için Flarum hesabınızla giriş yapın.</p>
          </div>
        )}
      </div>

      <AddTeacherModal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)}
        onAddTeacher={handleAddTeacher}
      />
    </div>
  );
};

export default App;