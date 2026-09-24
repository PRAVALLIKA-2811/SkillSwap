import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 5,
  count = 0,
  size = 'md',
  showCount = true,
  interactive = false,
  onChange,
}) => {
  const stars = [1, 2, 3, 4, 5];
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(star)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'
              } focus:outline-none`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="text-xs font-semibold text-slate-700">{Number(rating).toFixed(1)}</span>

      {showCount && count !== undefined && (
        <span className="text-xs text-slate-400">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
