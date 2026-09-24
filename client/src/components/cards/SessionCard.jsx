import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  UserCheck,
  Star,
  ExternalLink,
} from 'lucide-react';
import Button from '../common/Button';

const SessionCard = ({
  session,
  currentUserId,
  onAccept,
  onCancel,
  onComplete,
  onLeaveReview,
  isLoading = false,
}) => {
  const isTeacher = session.teacher?._id === currentUserId;
  const partner = isTeacher ? session.learner : session.teacher;
  const roleLabel = isTeacher ? 'Teaching' : 'Learning';

  const statusBadges = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const statusIcons = {
    pending: <Clock className="w-3.5 h-3.5" />,
    accepted: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    completed: <Award className="w-3.5 h-3.5 text-indigo-600" />,
    cancelled: <XCircle className="w-3.5 h-3.5 text-slate-400" />,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Skill & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5 ${
                isTeacher ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
              }`}
            >
              {isTeacher ? <Award className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
              <span>{roleLabel}</span>
            </span>
            <h3 className="text-base font-bold text-slate-900">{session.skill}</h3>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
              statusBadges[session.status] || statusBadges.pending
            }`}
          >
            {statusIcons[session.status]}
            <span>{session.status}</span>
          </span>
        </div>

        {/* Partner Info */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
            {partner?.profileImage ? (
              <img
                src={partner.profileImage}
                alt={partner?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{partner?.name ? partner.name.charAt(0).toUpperCase() : 'P'}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">
              {isTeacher ? `Learner: ${partner?.name}` : `Instructor: ${partner?.name}`}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{partner?.college}</p>
          </div>
        </div>

        {/* Date, Time & Duration */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{session.date}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">
              {session.time} ({session.duration} min)
            </span>
          </div>
        </div>

        {/* Notes if any */}
        {session.notes && (
          <p className="text-xs text-slate-500 italic mb-4 bg-white p-2 rounded-lg border border-slate-100">
            &ldquo;{session.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        {session.status === 'accepted' && session.meetingLink && (
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all flex-1"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Room</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        )}

        {session.status === 'pending' && onAccept && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onAccept(session._id)}
            isLoading={isLoading}
            className="flex-1 text-xs"
          >
            Accept Session
          </Button>
        )}

        {session.status === 'accepted' && onComplete && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCircle2}
            onClick={() => onComplete(session._id)}
            isLoading={isLoading}
            className="flex-1 text-xs"
          >
            Mark Done
          </Button>
        )}

        {session.status === 'completed' && !session.reviewed && onLeaveReview && (
          <Button
            variant="gradient"
            size="sm"
            icon={Star}
            onClick={() => onLeaveReview(session)}
            className="w-full text-xs"
          >
            Leave Review & Rating
          </Button>
        )}

        {session.status === 'completed' && session.reviewed && (
          <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Review submitted
          </span>
        )}

        {(session.status === 'pending' || session.status === 'accepted') && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(session._id)}
            className="text-xs font-medium text-slate-400 hover:text-rose-600 px-2 py-1 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
