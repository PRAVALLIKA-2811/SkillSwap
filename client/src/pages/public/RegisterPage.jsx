import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SkillTag from '../../components/common/SkillTag';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    bio: '',
    skillLevel: 'Intermediate',
  });

  // Skills state
  const [teachSkills, setTeachSkills] = useState([
    { name: 'JavaScript', level: 'Intermediate' },
  ]);
  const [learnSkills, setLearnSkills] = useState([
    { name: 'Python', level: 'Beginner' },
  ]);

  const [currentTeachInput, setCurrentTeachInput] = useState('');
  const [currentTeachLevel, setCurrentTeachLevel] = useState('Intermediate');

  const [currentLearnInput, setCurrentLearnInput] = useState('');
  const [currentLearnLevel, setCurrentLearnLevel] = useState('Beginner');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleAddTeachSkill = (e) => {
    e.preventDefault();
    if (!currentTeachInput.trim()) return;
    if (teachSkills.some((s) => s.name.toLowerCase() === currentTeachInput.trim().toLowerCase())) {
      return;
    }
    setTeachSkills([
      ...teachSkills,
      { name: currentTeachInput.trim(), level: currentTeachLevel },
    ]);
    setCurrentTeachInput('');
  };

  const handleRemoveTeachSkill = (name) => {
    setTeachSkills(teachSkills.filter((s) => s.name !== name));
  };

  const handleAddLearnSkill = (e) => {
    e.preventDefault();
    if (!currentLearnInput.trim()) return;
    if (learnSkills.some((s) => s.name.toLowerCase() === currentLearnInput.trim().toLowerCase())) {
      return;
    }
    setLearnSkills([
      ...learnSkills,
      { name: currentLearnInput.trim(), level: currentLearnLevel },
    ]);
    setCurrentLearnInput('');
  };

  const handleRemoveLearnSkill = (name) => {
    setLearnSkills(learnSkills.filter((s) => s.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (teachSkills.length === 0) {
      setErrorMessage('Please add at least one skill you can teach.');
      return;
    }

    if (learnSkills.length === 0) {
      setErrorMessage('Please add at least one skill you want to learn.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      college: formData.college.trim() || 'University',
      bio: formData.bio.trim() || 'Passionate student eager to exchange skills.',
      skillsToTeach: teachSkills,
      skillsToLearn: learnSkills,
      skillLevel: formData.skillLevel,
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      success('Account created successfully! Welcome to SkillSwap.');
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message);
      toastError(res.message);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 1,000+ Student Skill Exchangers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Create Your SkillSwap Profile
          </h2>
          <p className="text-xs text-slate-500">
            Fill in the details below to start matching with skill peers.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                1. Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  placeholder="e.g. Alex Morgan"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@university.edu"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="College / University"
                id="college"
                name="college"
                placeholder="e.g. Stanford University or MIT"
                icon={GraduationCap}
                value={formData.college}
                onChange={handleChange}
                required
              />

              <div className="w-full space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Profile Bio
                </label>
                <textarea
                  name="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell peers what you love building, your study focus, and what you hope to achieve..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                />
              </div>
            </div>

            {/* Skills to Teach */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b pb-1 flex items-center justify-between">
                <span>2. Skills You Can Teach</span>
                <span className="text-[10px] text-slate-400 font-normal">Min. 1 skill</span>
              </h3>

              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                {teachSkills.map((skill) => (
                  <SkillTag
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    type="teach"
                    onDelete={() => handleRemoveTeachSkill(skill.name)}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Java, React, SQL)"
                  value={currentTeachInput}
                  onChange={(e) => setCurrentTeachInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTeachSkill(e)}
                />
                <select
                  value={currentTeachLevel}
                  onChange={(e) => setCurrentTeachLevel(e.target.value)}
                  className="rounded-xl border border-slate-200 px-2 py-2 text-xs text-slate-700 bg-white outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleAddTeachSkill}
                  className="text-xs px-3"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Skills to Learn */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b pb-1 flex items-center justify-between">
                <span>3. Skills You Want to Learn</span>
                <span className="text-[10px] text-slate-400 font-normal">Min. 1 skill</span>
              </h3>

              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                {learnSkills.map((skill) => (
                  <SkillTag
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    type="learn"
                    onDelete={() => handleRemoveLearnSkill(skill.name)}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Machine Learning, Node.js)"
                  value={currentLearnInput}
                  onChange={(e) => setCurrentLearnInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-brand-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLearnSkill(e)}
                />
                <select
                  value={currentLearnLevel}
                  onChange={(e) => setCurrentLearnLevel(e.target.value)}
                  className="rounded-xl border border-slate-200 px-2 py-2 text-xs text-slate-700 bg-white outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddLearnSkill}
                  className="text-xs px-3"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                isLoading={loading}
                className="w-full text-sm font-bold shadow-lg shadow-brand-500/20"
              >
                Complete Registration &rarr;
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
