import React from 'react';
import { X, Award, Zap, Sparkles } from 'lucide-react';

const SkillTag = ({
  name,
  level = 'Intermediate',
  type = 'teach', // 'teach' or 'learn'
  onDelete,
  size = 'md',
  className = '',
}) => {
  const isTeach = type === 'teach';

  const levelStyles = {
    Beginner: isTeach
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-sky-50 text-sky-700 border-sky-200',
    Intermediate: isTeach
      ? 'bg-brand-50 text-brand-700 border-brand-200'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Advanced: isTeach
      ? 'bg-purple-50 text-purple-700 border-purple-200'
      : 'bg-violet-50 text-violet-700 border-violet-200',
  };

  const levelIcons = {
    Beginner: <Sparkles className="w-3 h-3 text-current opacity-70" />,
    Intermediate: <Zap className="w-3 h-3 text-current opacity-80" />,
    Advanced: <Award className="w-3 h-3 text-current opacity-90" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-lg transition-all duration-150 ${
        levelStyles[level] || levelStyles.Intermediate
      } ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${className}`}
    >
      {levelIcons[level]}
      <span>{name}</span>
      {level && (
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white/60 border border-current/20">
          {level}
        </span>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1 -mr-0.5 text-current opacity-60 hover:opacity-100 hover:bg-black/10 rounded p-0.5 transition-colors"
          title={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default SkillTag;
