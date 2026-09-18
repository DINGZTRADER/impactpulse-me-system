import React, { useState, useRef } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Building2,
  Target,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectSettings, OutcomeDefinition } from '../../types';
import { Badge } from '../common/Badge';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaultData,
    exportBackupJSON,
    importBackupJSON,
    showToast
  } = useApp();

  const [formData, setFormData] = useState<ProjectSettings>(settings);
  const [activeSubTab, setActiveSubTab] = useState<'project' | 'outcomes' | 'dropdowns' | 'templates'>('project');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Outcome edit
  const handleUpdateOutcome = (index: number, updates: Partial<OutcomeDefinition>) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = { ...newOutcomes[index], ...updates };
    setFormData({ ...formData, outcomes: newOutcomes });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleTemplateSwitch = (templateName: string) => {
    if (templateName === 'refugee') {
      const refugeeSettings: Partial<ProjectSettings> = {
        projectName: 'Refugee Integration & Legal Rights Project',
        leadOrganisation: 'West London Refugee Alliance',
        funderName: 'Trust for London',
        totalFunding: '£350,000',
        projectDuration: '3 Years (2025–2028)',
        annualClientTarget: 75,
        fiveYearClientTarget: 225,
        outcomes: [
          { id: 'o1', code: 'O1', title: 'Improved Housing & Asylum Legal Status', description: 'Clients achieve secure immigration advice and emergency accommodation.', category: 'Legal & Housing', targetPercent: 80 },
          { id: 'o2', code: 'O2', title: 'Increased English Proficiency (ESOL)', description: 'Demonstrated language fluency and community communication skills.', category: 'Education', targetPercent: 85 },
          { id: 'o3', code: 'O3', title: 'Access to Primary Healthcare & Trauma Support', description: 'GP registration and mental health counselling secured.', category: 'Health & Wellbeing', targetPercent: 90 },
          { id: 'o4', code: 'O4', title: 'Employment & Vocational Training Readiness', description: 'CV building, job applications, and apprenticeship placement.', category: 'Livelihoods', targetPercent: 70 },
          { id: 'o5', code: 'O5', title: 'Community Social Inclusion & Peer Networks', description: 'Participation in cultural exchange and neighborhood befriending.', category: 'Inclusion', targetPercent: 75 }
        ],
        hateCrimeTypes: ['Asylum Claim Issue', 'Destitution & Housing', 'Work Right Dispute', 'Language Barrier', 'Healthcare Access', 'Xenophobic Harassment']
      };
      setFormData(prev => ({ ...prev, ...refugeeSettings }));
      updateSettings(refugeeSettings);
      showToast('Switched to Refugee Integration Project template!');
    } else if (templateName === 'youth') {
      const youthSettings: Partial<ProjectSettings> = {
        projectName: 'Youth Wellbeing & Mentoring Initiative',
        leadOrganisation: 'NextGen Community Youth Trust',
        funderName: 'National Lottery Community Fund',
        totalFunding: '£275,000',
        projectDuration: '3 Years (2025–2028)',
        annualClientTarget: 60,
        fiveYearClientTarget: 180,
        outcomes: [
          { id: 'o1', code: 'O1', title: 'Improved Emotional Resilience & Mental Wellbeing', description: 'Pre/post reduction in psychological distress and anxiety scores.', category: 'Mental Health', targetPercent: 85 },
          { id: 'o2', code: 'O2', title: 'School Attendance & Educational Re-engagement', description: 'Reduction in school exclusions and improved grade attendance.', category: 'Education', targetPercent: 80 },
          { id: 'o3', code: 'O3', title: 'Confidence & Peer Communication Skills', description: 'Increased self-esteem, teamwork, and leadership capability.', category: 'Soft Skills', targetPercent: 90 },
          { id: 'o4', code: 'O4', title: 'Diversion from Youth Violence & Anti-Social Behaviour', description: 'Positive recreational participation and mentoring guidance.', category: 'Youth Safety', targetPercent: 95 },
          { id: 'o5', code: 'O5', title: 'Family Relationship Stability', description: 'Improved conflict resolution and home communication.', category: 'Family Wellbeing', targetPercent: 75 }
        ],
        hateCrimeTypes: ['School Bullying', 'Cyber-Bullying', 'Gang Pressure', 'Family Breakdown', 'Anxiety & Isolation']
      };
      setFormData(prev => ({ ...prev, ...youthSettings }));
      updateSettings(youthSettings);
      showToast('Switched to Youth Wellbeing & Mentoring template!');
    } else {
      resetToDefaultData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">System Customizer & Project Architecture</h2>
            <Badge variant="primary" size="sm">Universal M&E</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tailor the entire monitoring system to any charity, NGO, or grant-funded project. Modify outcomes, targets, dropdown lists, and funders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportBackupJSON}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <Download className="w-4 h-4 text-brand-400" />
            Backup DB
          </button>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('project')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'project'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Project & Funder Profile
        </button>
        <button
          onClick={() => setActiveSubTab('outcomes')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'outcomes'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          5-Outcome Framework Customizer
        </button>
        <button
          onClick={() => setActiveSubTab('dropdowns')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'dropdowns'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Dropdown Lists & Categorisations
        </button>
        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'templates'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Project Sector Templates
        </button>
      </div>

      {/* Tab 1: Project & Funder Profile */}
      {activeSubTab === 'project' && (
        <form onSubmit={handleSaveAll} className="glass-card rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Organisation</label>
              <input
                type="text"
                required
                value={formData.leadOrganisation}
                onChange={e => setFormData({ ...formData, leadOrganisation: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Funder / Donor Name</label>
              <input
                type="text"
                required
                value={formData.funderName}
                onChange={e => setFormData({ ...formData, funderName: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Grant / Funding Amount</label>
              <input
                type="text"
                required
                value={formData.totalFunding}
                onChange={e => setFormData({ ...formData, totalFunding: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Duration</label>
              <input
                type="text"
                required
                value={formData.projectDuration}
                onChange={e => setFormData({ ...formData, projectDuration: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Client Target</label>
              <input
                type="number"
                required
                value={formData.annualClientTarget}
                onChange={e => setFormData({ ...formData, annualClientTarget: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">5-Year Cumulative Client Target</label>
              <input
                type="number"
                required
                value={formData.fiveYearClientTarget}
                onChange={e => setFormData({ ...formData, fiveYearClientTarget: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-brand-400 font-bold focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: 5 Outcomes Customizer */}
      {activeSubTab === 'outcomes' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">5 Core Outcomes Definition</h3>
              <p className="text-xs text-slate-400">Rename indicators, targets, and descriptions for your specific theory of change</p>
            </div>
          </div>

          <div className="space-y-4">
            {formData.outcomes.map((out, idx) => (
              <div key={out.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-400">{out.code}</span>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-400">Target Success Rate (%):</label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={out.targetPercent}
                      onChange={e => handleUpdateOutcome(idx, { targetPercent: Number(e.target.value) })}
                      className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-bold text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Outcome Title</label>
                    <input
                      type="text"
                      value={out.title}
                      onChange={e => handleUpdateOutcome(idx, { title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Category</label>
                    <input
                      type="text"
                      value={out.category}
                      onChange={e => handleUpdateOutcome(idx, { category: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Description & Evidence Threshold</label>
                  <input
                    type="text"
                    value={out.description}
                    onChange={e => handleUpdateOutcome(idx, { description: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-brand-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              Save Custom Outcomes
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Dropdown Lists & Options */}
      {activeSubTab === 'dropdowns' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Custom Dropdown Categories</h3>
            <p className="text-xs text-slate-400">Configure regions, referral sources, caseworkers, and incident categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Boroughs / Target Locations</label>
              <textarea
                rows={4}
                value={formData.allBoroughs.join('\n')}
                onChange={e => setFormData({ ...formData, allBoroughs: e.target.value.split('\n').filter(Boolean) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500">One per line</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Caseworkers & Project Officers</label>
              <textarea
                rows={4}
                value={formData.caseworkers.join('\n')}
                onChange={e => setFormData({ ...formData, caseworkers: e.target.value.split('\n').filter(Boolean) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500">One per line</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Referral Sources (17 Standard Categories)</label>
              <textarea
                rows={6}
                value={formData.referralSources.join('\n')}
                onChange={e => setFormData({ ...formData, referralSources: e.target.value.split('\n').filter(Boolean) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500">One per line</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Incident / Issue Categories</label>
              <textarea
                rows={6}
                value={formData.hateCrimeTypes.join('\n')}
                onChange={e => setFormData({ ...formData, hateCrimeTypes: e.target.value.split('\n').filter(Boolean) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500">One per line</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              Save Dropdown Lists
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Project Sector Templates */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-2">
            <h3 className="text-base font-bold text-white">Pre-Configured Sector Templates</h3>
            <p className="text-xs text-slate-400">
              Instantly adapt the 12-sheet M&E framework to other non-profit sectors with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Template 1: WLEC Default */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-4 border-t-brand-500 flex flex-col justify-between">
              <div className="space-y-2">
                <Badge variant="primary" size="sm">Flagship / Default</Badge>
                <h4 className="text-base font-bold text-white">WLEC Hate Crime Support Project</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored for hate crime advocacy, legal injunctions, Equality Act 2010 rights, and Metropolitan Police third-party reporting.
                </p>
              </div>
              <button
                onClick={() => handleTemplateSwitch('default')}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              >
                Apply WLEC Framework
              </button>
            </div>

            {/* Template 2: Refugee */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-4 border-t-emerald-500 flex flex-col justify-between">
              <div className="space-y-2">
                <Badge variant="success" size="sm">Integration Sector</Badge>
                <h4 className="text-base font-bold text-white">Refugee & Asylum Seeker Rights</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Configured for ESOL language acquisition, asylum legal casework, NHS registration, trauma counselling, and community befriending.
                </p>
              </div>
              <button
                onClick={() => handleTemplateSwitch('refugee')}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all"
              >
                Apply Refugee Template
              </button>
            </div>

            {/* Template 3: Youth Wellbeing */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-4 border-t-purple-500 flex flex-col justify-between">
              <div className="space-y-2">
                <Badge variant="purple" size="sm">Youth & Education</Badge>
                <h4 className="text-base font-bold text-white">Youth Wellbeing & Mentoring</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Configured for school engagement, emotional resilience scores, violence diversion, peer mentoring, and family communication.
                </p>
              </div>
              <button
                onClick={() => handleTemplateSwitch('youth')}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all"
              >
                Apply Youth Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
