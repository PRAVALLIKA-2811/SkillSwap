import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { skillService } from '../../services/api';
import {
  Award,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Zap,
  Check,
  X,
} from 'lucide-react';
import Button from '../../components/common/Button';
import SkillTag from '../../components/common/SkillTag';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const POPULAR_TEACH_SKILLS = [
  'Java',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'C++',
  'HTML/CSS',
  'UI/UX',
  'Public Speaking',
];

const POPULAR_LEARN_SKILLS = [
  'React',
  'Machine Learning',
  'Python',
  'Spring Boot',
  'Deep Learning',
  'Cloud / AWS',
  'Tailwind CSS',
  'Communication Skills',
  'Data Structures',
];

const MySkillsPage = () => {
  const { user, refreshUserData } = useAuth();
  const { success, error: toastError } = useToast();

  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('teach'); // 'teach' or 'learn'
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editIndex, setEditIndex] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 'Intermediate',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await skillService.getMySkills();
      if (res.data.success) {
        setSkillsToTeach(res.data.skillsToTeach || []);
        setSkillsToLearn(res.data.skillsToLearn || []);
      }
    } catch (err) {
      toastError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (type) => {
    setModalType(type);
    setModalMode('add');
    setSkillForm({
      name: '',
      level: type === 'teach' ? 'Intermediate' : 'Beginner',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (type, index, currentSkill) => {
    setModalType(type);
    setModalMode('edit');
    setEditIndex(index);
    setSkillForm({
      name: currentSkill.name,
      level: currentSkill.level,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      toastError('Please enter a skill name');
      return;
    }

    setSubmitting(true);
    try {
      if (modalType === 'teach') {
        let updatedList = [...skillsToTeach];
        if (modalMode === 'add') {
          if (updatedList.some((s) => s.name.toLowerCase() === skillForm.name.trim().toLowerCase())) {
            toastError('Skill already in your teaching list');
            setSubmitting(false);
            return;
          }
          updatedList.push({ name: skillForm.name.trim(), level: skillForm.level });
        } else {
          updatedList[editIndex] = { name: skillForm.name.trim(), level: skillForm.level };
        }

        const res = await skillService.updateAllSkills({
          skillsToTeach: updatedList,
          skillsToLearn,
        });

        if (res.data.success) {
          setSkillsToTeach(res.data.skillsToTeach);
          success(modalMode === 'add' ? 'Teaching skill added!' : 'Skill updated!');
          setModalOpen(false);
          refreshUserData();
        }
      } else {
        let updatedList = [...skillsToLearn];
        if (modalMode === 'add') {
          if (updatedList.some((s) => s.name.toLowerCase() === skillForm.name.trim().toLowerCase())) {
            toastError('Skill already in your learning list');
            setSubmitting(false);
            return;
          }
          updatedList.push({ name: skillForm.name.trim(), level: skillForm.level });
        } else {
          updatedList[editIndex] = { name: skillForm.name.trim(), level: skillForm.level };
        }

        const res = await skillService.updateAllSkills({
          skillsToTeach,
          skillsToLearn: updatedList,
        });

        if (res.data.success) {
          setSkillsToLearn(res.data.skillsToLearn);
          success(modalMode === 'add' ? 'Learning skill added!' : 'Skill updated!');
          setModalOpen(false);
          refreshUserData();
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeachSkill = async (skillName) => {
    try {
      const res = await skillService.removeSkillTeach(skillName);
      if (res.data.success) {
        setSkillsToTeach(res.data.skillsToTeach);
        success('Skill removed');
        refreshUserData();
      }
    } catch (err) {
      toastError('Failed to remove skill');
    }
  };

  const handleDeleteLearnSkill = async (skillName) => {
    try {
      const res = await skillService.removeSkillLearn(skillName);
      if (res.data.success) {
        setSkillsToLearn(res.data.skillsToLearn);
        success('Skill removed');
        refreshUserData();
      }
    } catch (err) {
      toastError('Failed to remove skill');
    }
  };

  const handleQuickAdd = (type, skillName) => {
    setModalType(type);
    setModalMode('add');
    setSkillForm({
      name: skillName,
      level: type === 'teach' ? 'Intermediate' : 'Beginner',
    });
    setModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your skill portfolio..." size="lg" />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-brand-600" />
            <span>My Skill Portfolio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your skill listings to ensure our smart matching engine connects you with the best exchange partners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills I Teach Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Skills I Teach</h3>
                <p className="text-[11px] text-slate-400">Knowledge you can share</p>
              </div>
            </div>

            <Button
              variant="success"
              size="sm"
              icon={Plus}
              onClick={() => handleOpenAddModal('teach')}
              className="text-xs px-3"
            >
              Add Skill
            </Button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Popular Teaching Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TEACH_SKILLS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickAdd('teach', item)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* List of current teaching skills */}
          <div className="space-y-2.5 pt-2">
            {skillsToTeach.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-600">No teaching skills listed</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Add Skill&quot; to begin matching.</p>
              </div>
            ) : (
              skillsToTeach.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{skill.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        {skill.level} Level
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('teach', index, skill)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-colors"
                      title="Edit level"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeachSkill(skill.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skills I Want to Learn Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Skills I Want to Learn</h3>
                <p className="text-[11px] text-slate-400">Goals and desired subjects</p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => handleOpenAddModal('learn')}
              className="text-xs px-3"
            >
              Add Skill
            </Button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Popular Learning Goals:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LEARN_SKILLS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickAdd('learn', item)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200/60 hover:bg-indigo-100 transition-colors"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* List of current learning skills */}
          <div className="space-y-2.5 pt-2">
            {skillsToLearn.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-600">No learning skills listed</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Add Skill&quot; to set your goals.</p>
              </div>
            ) : (
              skillsToLearn.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{skill.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                        Desired: {skill.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('learn', index, skill)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-colors"
                      title="Edit level"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLearnSkill(skill.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                      title="Delete skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalMode === 'add'
            ? `Add Skill to ${modalType === 'teach' ? 'Teach' : 'Learn'}`
            : `Edit Skill`
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            id="modalSkillName"
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            placeholder="e.g. Python, React, Deep Learning, Public Speaking"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              {modalType === 'teach' ? 'Your Proficiency Level' : 'Desired Target Level'}
            </label>
            <select
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-brand-500"
            >
              <option value="Beginner">Beginner (Foundations & Syntax)</option>
              <option value="Intermediate">Intermediate (Hands-on Projects & APIs)</option>
              <option value="Advanced">Advanced (Deep Concepts & Architecture)</option>
            </select>
          </div>

          <div className="pt-3 flex gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={modalType === 'teach' ? 'success' : 'primary'}
              size="md"
              isLoading={submitting}
              className="flex-1"
            >
              {modalMode === 'add' ? 'Add Skill' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MySkillsPage;
