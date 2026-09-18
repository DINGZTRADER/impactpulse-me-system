import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Edit2,
  Trash2,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OutcomeRecord, AssessmentStage, ProjectYear } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { exportToExcel } from '../../utils/exportUtils';

export const OutcomeTrackerModule: React.FC = () => {
  const { outcomes, clients, settings, addOutcome, updateOutcome, deleteOutcome } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<OutcomeRecord | null>(null);

  const [formData, setFormData] = useState<{
    clientRef: string;
    assessmentDate: string;
    assessmentStage: AssessmentStage;
    caseworker: string;
    o1LegalAccess: boolean;
    o2ConfidentToReport: boolean;
    o3PartnershipEngaged: boolean;
    o4AwarenessIncreased: boolean;
    o5CommunitySolution: boolean;
    satisfactionRating: number;
    knowledgeScorePre: number;
    knowledgeScorePost: number;
    reportedToPolice: boolean;
    partnerReferred: string;
    projectYear: ProjectYear;
    notes: string;
  }>({
    clientRef: clients[0]?.clientRef || 'HC/1',
    assessmentDate: new Date().toISOString().slice(0, 10),
    assessmentStage: '3 Months',
    caseworker: settings.caseworkers[0] || 'Paula Howell',
    o1LegalAccess: true,
    o2ConfidentToReport: true,
    o3PartnershipEngaged: true,
    o4AwarenessIncreased: true,
    o5CommunitySolution: false,
    satisfactionRating: 5,
    knowledgeScorePre: 3,
    knowledgeScorePost: 8,
    reportedToPolice: true,
    partnerReferred: '',
    projectYear: settings.currentYear,
    notes: ''
  });

  const handleOpenNew = (defaultRef?: string) => {
    setEditingOutcome(null);
    setFormData({
      clientRef: defaultRef || clients[0]?.clientRef || 'HC/1',
      assessmentDate: new Date().toISOString().slice(0, 10),
      assessmentStage: '3 Months',
      caseworker: settings.caseworkers[0] || 'Paula Howell',
      o1LegalAccess: true,
      o2ConfidentToReport: true,
      o3PartnershipEngaged: true,
      o4AwarenessIncreased: true,
      o5CommunitySolution: false,
      satisfactionRating: 5,
      knowledgeScorePre: 3,
      knowledgeScorePost: 8,
      reportedToPolice: true,
      partnerReferred: '',
      projectYear: settings.currentYear,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: OutcomeRecord) => {
    setEditingOutcome(record);
    setFormData({
      clientRef: record.clientRef,
      assessmentDate: record.assessmentDate,
      assessmentStage: record.assessmentStage,
      caseworker: record.caseworker,
      o1LegalAccess: record.o1LegalAccess,
      o2ConfidentToReport: record.o2ConfidentToReport,
      o3PartnershipEngaged: record.o3PartnershipEngaged,
      o4AwarenessIncreased: record.o4AwarenessIncreased,
      o5CommunitySolution: record.o5CommunitySolution,
      satisfactionRating: record.satisfactionRating || 5,
      knowledgeScorePre: record.knowledgeScorePre || 3,
      knowledgeScorePost: record.knowledgeScorePost || 8,
      reportedToPolice: record.reportedToPolice,
      partnerReferred: record.partnerReferred || '',
      projectYear: record.projectYear,
      notes: record.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOutcome) {
      updateOutcome(editingOutcome.id, formData);
    } else {
      addOutcome(formData);
    }
    setIsModalOpen(false);
  };

  const filteredOutcomes = useMemo(() => {
    return outcomes.filter(o => {
      const matchesSearch =
        o.clientRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.caseworker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.partnerReferred?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = filterStage === 'All' || o.assessmentStage === filterStage;
      const matchesYear = filterYear === 'All' || o.projectYear === filterYear;

      return matchesSearch && matchesStage && matchesYear;
    });
  }, [outcomes, searchTerm, filterStage, filterYear]);

  const handleExportData = () => {
    const exportData = filteredOutcomes.map(o => ({
      'Client Ref': o.clientRef,
      'Assessment Date': o.assessmentDate,
      'Assessment Stage': o.assessmentStage,
      'Caseworker': o.caseworker,
      'O1: Legal Support': o.o1LegalAccess ? 'Yes' : 'No',
      'O2: Confident to Report': o.o2ConfidentToReport ? 'Yes' : 'No',
      'O3: Partnership Engaged': o.o3PartnershipEngaged ? 'Yes' : 'No',
      'O4: Increased Awareness': o.o4AwarenessIncreased ? 'Yes' : 'No',
      'O5: Community Solution': o.o5CommunitySolution ? 'Yes' : 'No',
      'Project Year': o.projectYear,
      'Satisfaction (1-5)': o.satisfactionRating || '',
      'Pre-Score (1-10)': o.knowledgeScorePre || '',
      'Post-Score (1-10)': o.knowledgeScorePost || '',
      'Reported to Police?': o.reportedToPolice ? 'Yes' : 'No',
      'Partner Referred': o.partnerReferred || '',
      'Notes': o.notes || ''
    }));
    exportToExcel([{ sheetName: 'Outcome Tracker', data: exportData }], 'WLEC_Outcome_Tracker_Register');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">5-Outcome Tracker (M&E Framework)</h2>
            <Badge variant="success" size="sm">{outcomes.length} Assessment Checkpoints</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracks beneficiary progress across all five core outcomes at Intake, 3 Months, 6 Months, Closure, and Funder Review.
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
            onClick={() => handleOpenNew()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow-emerald transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Outcome Assessment
          </button>
        </div>
      </div>

      {/* Outcome Cards Indicator Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {settings.outcomes.map(out => {
          const positiveCount = outcomes.filter(o => {
            if (out.code === 'O1') return o.o1LegalAccess;
            if (out.code === 'O2') return o.o2ConfidentToReport;
            if (out.code === 'O3') return o.o3PartnershipEngaged;
            if (out.code === 'O4') return o.o4AwarenessIncreased;
            return o.o5CommunitySolution;
          }).length;

          return (
            <div key={out.id} className="glass-card rounded-xl p-3.5 space-y-1.5 border-l-4 border-l-brand-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-brand-400">{out.code}</span>
                <span className="text-[10px] text-slate-400">{out.category}</span>
              </div>
              <div className="text-xs font-semibold text-white line-clamp-1" title={out.title}>
                {out.title}
              </div>
              <div className="flex items-baseline justify-between text-[11px] pt-1">
                <span className="text-emerald-400 font-bold">{positiveCount} Achieved</span>
                <span className="text-slate-400 text-[10px]">Target: {out.targetPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client ref, caseworker, partner..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <select
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Assessment Stages</option>
              <option value="Intake">Intake (Baseline)</option>
              <option value="3 Months">3 Months (Mid-Review)</option>
              <option value="6 Months">6 Months (Progress)</option>
              <option value="Closure">Closure (Exit)</option>
              <option value="Funder Review">Funder Review</option>
            </select>
          </div>

          <div>
            <select
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Project Years</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
              <option value="Year 5">Year 5</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outcome Assessments Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Client Ref</th>
                <th className="py-3.5 px-4 font-semibold">Stage & Date</th>
                <th className="py-3.5 px-4 font-semibold">Caseworker</th>
                <th className="py-3.5 px-4 text-center font-semibold" title="O1: Better Access to Legal Support">O1: Legal</th>
                <th className="py-3.5 px-4 text-center font-semibold" title="O2: Increased Confidence to Report">O2: Confident</th>
                <th className="py-3.5 px-4 text-center font-semibold" title="O3: Strengthened Partnership Engaged">O3: Partner</th>
                <th className="py-3.5 px-4 text-center font-semibold" title="O4: Increased Awareness of Rights">O4: Aware</th>
                <th className="py-3.5 px-4 text-center font-semibold" title="O5: Community Solution Initiated">O5: Comm</th>
                <th className="py-3.5 px-4 text-center font-semibold">Pre → Post</th>
                <th className="py-3.5 px-4 font-semibold">Police?</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOutcomes.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-500">
                    No outcome assessments recorded matching filters.
                  </td>
                </tr>
              ) : (
                filteredOutcomes.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      {rec.clientRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{rec.assessmentStage}</div>
                      <div className="text-[10px] text-slate-400">{rec.assessmentDate} • {rec.projectYear}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {rec.caseworker}
                    </td>

                    {/* O1 */}
                    <td className="py-3.5 px-4 text-center">
                      {rec.o1LegalAccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>

                    {/* O2 */}
                    <td className="py-3.5 px-4 text-center">
                      {rec.o2ConfidentToReport ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>

                    {/* O3 */}
                    <td className="py-3.5 px-4 text-center">
                      {rec.o3PartnershipEngaged ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>

                    {/* O4 */}
                    <td className="py-3.5 px-4 text-center">
                      {rec.o4AwarenessIncreased ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>

                    {/* O5 */}
                    <td className="py-3.5 px-4 text-center">
                      {rec.o5CommunitySolution ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>

                    {/* Pre -> Post Score */}
                    <td className="py-3.5 px-4 text-center">
                      {rec.knowledgeScorePre && rec.knowledgeScorePost ? (
                        <span className="font-mono text-[11px] font-semibold text-cyan-300">
                          {rec.knowledgeScorePre} → <span className="text-emerald-400 font-bold">{rec.knowledgeScorePost}</span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            (+{rec.knowledgeScorePost - rec.knowledgeScorePre})
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    {/* Police reporting */}
                    <td className="py-3.5 px-4">
                      {rec.reportedToPolice ? (
                        <Badge variant="info" size="sm">Yes (MPS)</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">No</Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Assessment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete outcome assessment for ${rec.clientRef}?`)) {
                              deleteOutcome(rec.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outcome Assessment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOutcome ? `Edit Outcome Assessment: ${editingOutcome.clientRef}` : 'Log Beneficiary Outcome Assessment'}
        subtitle="Evaluate the 5 core framework indicators at key milestones."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Reference</label>
              <select
                value={formData.clientRef}
                onChange={e => setFormData({ ...formData, clientRef: e.target.value })}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Stage</label>
              <select
                value={formData.assessmentStage}
                onChange={e => setFormData({ ...formData, assessmentStage: e.target.value as AssessmentStage })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Intake">Intake (Baseline)</option>
                <option value="3 Months">3 Months (Mid-Review)</option>
                <option value="6 Months">6 Months (Progress)</option>
                <option value="Closure">Closure (Exit)</option>
                <option value="Funder Review">Funder Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Date</label>
              <input
                type="date"
                required
                value={formData.assessmentDate}
                onChange={e => setFormData({ ...formData, assessmentDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Year</label>
              <select
                value={formData.projectYear}
                onChange={e => setFormData({ ...formData, projectYear: e.target.value as ProjectYear })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5">Year 5</option>
              </select>
            </div>
          </div>

          {/* 5 Outcomes Checkboxes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              5 Core M&E Framework Outcomes (Check if Achieved)
            </h4>

            <div className="space-y-2.5">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.o1LegalAccess}
                  onChange={e => setFormData({ ...formData, o1LegalAccess: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-xs text-white block">
                    Outcome 1: Better Access to Legal Support & Representation
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Client received pro-bono advice, injunction support, or Equality Act legal representation.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.o2ConfidentToReport}
                  onChange={e => setFormData({ ...formData, o2ConfidentToReport: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-xs text-white block">
                    Outcome 2: Increased Confidence to Report Incidents
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Beneficiary feels empowered, supported, and confident to report hate incidents.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.o3PartnershipEngaged}
                  onChange={e => setFormData({ ...formData, o3PartnershipEngaged: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-xs text-white block">
                    Outcome 3: Strengthened Multi-Agency Partnerships Engaged
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Cross-agency collaboration established (Police, Council, Housing, Health, or Faith Groups).
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.o4AwarenessIncreased}
                  onChange={e => setFormData({ ...formData, o4AwarenessIncreased: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-xs text-white block">
                    Outcome 4: Increased Awareness of Hate Crime & Legal Rights
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Demonstrable gain in understanding rights under Equality Act 2010 and criminal law.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.o5CommunitySolution}
                  onChange={e => setFormData({ ...formData, o5CommunitySolution: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span className="font-semibold text-xs text-white block">
                    Outcome 5: Community-Led Solution / Initiative Initiated
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Client or peer group initiated restorative community dialogue or neighborhood peer network.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Quantitative Indicators: Knowledge & Satisfaction */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pre-Score (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.knowledgeScorePre}
                onChange={e => setFormData({ ...formData, knowledgeScorePre: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Post-Score (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.knowledgeScorePost}
                onChange={e => setFormData({ ...formData, knowledgeScorePost: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Satisfaction (1-5)</label>
              <select
                value={formData.satisfactionRating}
                onChange={e => setFormData({ ...formData, satisfactionRating: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Satisfactory</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Very Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reported to Police?</label>
              <select
                value={formData.reportedToPolice ? 'Yes' : 'No'}
                onChange={e => setFormData({ ...formData, reportedToPolice: e.target.value === 'Yes' })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Yes">Yes (Formal Police Log)</option>
                <option value="No">No (Third-Party / Internal Only)</option>
              </select>
            </div>
          </div>

          {/* Referral & Qualitative Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Partner Organization Re-referred to (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ealing Law Centre, Victim Support Hub, Galop..."
                value={formData.partnerReferred}
                onChange={e => setFormData({ ...formData, partnerReferred: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Milestone Evidence & Qualitative Notes
              </label>
              <textarea
                rows={2}
                placeholder="Specific evidence of outcome achievement, court rulings, or client testimonials..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          {/* Submit */}
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
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-glow-emerald transition-all"
            >
              {editingOutcome ? 'Save Changes' : 'Record Assessment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
