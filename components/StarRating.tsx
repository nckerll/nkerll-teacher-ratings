import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  isInteractive?: boolean;
}

const StarIcon: React.FC<{ filled: boolean; onMouseEnter?: () => void; onClick?: () => void; className?: string }> = ({ filled, onMouseEnter, onClick, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 ${filled ? 'text-brand-primary' : 'text-gray-300'} ${className}`}
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, isInteractive = true }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (isInteractive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => (
        <StarIcon
          key={index}
          filled={index <= (hoverRating || rating)}
          onMouseEnter={() => handleMouseEnter(index)}
          onClick={() => handleClick(index)}
          className={isInteractive ? 'cursor-pointer transform hover:scale-110 transition-transform duration-200' : ''}
        />
      ))}
    </div>
  );
};