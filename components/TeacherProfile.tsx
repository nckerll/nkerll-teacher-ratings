import React from 'react';
import { Teacher, Rating, User } from '../types';
import { StarRating } from './StarRating';
import { RatingForm } from './RatingForm';

interface TeacherProfileProps {
  teacher: Teacher;
  currentUser: User | null;
  onRateTeacher: (teacherId: string, rating: Omit<Rating, 'id' | 'userId' | 'username'>) => void;
  onBack: () => void;
  isAdmin: boolean;
  onDeleteTeacher: (teacherId: string) => void;
  onDeleteRating: (teacherId: string, ratingId: string) => void;
  criteriaLabels: string[];
}

const calculateOverallAverage = (ratings: Rating[], criteriaLabels: string[]): number => {
    if (ratings.length === 0 || criteriaLabels.length === 0) return 0;

    const totalAverageSum = ratings.reduce((sum, r) => {
        const criteriaValues = criteriaLabels.map(label => r.criteria[label] || 0);
        const ratingAvg = criteriaValues.reduce((a, b) => a + b, 0) / criteriaValues.length;
        return sum + ratingAvg;
    }, 0);

    return totalAverageSum / ratings.length;
};

const calculateCriteriaAverage = (ratings: Rating[], criterion: string): number => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + (r.criteria[criterion] || 0), 0);
    const ratedCount = ratings.filter(r => r.criteria[criterion] !== undefined).length;
    return ratedCount > 0 ? total / ratedCount : 0;
};

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, currentUser, onRateTeacher, onBack, isAdmin, onDeleteTeacher, onDeleteRating, criteriaLabels }) => {
    const overallAverage = calculateOverallAverage(teacher.ratings, criteriaLabels);
    
    return (
        <div className="p-4 md:p-8">
            <button onClick={onBack} className="mb-6 bg-flarum-bg-primary border border-flarum-border hover:bg-flarum-bg-tertiary text-flarum-text-secondary font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Geri Dön
            </button>
            
            <div className="bg-flarum-bg-primary border border-flarum-border p-6 md:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-4xl font-extrabold text-flarum-text-primary mb-2 md:mb-0">{teacher.name}</h2>
                        {isAdmin && (
                            <button onClick={() => onDeleteTeacher(teacher.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete Teacher">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <StarRating rating={overallAverage} isInteractive={false} />
                        <span className="text-3xl font-bold text-brand-primary">{overallAverage.toFixed(1)}</span>
                        <span className="text-flarum-text-tertiary mt-1">({teacher.ratings.length} Puanlama)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {criteriaLabels.map((label) => (
                        <div key={label} className="bg-flarum-bg-secondary border border-flarum-border p-4 rounded-lg text-center">
                            <div className="text-flarum-text-secondary mb-2">{label}</div>
                            <div className="text-2xl font-bold text-flarum-text-primary">{calculateCriteriaAverage(teacher.ratings, label).toFixed(1)}</div>
                        </div>
                    ))}
                </div>

                <h3 className="text-2xl font-bold mt-10 mb-4 border-b border-flarum-border pb-2 text-flarum-text-primary">Tüm Puanlamalar</h3>
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                    {teacher.ratings.length > 0 ? (
                        teacher.ratings.map((rating) => (
                            <div key={rating.id} className="bg-flarum-bg-secondary border border-flarum-border p-4 rounded-lg relative group">
                                <div className="flex justify-between items-center">
                                     <p className="font-semibold text-flarum-text-primary">{rating.username}</p>
                                    {isAdmin && (
                                        <button onClick={() => onDeleteRating(teacher.id, rating.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Rating">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-1 mt-2">
                                    {criteriaLabels.map((label) => (
                                        <div key={label} className="flex justify-between items-center text-sm">
                                            <span className="text-flarum-text-secondary">{label}</span>
                                            <StarRating rating={rating.criteria[label] || 0} isInteractive={false} />
                                        </div>
                                    ))}
                                </div>
                                {rating.comment && (
                                    <p className="text-flarum-text-secondary mt-3 pt-3 border-t border-flarum-border/50 text-sm italic">
                                        "{rating.comment}"
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-flarum-text-tertiary text-center py-4">Henüz puanlama yapılmamış.</p>
                    )}
                </div>
            </div>
            
            {currentUser ? (
                 <RatingForm onSubmit={(rating) => onRateTeacher(teacher.id, rating)} criteriaLabels={criteriaLabels} />
            ) : (
                 <div className="text-center p-6 mt-8 bg-flarum-bg-secondary rounded-xl border border-flarum-border">
                    <p className="text-flarum-text-secondary">Bu öğretmeni puanlamak veya yorum yapmak için lütfen giriş yapın.</p>
                </div>
            )}
        </div>
    );
};
