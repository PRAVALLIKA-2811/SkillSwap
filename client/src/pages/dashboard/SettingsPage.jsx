import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/api';
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Shield,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Preference toggles state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    sessionReminders: true,
    showCollegePublicly: true,
    allowDirectInvites: true,
  });

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    if (passwordError) setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      const res = await authService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data.success) {
        success('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      setPasswordError(msg);
      toastError(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      success('Preference preference updated');
      return updated;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-brand-600" />
          <span>Account Settings & Security</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your credentials, notifications, and privacy options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Change Password Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Change Password</h3>
              <p className="text-[11px] text-slate-400">Update your account login password</p>
            </div>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              id="currentPassword"
              name="currentPassword"
              type={showPasswords ? 'text' : 'password'}
              placeholder="Enter current password"
              icon={Lock}
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />

            <Input
              label="New Password"
              id="newPassword"
              name="newPassword"
              type={showPasswords ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              icon={Lock}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />

            <Input
              label="Confirm New Password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              type={showPasswords ? 'text' : 'password'}
              placeholder="Re-enter new password"
              icon={Lock}
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              required
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? 'Hide passwords' : 'Show passwords'}</span>
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={passwordLoading}
                className="w-full text-xs font-bold"
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>

        {/* Notifications & Privacy Preferences */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                <p className="text-[11px] text-slate-400">Control alerts and updates</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                  <p className="text-[11px] text-slate-400">Receive alerts for new match requests</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={() => handlePreferenceToggle('emailNotifications')}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">Session Reminders</p>
                  <p className="text-[11px] text-slate-400">Get reminders 1 hour before scheduled calls</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sessionReminders}
                  onChange={() => handlePreferenceToggle('sessionReminders')}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Danger Zone */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Privacy & Session</h3>
                <p className="text-[11px] text-slate-400">Manage account session</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-bold text-slate-800">Show College Name</p>
                  <p className="text-[11px] text-slate-400">Display university on search cards</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.showCollegePublicly}
                  onChange={() => handlePreferenceToggle('showCollegePublicly')}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
              </div>

              <Button
                variant="danger"
                size="md"
                icon={LogOut}
                onClick={handleLogout}
                className="w-full text-xs font-bold"
              >
                Sign Out from SkillSwap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
