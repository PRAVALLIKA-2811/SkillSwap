import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { matchService, connectionService, sessionService } from '../../services/api';
import {
  Search,
  Filter,
  Sparkles,
  Repeat,
  GraduationCap,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import MatchCard from '../../components/cards/MatchCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const FindMatchesPage = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('');
  const [mutualOnly, setMutualOnly] = useState(false);

  // Connecting state tracker per user id
  const [connectingMap, setConnectingMap] = useState({});

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedMatchForSchedule, setSelectedMatchForSchedule] = useState(null);
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
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await matchService.getMatches();
      if (res.data.success) {
        setMatches(res.data.matches || []);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (partnerId) => {
    setConnectingMap((prev) => ({ ...prev, [partnerId]: true }));
    try {
      const res = await connectionService.sendRequest(partnerId);
      if (res.data.success) {
        success('Connection request sent!');
        fetchMatches();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setConnectingMap((prev) => ({ ...prev, [partnerId]: false }));
    }
  };

  const openScheduleModal = (match) => {
    setSelectedMatchForSchedule(match);
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
        fetchMatches();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to schedule session');
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkillFilter('');
    setSelectedLevelFilter('');
    setSelectedCollegeFilter('');
    setMutualOnly(false);
  };

  // Filter logic
  const filteredMatches = matches.filter((item) => {
    // Search query matches name, college, or any skill
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchCollege = item.college?.toLowerCase().includes(q);
      const matchTeach = item.skillsToTeach?.some((s) => s.name.toLowerCase().includes(q));
      const matchLearn = item.skillsToLearn?.some((s) => s.name.toLowerCase().includes(q));
      if (!matchName && !matchCollege && !matchTeach && !matchLearn) return false;
    }

    // Skill filter
    if (selectedSkillFilter) {
      const sf = selectedSkillFilter.toLowerCase();
      const hasTeach = item.skillsToTeach?.some((s) => s.name.toLowerCase().includes(sf));
      const hasLearn = item.skillsToLearn?.some((s) => s.name.toLowerCase().includes(sf));
      if (!hasTeach && !hasLearn) return false;
    }

    // Level filter
    if (selectedLevelFilter) {
      const hasLevel =
        item.skillLevel === selectedLevelFilter ||
        item.skillsToTeach?.some((s) => s.level === selectedLevelFilter);
      if (!hasLevel) return false;
    }

    // College filter
    if (selectedCollegeFilter && item.college !== selectedCollegeFilter) {
      return false;
    }

    // Mutual only toggle
    if (mutualOnly && !item.isMutual) {
      return false;
    }

    return true;
  });

  // Extract unique colleges and skills for dropdown options
  const uniqueColleges = Array.from(
    new Set(matches.map((m) => m.college).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-brand-600" />
            <span>Find Your Skill Partner</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse calculated matches based on your teach & learn portfolio.
          </p>
        </div>

        {/* Mutual Filter Toggle Button */}
        <button
          onClick={() => setMutualOnly(!mutualOnly)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
            mutualOnly
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Repeat className={`w-4 h-4 ${mutualOnly ? 'animate-spin-slow' : ''}`} />
          <span>Mutual 2-Way Matches Only</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, skill, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-100"
            />
          </div>

          {/* Skill Filter */}
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="">All Skills</option>
            <option value="Java">Java</option>
            <option value="React">React</option>
            <option value="Python">Python</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Node.js">Node.js</option>
            <option value="UI/UX">UI/UX & Design</option>
            <option value="SQL">SQL & Database</option>
          </select>

          {/* Skill Level Filter */}
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="">All Skill Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* College Filter */}
          <select
            value={selectedCollegeFilter}
            onChange={(e) => setSelectedCollegeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="">All Colleges</option>
            {uniqueColleges.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter indicator */}
        {(searchQuery || selectedSkillFilter || selectedLevelFilter || selectedCollegeFilter || mutualOnly) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Showing {filteredMatches.length} matching peers</span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Matches Grid */}
      {loading ? (
        <LoadingSpinner message="Calculating smart matches..." size="lg" />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No skill matches found"
          description="Try relaxing your search terms, changing skill filters, or adding more learning interests to your profile."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              onConnect={handleConnect}
              onSchedule={openScheduleModal}
              isConnecting={connectingMap[match._id]}
            />
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Skill Exchange"
        subtitle={`Arranging 1-on-1 session with ${selectedMatchForSchedule?.name || 'Partner'}`}
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Role in this session
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
            id="modalSkill"
            value={scheduleForm.skill}
            onChange={(e) => setScheduleForm({ ...scheduleForm, skill: e.target.value })}
            placeholder="e.g. React, Java OOP, Python Data Structures"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="modalDate"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              id="modalTime"
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
              Goals / Lesson Objective
            </label>
            <textarea
              rows={2}
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              placeholder="What specifically would you like to achieve during this session?"
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
              Confirm Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FindMatchesPage;
