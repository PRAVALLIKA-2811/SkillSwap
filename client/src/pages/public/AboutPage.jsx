import React from 'react';
import { Sparkles, Users, Award, Shield, HeartHandshake, BookOpen } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          <Sparkles className="w-3.5 h-3.5" /> Our Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Democratizing Peer-to-Peer Learning
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SkillSwap is built on a simple yet revolutionary truth: every student has something valuable to teach, and something exciting to learn.
        </p>
      </div>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Reciprocal Knowledge</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike traditional tutoring that requires expensive hourly rates, SkillSwap operates purely on a mutual exchange model. You offer your mastery in one subject in exchange for guidance in another.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Learn by Teaching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Feynman Technique demonstrates that explaining a concept to someone else is the most effective way to cement your own mastery. Teaching others makes you a better engineer.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Trust & Accountability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            With verified college profiles, session tracking, and post-session peer ratings, our student community remains safe, supportive, and focused on quality mentorship.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Campus Collaboration</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connect across departments, batch years, and colleges. Break down educational silos and build lasting professional connections with fellow motivated peers.
          </p>
        </div>
      </div>

      {/* Community Values */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold">Community Principles</h3>
        <ul className="space-y-2.5 text-xs text-slate-300">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            <span>Respect each other's scheduled time and be punctual for live exchange sessions.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Foster a judgment-free environment where beginners feel encouraged to ask questions.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Provide constructive feedback and genuine peer reviews after each session.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
