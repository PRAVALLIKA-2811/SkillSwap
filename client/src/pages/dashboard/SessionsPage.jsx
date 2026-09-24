import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  sessionService,
  reviewService,
  connectionService,
} from '../../services/api';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Star,
  Users,
} from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import RatingStars from '../../components/common/RatingStars';

const SessionsPage = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [sessions, setSessions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'pending', 'completed', 'cancelled', 'all'

  // Schedule Session Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    partnerId: '',
    role: 'learner',
    skill: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '18:00',
    duration: 60,
    notes: '',
  });
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchSessionsAndConnections();
  }, []);

  const fetchSessionsAndConnections = async () => {
    setLoading(true);
    try {
      const [sessRes, connRes] = await Promise.allSettled([
        sessionService.getMySessions(),
        connectionService.getConnections(),
      ]);

      if (sessRes.status === 'fulfilled' && sessRes.value.data.success) {
        setSessions(sessRes.value.data.sessions || []);
      }
      if (connRes.status === 'fulfilled' && connRes.value.data.success) {
        setConnections(connRes.value.data.connections || []);
      }
    } catch (err) {
      console.error('Failed to load session data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSession = async (id) => {
    try {
      const res = await sessionService.acceptSession(id);
      if (res.data.success) {
        success('Session accepted!');
        fetchSessionsAndConnections();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to accept session');
    }
  };

  const handleCancelSession = async (id) => {
    try {
      const res = await sessionService.cancelSession(id);
      if (res.data.success) {
        success('Session cancelled');
        fetchSessionsAndConnections();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to cancel session');
    }
  };

  const handleCompleteSession = async (id) => {
    try {
      const res = await sessionService.completeSession(id);
      if (res.data.success) {
        success('Session marked completed! You can now write a review.');
        fetchSessionsAndConnections();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to complete session');
    }
  };

  const handleOpenReviewModal = (session) => {
    setSelectedSessionForReview(session);
    setReviewForm({ rating: 5, comment: '' });
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toastError('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewService.createReview({
        sessionId: selectedSessionForReview._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      if (res.data.success) {
        success('Review submitted successfully!');
        setReviewModalOpen(false);
        fetchSessionsAndConnections();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.partnerId) {
      toastError('Please select a connection partner');
      return;
    }
    if (!scheduleForm.skill.trim()) {
      toastError('Please enter the skill for this session');
      return;
    }

    setSubmittingSchedule(true);
    try {
      const res = await sessionService.createSession(scheduleForm);
      if (res.data.success) {
        success('Session requested successfully!');
        setScheduleModalOpen(false);
        fetchSessionsAndConnections();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to schedule session');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  // Filter sessions based on tab
  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'upcoming') return s.status === 'accepted';
    if (activeTab === 'pending') return s.status === 'pending';
    if (activeTab === 'completed') return s.status === 'completed';
    if (activeTab === 'cancelled') return s.status === 'cancelled';
    return true; // 'all'
  });

  const counts = {
    upcoming: sessions.filter((s) => s.status === 'accepted').length,
    pending: sessions.filter((s) => s.status === 'pending').length,
    completed: sessions.filter((s) => s.status === 'completed').length,
    cancelled: sessions.filter((s) => s.status === 'cancelled').length,
    all: sessions.length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-brand-600" />
            <span>Scheduled Sessions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize, accept, attend, and review your 1-on-1 peer learning meetups.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          icon={Plus}
          onClick={() => {
            if (connections.length > 0 && !scheduleForm.partnerId) {
              setScheduleForm((prev) => ({
                ...prev,
                partnerId: connections[0].partner._id,
              }));
            }
            setScheduleModalOpen(true);
          }}
          className="shadow-md shadow-brand-500/20 text-xs font-bold"
        >
          Schedule New Session
        </Button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
          { key: 'pending', label: 'Pending Approval', count: counts.pending },
          { key: 'completed', label: 'Completed', count: counts.completed },
          { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          { key: 'all', label: 'All Sessions', count: counts.all },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'border-brand-600 text-brand-700 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching your sessions..." size="lg" />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={`No ${activeTab} sessions found`}
          description={
            activeTab === 'upcoming'
              ? 'You do not have any confirmed upcoming sessions at the moment.'
              : activeTab === 'pending'
              ? 'No pending session invitations waiting for confirmation.'
              : 'No session records in this category.'
          }
          actionLabel="Schedule a Session"
          onAction={() => setScheduleModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              currentUserId={user?._id}
              onAccept={handleAcceptSession}
              onCancel={handleCancelSession}
              onComplete={handleCompleteSession}
              onLeaveReview={handleOpenReviewModal}
            />
          ))}
        </div>
      )}

      {/* Schedule Session Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule a Peer Learning Session"
        subtitle="Choose a connected peer and pick a suitable timing"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Select Connected Partner
            </label>
            {connections.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                You have not connected with any peers yet. You can find matches and connect first, or schedule directly from the &quot;Find Matches&quot; page!
              </p>
            ) : (
              <select
                value={scheduleForm.partnerId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, partnerId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-brand-500"
                required
              >
                <option value="">-- Choose Peer --</option>
                {connections.map((c) => (
                  <option key={c.partner._id} value={c.partner._id}>
                    {c.partner.name} ({c.partner.college})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Your Role in this Session
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
                I am Learning (They Teach)
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
                I am Teaching (They Learn)
              </button>
            </div>
          </div>

          <Input
            label="Skill Topic"
            id="newSessionSkill"
            value={scheduleForm.skill}
            onChange={(e) => setScheduleForm({ ...scheduleForm, skill: e.target.value })}
            placeholder="e.g. React Hooks, Java OOP, Python Data Structures"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="newSessionDate"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              id="newSessionTime"
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
              <option value={60}>60 Minutes (Standard)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Session Objective / Notes
            </label>
            <textarea
              rows={2}
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              placeholder="What specifically would you like to focus on?"
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
              isLoading={submittingSchedule}
              className="flex-1"
            >
              Send Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review & Rating Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Leave a Verified Review"
        subtitle={`How was your session on ${selectedSessionForReview?.skill}?`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="text-center py-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex justify-center">
              <RatingStars
                rating={reviewForm.rating}
                interactive={true}
                onChange={(newRating) => setReviewForm({ ...reviewForm, rating: newRating })}
                size="lg"
                showCount={false}
              />
            </div>
            <p className="text-xs text-slate-400">
              {reviewForm.rating === 5
                ? '⭐ Outstanding Mentor!'
                : reviewForm.rating === 4
                ? '⭐ Very Helpful'
                : reviewForm.rating === 3
                ? '⭐ Average Session'
                : '⭐ Needs Improvement'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Review Comment
            </label>
            <textarea
              rows={4}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Write genuine feedback about their explanations, pacing, and helpfulness..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setReviewModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="md"
              isLoading={submittingReview}
              className="flex-1"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SessionsPage;
