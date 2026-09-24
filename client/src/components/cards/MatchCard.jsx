import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, MessageCircle, Calendar, UserPlus, Check, Clock } from 'lucide-react';
import MatchBadge from '../common/MatchBadge';
import RatingStars from '../common/RatingStars';
import SkillTag from '../common/SkillTag';
import Button from '../common/Button';

const MatchCard = ({ match, onConnect, onSchedule, isConnecting = false }) => {
  const navigate = useNavigate();

  const isConnected = match.connectionStatus === 'accepted';
  const isPending = match.connectionStatus === 'pending';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-300/80 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Avatar, Name, College, Match Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-base overflow-hidden flex-shrink-0 ring-2 ring-brand-50">
              {match.profileImage ? (
                <img
                  src={match.profileImage}
                  alt={match.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{match.name ? match.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                <span>{match.name}</span>
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[160px] sm:max-w-[200px]">{match.college}</span>
              </div>
              <div className="mt-1">
                <RatingStars
                  rating={match.rating || 5}
                  count={match.reviewCount || 0}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <MatchBadge
            percentage={match.matchPercentage || 75}
            isMutual={match.isMutual}
            size="sm"
          />
        </div>

        {/* Bio preview */}
        {match.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            &ldquo;{match.bio}&rdquo;
          </p>
        )}

        {/* Skills Breakdown */}
        <div className="space-y-3 mb-5">
          {/* Can Teach */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1">
              <span>Teaches:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {match.skillsToTeach && match.skillsToTeach.length > 0 ? (
                match.skillsToTeach.map((skill, index) => (
                  <SkillTag
                    key={index}
                    name={skill.name}
                    level={skill.level}
                    type="teach"
                    size="sm"
                  />
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No teaching skills listed</span>
              )}
            </div>
          </div>

          {/* Wants to Learn */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1.5 flex items-center gap-1">
              <span>Wants to Learn:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {match.skillsToLearn && match.skillsToLearn.length > 0 ? (
                match.skillsToLearn.map((skill, index) => (
                  <SkillTag
                    key={index}
                    name={skill.name}
                    level={skill.level}
                    type="learn"
                    size="sm"
                  />
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No learning skills listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/users/${match._id}`)}
          className="flex-1 text-xs"
        >
          View Profile
        </Button>

        {isConnected ? (
          <Button
            variant="success"
            size="sm"
            icon={MessageCircle}
            onClick={() => navigate(`/messages?user=${match._id}`)}
            className="flex-1 text-xs"
          >
            Chat
          </Button>
        ) : isPending ? (
          <Button
            variant="secondary"
            size="sm"
            icon={Clock}
            disabled
            className="flex-1 text-xs bg-amber-50 text-amber-700 border-amber-200"
          >
            Requested
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            isLoading={isConnecting}
            onClick={() => onConnect && onConnect(match._id)}
            className="flex-1 text-xs"
          >
            Connect
          </Button>
        )}

        {onSchedule && (
          <Button
            variant="outline"
            size="sm"
            icon={Calendar}
            onClick={() => onSchedule(match)}
            className="px-2.5 text-xs"
            title="Schedule Session"
          />
        )}
      </div>
    </div>
  );
};

export default MatchCard;
