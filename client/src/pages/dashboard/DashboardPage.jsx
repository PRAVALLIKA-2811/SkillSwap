import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  matchService,
  sessionService,
  messageService,
  connectionService,
} from '../../services/api';
import {
  Sparkles,
  Users,
  CalendarDays,
  MessageSquare,
  Award,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import Button from '../../components/common/Button';
import MatchCard from '../../components/cards/MatchCard';
import SessionCard from '../../components/cards/SessionCard';
import SkillTag from '../../components/common/SkillTag';
import RatingStars from '../../components/common/RatingStars';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const DashboardPage = () => {
  const { user, refreshUserData } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedMatchForSchedule, setSelectedMatchForSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    skill: '',
    role: 'learner', // whether current user is learner or teacher
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '18:00',
    duration: 60,
    notes: '',
  });
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [matchesRes, sessionsRes, convosRes] = await Promise.allSettled([
        matchService.getMatches(),
        sessionService.getMySessions(),
        messageService.getConversations(),
      ]);

      if (matchesRes.status === 'fulfilled' && matchesRes.value.data.success) {
        setMatches(matchesRes.value.data.matches || []);
      }
      if (sessionsRes.status === 'fulfilled' && sessionsRes.value.data.success) {
        setSessions(sessionsRes.value.data.sessions || []);
      }
      if (convosRes.status === 'fulfilled' && convosRes.value.data.success) {
        setConversations(convosRes.value.data.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (partnerId) => {
    try {
      const res = await connectionService.sendRequest(partnerId);
      if (res.data.success) {
        success('Connection request sent!');
        fetchDashboardData();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send request');
    }
  };

  const openScheduleModal = (match) => {
    setSelectedMatchForSchedule(match);
    // default skill to the first skill they teach or want to learn
    const defaultSkill = match.skillsToTeach?.[0]?.name || match.skillsToLearn?.[0]?.name || '';
    setScheduleForm((prev) => ({ ...prev, skill: defaultSkill }));
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMatchForSchedule || !scheduleForm.skill) {
      toastError('Please select a skill');
      return;
    }

    setSchedulingLoading(true);
    try {
      const res = await sessionService.createSession({
        partnerId: selectedMatchForSchedule._id,
        role: scheduleForm.role,
        skill: scheduleForm.skill,
        date: scheduleForm.date,
        time: scheduleForm.time,
        duration: scheduleForm.duration,
        notes: scheduleForm.notes,
      });

      if (res.data.success) {
        success('Session scheduled successfully!');
        setScheduleModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to schedule session');
    } finally {
      setSchedulingLoading(false);
    }
  };

  const upcomingSessions = sessions.filter(
    (s) => s.status === 'accepted' || s.status === 'pending'
  );

  if (loading) {
    return <LoadingSpinner message="Loading your student dashboard..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="gradient-bg rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Peer Learning Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Student'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            You are ready to exchange skills. Explore your top smart matches, collaborate with peers, and level up your engineering abilities.
          </p>
        </div>

        {/* Quick actions right */}
        <div className="flex flex-wrap gap-2.5 z-10 w-full md:w-auto">
          <Button
            variant="secondary"
            size="md"
            icon={Sparkles}
            onClick={() => navigate('/matches')}
            className="bg-white text-brand-700 hover:bg-slate-50 font-bold flex-1 md:flex-initial"
          >
            Find Partners
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={Award}
            onClick={() => navigate('/skills')}
            className="border-white text-white hover:bg-white/10 flex-1 md:flex-initial"
          >
            Manage Skills
          </Button>
        </div>
      </div>

      {/* Summary KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Skills Teaching</p>
            <h4 className="text-xl font-extrabold text-slate-900">{user?.skillsToTeach?.length || 0}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Skills Learning</p>
            <h4 className="text-xl font-extrabold text-slate-900">{user?.skillsToLearn?.length || 0}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Sessions</p>
            <h4 className="text-xl font-extrabold text-slate-900">{user?.completedSessionsCount || 0}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Student Rating</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900">{user?.rating?.toFixed(1) || '5.0'}</span>
              <RatingStars rating={user?.rating || 5} showCount={false} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Smart Matches & Sidebar widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Top Suggested Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Suggested Skill Matches</span>
              </h3>
              <p className="text-xs text-slate-500">
                Peers with high synergy between what you teach and want to learn.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/matches')}
              className="text-xs font-bold text-brand-600"
            >
              View All
            </Button>
          </div>

          {matches.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No skill matches calculated yet"
              description="Add more skills you want to learn and teach to unlock smart match recommendations."
              actionLabel="Add Skills"
              onAction={() => navigate('/skills')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matches.slice(0, 4).map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  onConnect={handleConnect}
                  onSchedule={openScheduleModal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Sessions & Recent Messages */}
        <div className="space-y-6">
          {/* Upcoming Sessions Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-600" />
                <span>Upcoming Sessions ({upcomingSessions.length})</span>
              </h3>
              <button
                onClick={() => navigate('/sessions')}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                All
              </button>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No scheduled sessions</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pick a match and schedule your first peer session!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {upcomingSessions.slice(0, 3).map((session) => {
                  const isTeacher = session.teacher?._id === user?._id;
                  const partner = isTeacher ? session.learner : session.teacher;

                  return (
                    <div
                      key={session._id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{session.skill}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded capitalize ${
                            session.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>With: {partner?.name}</span>
                        <span>
                          {session.date} @ {session.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Messages Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                <span>Recent Chats</span>
              </h3>
              <button
                onClick={() => navigate('/messages')}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Open Inbox
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No active messages</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Connect with a partner to begin exchanging messages.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 3).map((convo) => (
                  <div
                    key={convo.partner._id}
                    onClick={() => navigate(`/messages?user=${convo.partner._id}`)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                      {convo.partner.profileImage ? (
                        <img
                          src={convo.partner.profileImage}
                          alt={convo.partner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{convo.partner.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 truncate">{convo.partner.name}</p>
                        {convo.unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-brand-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{convo.lastMessage.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Skill Session"
        subtitle={`Planning session with ${selectedMatchForSchedule?.name || 'Peer'}`}
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
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                I want to TEACH
              </button>
            </div>
          </div>

          <Input
            label="Skill Topic"
            id="skill"
            name="skill"
            value={scheduleForm.skill}
            onChange={(e) => setScheduleForm({ ...scheduleForm, skill: e.target.value })}
            placeholder="e.g. React, Java OOP, Python Data Structures"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="date"
              name="date"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              id="time"
              name="time"
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
              <option value={60}>60 Minutes (Recommended)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Session Goal / Notes
            </label>
            <textarea
              rows={2}
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              placeholder="What specifically would you like to cover in this session?"
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
              Send Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
