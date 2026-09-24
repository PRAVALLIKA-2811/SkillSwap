import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  userService,
  connectionService,
  sessionService,
} from '../../services/api';
import {
  User,
  GraduationCap,
  Sparkles,
  Calendar,
  MessageCircle,
  UserPlus,
  Clock,
  Award,
  BookOpen,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import Button from '../../components/common/Button';
import SkillTag from '../../components/common/SkillTag';
import RatingStars from '../../components/common/RatingStars';
import MatchBadge from '../../components/common/MatchBadge';
import ReviewCard from '../../components/cards/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [peer, setPeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    skill: '',
    role: 'learner',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '18:00',
    duration: 60,
    notes: '',
  });
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await userService.getUserById(id);
      if (res.data.success) {
        setPeer(res.data.user);
        setReviews(res.data.reviews || []);
        setMatchInfo(res.data.matchInfo || null);
        if (res.data.user?.skillsToTeach?.[0]) {
          setScheduleForm((prev) => ({
            ...prev,
            skill: res.data.user.skillsToTeach[0].name,
          }));
        }
      }
    } catch (err) {
      toastError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await connectionService.sendRequest(id);
      if (res.data.success) {
        success('Connection request sent!');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send connection request');
    } finally {
      setConnecting(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.skill) {
      toastError('Please select a skill for the session');
      return;
    }

    setSchedulingLoading(true);
    try {
      const res = await sessionService.createSession({
        partnerId: id,
        role: scheduleForm.role,
        skill: scheduleForm.skill,
        date: scheduleForm.date,
        time: scheduleForm.time,
        duration: scheduleForm.duration,
        notes: scheduleForm.notes,
      });

      if (res.data.success) {
        success('Session request sent to peer!');
        setScheduleModalOpen(false);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to request session');
    } finally {
      setSchedulingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading student profile..." size="lg" />;
  }

  if (!peer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800">Student not found</h3>
        <Button variant="secondary" size="md" onClick={() => navigate('/matches')} className="mt-4">
          Back to Matches
        </Button>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === peer._id;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-brand-100 text-brand-700 font-black text-2xl flex items-center justify-center overflow-hidden flex-shrink-0 ring-4 ring-brand-50 shadow-md">
              {peer.profileImage ? (
                <img
                  src={peer.profileImage}
                  alt={peer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{peer.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{peer.name}</h1>
                {matchInfo && (
                  <MatchBadge
                    percentage={matchInfo.matchPercentage}
                    isMutual={matchInfo.isMutual}
                    size="sm"
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                <span>{peer.college || 'University Peer'}</span>
              </div>
              <div className="pt-1">
                <RatingStars
                  rating={peer.rating || 5}
                  count={peer.reviewCount || 0}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                icon={UserPlus}
                isLoading={connecting}
                onClick={handleConnect}
                className="flex-1 sm:flex-initial text-xs"
              >
                Connect
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={MessageCircle}
                onClick={() => navigate(`/messages?user=${peer._id}`)}
                className="flex-1 sm:flex-initial text-xs"
              >
                Send Message
              </Button>
              <Button
                variant="gradient"
                size="md"
                icon={Calendar}
                onClick={() => setScheduleModalOpen(true)}
                className="w-full sm:w-auto text-xs"
              >
                Schedule Session
              </Button>
            </div>
          )}
        </div>

        {/* Bio & Availability */}
        <div className="py-6 border-b border-slate-100 space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About Peer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {peer.bio || 'Excited to exchange knowledge and collaborate with peers on SkillSwap!'}
            </p>
          </div>

          {peer.availableTimings && peer.availableTimings.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Available Session Timings</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {peer.availableTimings.map((time, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills Details */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Can Teach */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Skills They Can Teach</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {peer.skillsToTeach && peer.skillsToTeach.length > 0 ? (
                peer.skillsToTeach.map((skill, idx) => (
                  <SkillTag
                    key={idx}
                    name={skill.name}
                    level={skill.level}
                    type="teach"
                  />
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No teaching skills listed</p>
              )}
            </div>
          </div>

          {/* Wants to Learn */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Skills They Want to Learn</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {peer.skillsToLearn && peer.skillsToLearn.length > 0 ? (
                peer.skillsToLearn.map((skill, idx) => (
                  <SkillTag
                    key={idx}
                    name={skill.name}
                    level={skill.level}
                    type="learn"
                  />
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No learning skills listed</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Peer Reviews & Ratings ({reviews.length})</span>
          </h3>
          <RatingStars rating={peer.rating || 5} showCount={false} size="sm" />
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center italic">
            No reviews submitted yet for this student. Complete a session with them to leave the first review!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {reviews.map((rev) => (
              <ReviewCard key={rev._id} review={rev} />
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Session"
        subtitle={`Planning session with ${peer.name}`}
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Exchange Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScheduleForm({ ...scheduleForm, role: 'learner' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  scheduleForm.role === 'learner'
                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-100'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                I want to LEARN
              </button>
              <button
                type="button"
                onClick={() => setScheduleForm({ ...scheduleForm, role: 'teacher' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  scheduleForm.role === 'teacher'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-100'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                I want to TEACH
              </button>
            </div>
          </div>

          <Input
            label="Skill Topic"
            id="skillTopic"
            value={scheduleForm.skill}
            onChange={(e) => setScheduleForm({ ...scheduleForm, skill: e.target.value })}
            placeholder="e.g. React, Java, Machine Learning"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="sessionDate"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              id="sessionTime"
              type="time"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Duration
            </label>
            <select
              value={scheduleForm.duration}
              onChange={(e) => setScheduleForm({ ...scheduleForm, duration: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-brand-500"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Session Objective
            </label>
            <textarea
              rows={2}
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              placeholder="Add any specific goals or topics to review..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setScheduleModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={schedulingLoading}
              className="flex-1"
            >
              Confirm Schedule Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
