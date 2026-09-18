import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Printer,
  Sparkles,
  Quote,
  CheckCircle2,
  Edit2,
  Trash2,
  User,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaseStudyRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const CaseStudiesModule: React.FC = () => {
  const { caseStudies, clients, outcomes, settings, addCaseStudy, updateCaseStudy, deleteCaseStudy, anonymizeView } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudyRecord | null>(null);

  const [formData, setFormData] = useState<{
    clientRef: string;
    title: string;
    theme: string;
    consentObtained: boolean;
    contextChallenge: string;
    interventionSupport: string;
    outcomesTransformation: string;
    clientQuotes: string;
    caseworkerReflection: string;
    author: string;
  }>({
    clientRef: clients[0]?.clientRef || 'HC/1',
    title: '',
    theme: 'Intersection of Racial & Homophobic Harassment',
    consentObtained: true,
    contextChallenge: '',
    interventionSupport: '',
    outcomesTransformation: '',
    clientQuotes: '',
    caseworkerReflection: '',
    author: settings.caseworkers[0] || 'Paula Howell'
  });

  const handleSelectClient = (cRef: string) => {
    const client = clients.find(c => c.clientRef === cRef);
    const clientOutcomes = outcomes.filter(o => o.clientRef === cRef);
    const latestOutcome = clientOutcomes[clientOutcomes.length - 1];

    setFormData(prev => ({
      ...prev,
      clientRef: cRef,
      author: client?.caseworker || prev.author,
      theme: client ? `${client.hateCrimeTypes.join(' & ')} Harassment in ${client.borough}` : prev.theme,
      contextChallenge: client?.presentingIssue || prev.contextChallenge,
      interventionSupport: client?.notes || prev.interventionSupport,
      outcomesTransformation: latestOutcome?.notes || prev.outcomesTransformation
    }));
  };

  const handleOpenNew = () => {
    setEditingStudy(null);
    const initialRef = clients[0]?.clientRef || 'HC/1';
    setFormData({
      clientRef: initialRef,
      title: 'Restoring Dignity and Safety: Beneficiary Journey',
      theme: 'Racial Harassment & Community Legal Injunction',
      consentObtained: true,
      contextChallenge: '',
      interventionSupport: '',
      outcomesTransformation: '',
      clientQuotes: '',
      caseworkerReflection: '',
      author: settings.caseworkers[0] || 'Paula Howell'
    });
    handleSelectClient(initialRef);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (study: CaseStudyRecord) => {
    setEditingStudy(study);
    setFormData({
      clientRef: study.clientRef,
      title: study.title,
      theme: study.theme,
      consentObtained: study.consentObtained,
      contextChallenge: study.contextChallenge,
      interventionSupport: study.interventionSupport,
      outcomesTransformation: study.outcomesTransformation,
      clientQuotes: study.clientQuotes,
      caseworkerReflection: study.caseworkerReflection,
      author: study.author
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudy) {
      updateCaseStudy(editingStudy.id, formData);
    } else {
      addCaseStudy({
        ...formData,
        dateCreated: new Date().toISOString().slice(0, 10)
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Qualitative Case Study Generator</h2>
            <Badge variant="purple" size="sm">{caseStudies.length} Stories Published</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auto-populates client demographics and outcome transition data into formatted impact narratives for annual reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <Printer className="w-4 h-4 text-brand-400" />
            Print All Studies
          </button>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <Plus className="w-4 h-4" />
            + New Case Study
          </button>
        </div>
      </div>

      {/* Case Study Cards Grid */}
      <div className="space-y-8">
        {caseStudies.map((study, idx) => {
          const client = clients.find(c => c.clientRef === study.clientRef);
          const clientOutcomes = outcomes.filter(o => o.clientRef === study.clientRef);
          const initialOutcome = clientOutcomes[0];
          const latestOutcome = clientOutcomes[clientOutcomes.length - 1];

          return (
            <div
              key={study.id}
              className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/80 shadow-2xl print:bg-white print:text-slate-900 print:border-slate-300 print:p-6 print-break-inside-avoid"
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5 print:border-slate-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-400 px-2 py-0.5 rounded bg-brand-500/15 print:text-blue-700">
                      CASE STUDY #{idx + 1} • {study.clientRef}
                    </span>
                    <Badge variant="success" size="sm">
                      <ShieldCheck className="w-3 h-3" />
                      GDPR Consent Verified
                    </Badge>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight print:text-slate-900">
                    {study.title}
                  </h3>
                  <div className="text-xs text-slate-400 print:text-slate-600">
                    Theme: <strong className="text-slate-200 print:text-slate-800">{study.theme}</strong> • Author: {study.author}
                  </div>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => handleOpenEdit(study)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete case study "${study.title}"?`)) {
                        deleteCaseStudy(study.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Auto-populated Client Profile Strip */}
              {client && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs print:bg-slate-50 print:border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Beneficiary (Anonymised)</span>
                    <strong className="text-white print:text-slate-900">
                      {anonymizeView ? client.initials : `${client.fullName} (${client.initials})`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Demographics</span>
                    <strong className="text-white print:text-slate-900">
                      {client.genderIdentity} • {client.ageGroup} • {client.borough}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Referral Source</span>
                    <strong className="text-brand-300 print:text-blue-700">{client.referralSource}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Knowledge Score Shift</span>
                    <strong className="text-emerald-400 font-mono font-bold print:text-emerald-700">
                      {initialOutcome?.knowledgeScorePre || 2}/10 → {latestOutcome?.knowledgeScorePost || 9}/10
                    </strong>
                  </div>
                </div>
              )}

              {/* Structured Narrative Content */}
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed print:text-slate-800">
                <div className="space-y-1">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-brand-400 print:text-blue-700">
                    1. Context & Baseline Challenge
                  </h4>
                  <p>{study.contextChallenge}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-brand-400 print:text-blue-700">
                    2. WLEC Intervention & Casework Support Provided
                  </h4>
                  <p>{study.interventionSupport}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-brand-400 print:text-blue-700">
                    3. Outcomes Achieved & Life Transformation
                  </h4>
                  <p>{study.outcomesTransformation}</p>
                </div>

                {/* Direct Quote Box */}
                {study.clientQuotes && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/40 to-slate-900/60 border border-brand-500/30 text-slate-200 italic space-y-1 print:bg-slate-100 print:border-slate-300 print:text-slate-900">
                    <div className="flex items-center gap-1.5 text-brand-400 font-bold not-italic text-[11px] print:text-blue-700">
                      <Quote className="w-3.5 h-3.5" />
                      Client's Direct Voice:
                    </div>
                    <p className="text-sm font-medium">{study.clientQuotes}</p>
                  </div>
                )}

                {/* Caseworker Reflection */}
                {study.caseworkerReflection && (
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] space-y-1 print:bg-slate-50 print:border-slate-200">
                    <span className="font-semibold text-slate-400 block print:text-slate-700">
                      Caseworker Reflection ({study.author}):
                    </span>
                    <p className="text-slate-300 italic print:text-slate-800">{study.caseworkerReflection}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudy ? 'Edit Case Study' : 'Author New Beneficiary Case Study'}
        subtitle="Links live client profile with qualitative narrative."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Client</label>
              <select
                value={formData.clientRef}
                onChange={e => handleSelectClient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-brand-400 font-mono focus:border-brand-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.clientRef}>
                    {c.clientRef} - {c.fullName} ({c.borough})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Author / Caseworker</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Core Theme</label>
              <input
                type="text"
                required
                placeholder="e.g. Anti-Muslim Hatred & Housing Injunction"
                value={formData.theme}
                onChange={e => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Story Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Breaking the Cycle of Harassment in Ealing"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">1. Context & Baseline Challenge</label>
            <textarea
              rows={3}
              required
              placeholder="What was the client experiencing before engaging WLEC? Detail the nature of harassment..."
              value={formData.contextChallenge}
              onChange={e => setFormData({ ...formData, contextChallenge: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">2. WLEC Intervention & Support Provided</label>
            <textarea
              rows={3}
              required
              placeholder="What actions were taken? Legal injunctions, police advocacy, trauma support..."
              value={formData.interventionSupport}
              onChange={e => setFormData({ ...formData, interventionSupport: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">3. Outcomes Achieved & Life Transformation</label>
            <textarea
              rows={3}
              required
              placeholder="How has the client's safety and confidence changed? Which outcomes were met?"
              value={formData.outcomesTransformation}
              onChange={e => setFormData({ ...formData, outcomesTransformation: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Client's Direct Quotes (Optional)</label>
            <textarea
              rows={2}
              placeholder='"Before WLEC, I felt completely alone..."'
              value={formData.clientQuotes}
              onChange={e => setFormData({ ...formData, clientQuotes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Caseworker Reflection / Lessons Learned</label>
            <textarea
              rows={2}
              placeholder="Key takeaway from this case for future project delivery..."
              value={formData.caseworkerReflection}
              onChange={e => setFormData({ ...formData, caseworkerReflection: e.target.value })}
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
              {editingStudy ? 'Save Changes' : 'Publish Story'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
