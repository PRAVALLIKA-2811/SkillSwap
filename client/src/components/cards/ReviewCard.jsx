import React from 'react';
import RatingStars from '../common/RatingStars';
import { GraduationCap } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const formattedDate = new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs overflow-hidden">
            {review.reviewer?.profileImage ? (
              <img
                src={review.reviewer.profileImage}
                alt={review.reviewer?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{review.reviewer?.name ? review.reviewer.name.charAt(0).toUpperCase() : 'R'}</span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{review.reviewer?.name || 'Fellow Student'}</h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <GraduationCap className="w-3 h-3" />
              <span>{review.reviewer?.college || 'University'}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <RatingStars rating={review.rating} showCount={false} size="sm" />
          <span className="text-[10px] text-slate-400 block mt-0.5">{formattedDate}</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed italic">
        &ldquo;{review.comment}&rdquo;
      </p>
    </div>
  );
};

export default ReviewCard;
