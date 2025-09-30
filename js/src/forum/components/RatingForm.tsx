import React, { useState, useEffect } from 'react';
import { Rating } from '../../common/types';
import { StarRating } from './StarRating';

interface RatingFormProps {
  onSubmit: (rating: Omit<Rating, 'id' | 'userId' | 'username'>) => void;
  criteriaLabels: string[];
}

const createInitialState = (labels: string[]) => {
    return {
        criteria: labels.reduce((acc, label) => {
            acc[label] = 0;
            return acc;
        }, {} as Record<string, number>),
        comment: '',
    };
};

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit, criteriaLabels }) => {
  const [rating, setRating] = useState(createInitialState(criteriaLabels));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRating(createInitialState(criteriaLabels));
  }, [criteriaLabels]);

  const handleRatingChange = (criterion: string, value: number) => {
    setRating(prev => ({ 
        ...prev,
        criteria: {
            ...prev.criteria,
            [criterion]: value
        } 
    }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRating(prev => ({ ...prev, comment: e.target.value }));
  };

  const calculateAverage = (): number => {
    const values = Object.values(rating.criteria);
    if (values.length === 0) return 0;
    const total = values.reduce((sum, val) => sum + Number(val), 0);
    const ratedCriteriaCount = values.filter(val => Number(val) > 0).length;
    return ratedCriteriaCount > 0 ? total / ratedCriteriaCount : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(rating.criteria).some(val => Number(val) === 0)) {
      setError('Lütfen tüm kıstaslar için puanlama yapınız.');
      return;
    }
    setError(null);
    onSubmit(rating);
    setRating(createInitialState(criteriaLabels));
  };

  const average = calculateAverage();

  return (
    <div className="bg-flarum-bg-primary border border-flarum-border p-6 rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-bold mb-4 text-flarum-text-primary">Yeni Puanlama Yap</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {criteriaLabels.map((label) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-flarum-text-secondary">{label}</span>
            <StarRating
              rating={rating.criteria[label] || 0}
              onRatingChange={(value) => handleRatingChange(label, value)}
            />
          </div>
        ))}

        <div className="pt-4">
          <label htmlFor="comment" className="block text-sm font-medium text-flarum-text-secondary mb-2">Yorum (İsteğe Bağlı)</label>
          <textarea
            id="comment"
            value={rating.comment}
            onChange={handleCommentChange}
            placeholder="Ders hakkındaki düşüncelerinizi paylaşın..."
            rows={3}
            className="w-full bg-flarum-bg-secondary text-flarum-text-primary p-3 rounded-md border border-flarum-border focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-flarum-border flex justify-between items-center">
          <span className="font-semibold text-lg text-flarum-text-primary">Ortalama:</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-primary">{average.toFixed(1)}</span>
            <span className="text-flarum-text-tertiary">/ 5</span>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
          Puanla
        </button>
      </form>
    </div>
  );
};
