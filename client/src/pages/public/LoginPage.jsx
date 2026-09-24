import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeftRight, Sparkles, AlertCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      success(`Welcome back, ${res.user.name}!`);
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.message);
      toastError(res.message);
    }
  };

  // Quick autofill demo logins
  const fillDemoAccount = (email) => {
    setFormData({ email, password: 'password123' });
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-2">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Log in to manage your skill portfolio and sessions.
          </p>
        </div>

        {/* Demo Account Quick Pickers */}
        <div className="bg-brand-50/70 border border-brand-100 p-3.5 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Demo Accounts (1-Click Fill):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('aarav@skillswap.edu')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
            >
              Aarav (Java &rarr; React)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('priya@skillswap.edu')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
            >
              Priya (React &rarr; Java)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('rohan@skillswap.edu')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
            >
              Rohan (Python &rarr; ML)
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="you@university.edu"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                isLoading={loading}
                className="w-full text-sm font-bold shadow-lg shadow-brand-500/20"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
