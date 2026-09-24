import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/api';
import {
  User,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Save,
  Clock,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SkillTag from '../../components/common/SkillTag';
import RatingStars from '../../components/common/RatingStars';
import ReviewCard from '../../components/cards/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    bio: '',
    profileImage: '',
    availableTimings: '',
    isAvailableForSessions: true,
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.getProfile();
      if (res.data.success) {
        const u = res.data.user;
        setFormData({
          name: u.name || '',
          college: u.college || '',
          bio: u.bio || '',
          profileImage: u.profileImage || '',
          availableTimings: u.availableTimings?.join(', ') || '',
          isAvailableForSessions: u.isAvailableForSessions ?? true,
        });
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      toastError('Failed to fetch profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const timingsArray = formData.availableTimings
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        college: formData.college,
        bio: formData.bio,
        profileImage: formData.profileImage,
        availableTimings: timingsArray,
        isAvailableForSessions: formData.isAvailableForSessions,
      };

      const res = await userService.updateProfile(payload);
      if (res.data.success) {
        updateUser(res.data.user);
        success('Profile updated successfully!');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." size="lg" />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <User className="w-6 h-6 text-brand-600" />
          <span>My Profile & Preferences</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your public presence, campus details, and session availability.
        </p>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Avatar & Summary Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-brand-100 text-brand-700 font-black text-3xl flex items-center justify-center overflow-hidden ring-4 ring-brand-50 shadow-md">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold text-slate-900">{formData.name || 'Student Name'}</h3>
              <p className="text-xs text-slate-500">{formData.college || 'University'}</p>
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-4">
                <RatingStars
                  rating={user?.rating || 5}
                  count={user?.reviewCount || 0}
                  size="sm"
                />
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{user?.completedSessionsCount || 0} Completed Sessions</span>
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="College / University"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              icon={GraduationCap}
              required
            />
          </div>

          <Input
            label="Avatar Image URL (Unsplash or Photo Link)"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            helperText="Paste any direct public image URL to update your profile photo."
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Personal Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe your background, what projects you are building, and what you love learning..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>

          <Input
            label="Available Timings (Comma separated)"
            id="availableTimings"
            name="availableTimings"
            value={formData.availableTimings}
            onChange={handleChange}
            placeholder="e.g. Weekdays 6PM-8PM, Saturdays 10AM-2PM"
            icon={Clock}
          />

          {/* Session Availability Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Open for New Exchange Requests
              </h4>
              <p className="text-[11px] text-slate-500">
                Allow other peers to find you in matching results and schedule sessions.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAvailableForSessions"
                checked={formData.isAvailableForSessions}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              size="md"
              icon={Save}
              isLoading={saving}
              className="px-6 font-bold"
            >
              Save Profile Changes
            </Button>
          </div>
        </div>
      </form>

      {/* Reviews Received Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>My Peer Reviews ({reviews.length})</span>
          </h3>
          <RatingStars rating={user?.rating || 5} showCount={false} size="sm" />
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center italic">
            You have not received any reviews yet. Complete mentoring sessions to build your score!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {reviews.map((rev) => (
              <ReviewCard key={rev._id} review={rev} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;
