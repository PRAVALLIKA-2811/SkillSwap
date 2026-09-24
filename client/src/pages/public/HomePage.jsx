import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Repeat,
  ShieldCheck,
  CalendarCheck,
  MessageSquare,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import Button from '../../components/common/Button';
import MatchBadge from '../../components/common/MatchBadge';
import SkillTag from '../../components/common/SkillTag';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-300/30 to-indigo-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>The #1 Peer Skill Exchange Platform for Students</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Teach What You Know.{' '}
            <span className="gradient-text block sm:inline">Learn What You Need.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillSwap connects students to trade knowledge 1-on-1 without spending a dime.
            Our smart matching engine pairs you with peers who want to learn what you can teach.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="gradient"
              size="lg"
              icon={Sparkles}
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto text-base shadow-xl shadow-brand-500/25 px-8"
            >
              Find Your Skill Partner
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-base"
            >
              How It Works
            </Button>
          </div>

          {/* Quick interactive visual preview card */}
          <div className="mt-14 max-w-3xl mx-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* User A */}
              <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Aarav (Student)</h4>
                    <p className="text-[11px] text-slate-400">Stanford Tech</p>
                  </div>
                </div>
                <div className="text-xs space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Teaches: Java & Spring Boot</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span>Wants: React & Tailwind</span>
                  </div>
                </div>
              </div>

              {/* Match Hub Synergies */}
              <div className="flex flex-col items-center gap-1 text-center px-2">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
                  <Repeat className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-emerald-600 mt-1">98% Match</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Mutual Exchange
                </span>
              </div>

              {/* User B */}
              <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center">
                    P
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Priya (Student)</h4>
                    <p className="text-[11px] text-slate-400">MIT Engineering</p>
                  </div>
                </div>
                <div className="text-xs space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Teaches: React & Tailwind</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span>Wants: Java & Spring Boot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
            Simple 3-Step Process
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How SkillSwap Works</h3>
          <p className="text-sm text-slate-500 mt-2">
            Get started in under two minutes and unlock zero-cost peer learning sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">List Your Skills</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add the topics you excel in (e.g. Java, Python, UI/UX) and the subjects you are eager to learn next.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-extrabold text-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Get Smart Matches</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our algorithm automatically calculates match percentages, identifying complementary peers for 2-way swaps.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:border-brand-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Connect & Schedule</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Message your peer, schedule 1-on-1 virtual sessions, exchange knowledge, and leave verified ratings.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
              Engineered For Students
            </h2>
            <h3 className="text-3xl font-extrabold text-white">Platform Features</h3>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need for seamless peer-to-peer mentoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Intelligent Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic scoring formula taking into account teaching capabilities, learning goals, and proficiency levels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Session Scheduling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Propose dates, set duration, generate meeting links, and manage upcoming or completed mentoring slots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Direct Messaging</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coordinate lesson plans, share code links, and chat directly with your connected peers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Ratings & Reviews</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build trust through verified 5-star ratings and written reviews following completed sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">College Community</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with students from your own university or collaborate with engineering peers worldwide.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">100% Free & Safe</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No paywalls, subscriptions, or hidden charges. Peer education powered by genuine reciprocity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl gradient-bg text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to Upgrade Your Skills with Peers?
            </h3>
            <p className="text-sm text-brand-100 leading-relaxed">
              Join hundreds of students already teaching and learning programming, design, and AI.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="lg"
                icon={Sparkles}
                onClick={() => navigate('/register')}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 shadow-lg"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
