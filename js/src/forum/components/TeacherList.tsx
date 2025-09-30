import React from 'react';
import { Teacher, Rating } from '../../common/types';
import { StarRating } from './StarRating';

interface TeacherListProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
  onOpenAddModal: () => void;
  isAdmin: boolean;
  onDeleteTeacher: (teacherId: string) => void;
  criteriaLabels: string[];
}

const calculateOverallAverage = (ratings: Rating[], criteriaLabels: string[]): number => {
    if (ratings.length === 0 || criteriaLabels.length === 0) return 0;
    
    const totalAverageSum = ratings.reduce((sum, r) => {
        const criteriaValues = criteriaLabels.map(label => r.criteria[label] || 0);
        if (criteriaValues.length === 0) return sum;
        const ratingAvg = criteriaValues.reduce((a, b) => a + b, 0) / criteriaValues.length;
        return sum + ratingAvg;
    }, 0);

    return totalAverageSum / ratings.length;
};

export const TeacherList: React.FC<TeacherListProps> = ({ teachers, onSelectTeacher, onOpenAddModal, isAdmin, onDeleteTeacher, criteriaLabels }) => {
  const handleDeleteClick = (e: React.MouseEvent, teacherId: string) => {
    e.stopPropagation(); // Prevent card click event from firing
    onDeleteTeacher(teacherId);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-flarum-text-primary">Öğretmenler</h1>
        {isAdmin && (
            <button 
            onClick={onOpenAddModal} 
            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-md transform hover:scale-105"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Öğretmen Ekle
            </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => {
          const average = calculateOverallAverage(teacher.ratings, criteriaLabels);
          return (
            <div 
              key={teacher.id} 
              onClick={() => onSelectTeacher(teacher)}
              className="bg-flarum-bg-primary p-6 rounded-xl shadow-lg cursor-pointer border border-flarum-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative group"
            >
              {isAdmin && (
                <button 
                  onClick={(e) => handleDeleteClick(e, teacher.id)} 
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Teacher"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-bold truncate mb-2 text-flarum-text-primary pr-8">{teacher.name}</h2>
              <div className="flex items-center gap-3">
                <StarRating rating={average} isInteractive={false} />
                <span className="text-lg font-semibold text-flarum-text-tertiary">{average.toFixed(1)}</span>
              </div>
              <p className="text-sm text-flarum-text-tertiary mt-1">{teacher.ratings.length} puanlama</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
