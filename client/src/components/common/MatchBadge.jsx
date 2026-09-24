import React from 'react';
import { Flame, CheckCircle, Repeat } from 'lucide-react';

const MatchBadge = ({ percentage = 85, isMutual = false, size = 'md' }) => {
  let colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = `${percentage}% Match`;

  if (percentage >= 90) {
    colorStyle = 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20';
  } else if (percentage >= 75) {
    colorStyle = 'bg-brand-50 text-brand-700 border border-brand-200';
  } else {
    colorStyle = 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center font-bold tracking-tight rounded-full ${colorStyle} ${
          size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-3 py-1 gap-1.5'
        }`}
      >
        <Flame className={size === 'sm' ? 'w-3 h-3 text-amber-400' : 'w-3.5 h-3.5 text-amber-300'} />
        <span>{percentage}% Match</span>
      </span>

      {isMutual && (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${
            size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
          }`}
          title="Mutual 2-Way Match: Both teach what the other wants to learn!"
        >
          <Repeat className="w-3 h-3 text-purple-600 animate-spin-slow" />
          <span>Mutual</span>
        </span>
      )}
    </div>
  );
};

export default MatchBadge;
