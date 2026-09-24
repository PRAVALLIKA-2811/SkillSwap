import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Skill<span className="text-brand-400">Swap</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier peer skill exchange ecosystem for students and lifelong learners. Teach what you know, master what you love.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-white transition-colors">
                  Smart Matching
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Top Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Java', 'Python', 'Machine Learning', 'UI/UX', 'Node.js', 'SQL'].map(
                (skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Student Trust
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              100% free peer-to-peer exchanges verified by student ratings and reviews.
            </p>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero tuition, pure peer mastery</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} SkillSwap Platform. Built for student innovation.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for peer learning
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
