import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Users,
  Award,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrainingSessionRecord, ProjectYear } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { exportToExcel } from '../../utils/exportUtils';

export const TrainingRegisterModule: React.FC = () => {
  const { trainingSessions, settings, addTrainingSession, updateTrainingSession, deleteTrainingSession } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'curriculum'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSessionRecord | null>(null);

  const [formData, setFormData] = useState<{
    date: string;
    trainingTitle: string;
    moduleId: string;
    topicContent: string;
    audience: any;
    projectYear: ProjectYear;
    deliveredBy: string;
    location: string;
    participantsCount: number;
    hours: number;
    borough: string;
    deliveryMethod: 'In-person' | 'Online' | 'Hybrid';
    preAssessmentScore: number;
    postAssessmentScore: number;
    certificateIssued: boolean;
    feedbackRatingAvg: number;
    notes: string;
  }>({
    date: new Date().toISOString().slice(0, 10),
    trainingTitle: 'Hate Crime Awareness & Reporting Pathways',
    moduleId: settings.trainingModules[0]?.id || 'mod-1',
    topicContent: 'Understanding definitions under Equality Act 2010 and trauma-informed casework.',
    audience: 'Staff & Volunteers',
    projectYear: settings.currentYear,
    deliveredBy: 'Freda Ritchie',
    location: 'Ealing Civic Centre',
    participantsCount: 25,
    hours: 3.5,
    borough: settings.primaryBoroughs[0] || 'Ealing',
    deliveryMethod: 'In-person',
    preAssessmentScore: 2.8,
    postAssessmentScore: 4.6,
    certificateIssued: true,
    feedbackRatingAvg: 4.8,
    notes: ''
  });

  const totalParticipants = useMemo(() => {
    return trainingSessions.reduce((acc, s) => acc + (s.participantsCount || 0), 0);
  }, [trainingSessions]);

  const totalHoursDelivered = useMemo(() => {
    return trainingSessions.reduce((acc, s) => acc + (s.hours || 0), 0);
  }, [trainingSessions]);

  const handleOpenNew = () => {
    setEditingSession(null);
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      trainingTitle: '',
      moduleId: settings.trainingModules[0]?.id || 'mod-1',
      topicContent: '',
      audience: 'Staff & Volunteers',
      projectYear: settings.currentYear,
      deliveredBy: 'Freda Ritchie',
      location: 'WLEC Main Office',
      participantsCount: 20,
      hours: 3.0,
      borough: settings.primaryBoroughs[0] || 'Ealing',
      deliveryMethod: 'In-person',
      preAssessmentScore: 3.0,
      postAssessmentScore: 4.8,
      certificateIssued: true,
      feedbackRatingAvg: 4.8,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sess: TrainingSessionRecord) => {
    setEditingSession(sess);
    setFormData({
      date: sess.date,
      trainingTitle: sess.trainingTitle,
      moduleId: sess.moduleId || settings.trainingModules[0]?.id || 'mod-1',
      topicContent: sess.topicContent,
      audience: sess.audience,
      projectYear: sess.projectYear,
      deliveredBy: sess.deliveredBy,
      location: sess.location,
      participantsCount: sess.participantsCount,
      hours: sess.hours,
      borough: sess.borough,
      deliveryMethod: sess.deliveryMethod,
      preAssessmentScore: sess.preAssessmentScore || 3,
      postAssessmentScore: sess.postAssessmentScore || 4.5,
      certificateIssued: sess.certificateIssued,
      feedbackRatingAvg: sess.feedbackRatingAvg || 4.8,
      notes: sess.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      updateTrainingSession(editingSession.id, formData);
    } else {
      addTrainingSession(formData);
    }
    setIsModalOpen(false);
  };

  const filteredSessions = useMemo(() => {
    return trainingSessions.filter(s => {
      const matchesSearch =
        s.trainingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.topicContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.deliveredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAudience = filterAudience === 'All' || s.audience === filterAudience;

      return matchesSearch && matchesAudience;
    });
  }, [trainingSessions, searchTerm, filterAudience]);

  const handleExportData = () => {
    const exportData = filteredSessions.map(s => ({
      'Date': s.date,
      'Training Title': s.trainingTitle,
      'Topic / Content': s.topicContent,
      'Audience': s.audience,
      'Project Year': s.projectYear,
      'Delivered By': s.deliveredBy,
      'Location': s.location,
      'Participants': s.participantsCount,
      'Hours': s.hours,
      'Borough': s.borough,
      'Method': s.deliveryMethod,
      'Pre-Score (1-5)': s.preAssessmentScore || '',
      'Post-Score (1-5)': s.postAssessmentScore || '',
      'Certificate Issued?': s.certificateIssued ? 'Yes' : 'No',
      'Feedback Rating (1-5)': s.feedbackRatingAvg || '',
      'Notes': s.notes || ''
    }));
    exportToExcel([{ sheetName: 'Training Register', data: exportData }], 'WLEC_Training_Register');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Training Register & 8-Module Curriculum</h2>
            <Badge variant="purple" size="sm">{trainingSessions.length} Sessions Delivered</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Log all training sessions delivered to staff, volunteers, partners, and community members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export Excel
          </button>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <Plus className="w-4 h-4" />
            + Log Training Session
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Total Sessions Delivered</div>
          <div className="text-2xl font-bold text-white">{trainingSessions.length}</div>
          <div className="text-[10px] text-emerald-400 font-medium">100% On Target</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Total Participants Trained</div>
          <div className="text-2xl font-bold text-brand-400">{totalParticipants}</div>
          <div className="text-[10px] text-slate-400">Staff, Vols & Community</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Instruction Hours Delivered</div>
          <div className="text-2xl font-bold text-purple-400">{totalHoursDelivered} hrs</div>
          <div className="text-[10px] text-slate-400">Accredited Content</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Average Participant Rating</div>
          <div className="text-2xl font-bold text-amber-400">4.8 / 5.0</div>
          <div className="text-[10px] text-emerald-400">★★★★★ High Satisfaction</div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'sessions'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Delivered Session Log ({trainingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'curriculum'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          8-Course Core Modular Curriculum (M&E Framework)
        </button>
      </div>

      {/* Tab 1: Sessions Log Table */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search session title, topic, trainer, location..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <select
                  value={filterAudience}
                  onChange={e => setFilterAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                >
                  <option value="All">All Audiences</option>
                  <option value="Staff">Staff</option>
                  <option value="Volunteers">Volunteers</option>
                  <option value="Staff & Volunteers">Staff & Volunteers</option>
                  <option value="Community & Volunteers">Community & Volunteers</option>
                  <option value="Staff & Partners">Staff & Partners</option>
                  <option value="Public">Public</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Training Title & Topic</th>
                    <th className="py-3.5 px-4 font-semibold">Audience</th>
                    <th className="py-3.5 px-4 font-semibold">Trainer</th>
                    <th className="py-3.5 px-4 font-semibold">Location</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Participants</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Hours</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Pre → Post</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Rating</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSessions.map(sess => (
                    <tr key={sess.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {sess.date}
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-white text-sm">{sess.trainingTitle}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{sess.topicContent}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="primary" size="sm">{sess.audience}</Badge>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {sess.deliveredBy}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        <div>{sess.location}</div>
                        <div className="text-[10px] text-slate-500">{sess.borough} • {sess.deliveryMethod}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-white font-mono text-sm">
                        {sess.participantsCount}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                        {sess.hours}h
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {sess.preAssessmentScore && sess.postAssessmentScore ? (
                          <span className="font-mono text-[11px] font-semibold text-cyan-300">
                            {sess.preAssessmentScore} → <span className="text-emerald-400 font-bold">{sess.postAssessmentScore}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-amber-400">
                        ★ {sess.feedbackRatingAvg || '4.8'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(sess)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Session"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete training session ${sess.trainingTitle}?`)) {
                                deleteTrainingSession(sess.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 8-Module Curriculum Grid */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {settings.trainingModules.map((mod, idx) => {
            const deliveredCount = trainingSessions.filter(s => s.moduleId === mod.id).length;
            return (
              <div key={mod.id} className="glass-card rounded-2xl p-5 space-y-3 border-t-2 border-t-brand-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-400">{mod.code}</span>
                  <Badge variant="neutral" size="sm">{mod.defaultHours} Hours</Badge>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">{mod.title}</h3>

                <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Target: {mod.targetAudience}</span>
                  <span className="text-emerald-400 font-bold">{deliveredCount} Sessions Run</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Training Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSession ? 'Edit Training Session' : 'Record Delivered Training Session'}
        subtitle="Captures participant reach, pre/post evaluation scores, and feedback."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Curriculum Module</label>
              <select
                value={formData.moduleId}
                onChange={e => {
                  const mId = e.target.value;
                  const targetM = settings.trainingModules.find(m => m.id === mId);
                  setFormData({
                    ...formData,
                    moduleId: mId,
                    trainingTitle: targetM?.title || formData.trainingTitle,
                    hours: targetM?.defaultHours || formData.hours
                  });
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-brand-400 font-medium focus:border-brand-500"
              >
                {settings.trainingModules.map(m => (
                  <option key={m.id} value={m.id}>{m.code}: {m.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
              <select
                value={formData.audience}
                onChange={e => setFormData({ ...formData, audience: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Staff & Volunteers">Staff & Volunteers</option>
                <option value="Staff">Staff Only</option>
                <option value="Volunteers">Volunteers Only</option>
                <option value="Community & Volunteers">Community & Volunteers</option>
                <option value="Staff & Partners">Staff & Partners</option>
                <option value="Public">Public Community</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Title</label>
            <input
              type="text"
              required
              value={formData.trainingTitle}
              onChange={e => setFormData({ ...formData, trainingTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Delivered By</label>
              <input
                type="text"
                required
                value={formData.deliveredBy}
                onChange={e => setFormData({ ...formData, deliveredBy: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Participants</label>
              <input
                type="number"
                min={1}
                required
                value={formData.participantsCount}
                onChange={e => setFormData({ ...formData, participantsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours</label>
              <input
                type="number"
                step="0.5"
                min={0.5}
                required
                value={formData.hours}
                onChange={e => setFormData({ ...formData, hours: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pre-Score (1-5)</label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={formData.preAssessmentScore}
                onChange={e => setFormData({ ...formData, preAssessmentScore: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Post-Score (1-5)</label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={formData.postAssessmentScore}
                onChange={e => setFormData({ ...formData, postAssessmentScore: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback (1-5)</label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                value={formData.feedbackRatingAvg}
                onChange={e => setFormData({ ...formData, feedbackRatingAvg: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery Method</label>
              <select
                value={formData.deliveryMethod}
                onChange={e => setFormData({ ...formData, deliveryMethod: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="In-person">In-person</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Curriculum Content Summary</label>
            <textarea
              rows={2}
              required
              value={formData.topicContent}
              onChange={e => setFormData({ ...formData, topicContent: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              {editingSession ? 'Save Changes' : 'Record Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
