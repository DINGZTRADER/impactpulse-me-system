import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Save,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { exportToExcel } from '../../utils/exportUtils';

export const QuarterlyReportModule: React.FC = () => {
  const { settings, stats, clients, outcomes, trainingSessions, volunteers, quarterlyNarrative, updateQuarterlyNarrative } = useApp();

  const [narrativeData, setNarrativeData] = useState(quarterlyNarrative);
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2025-26');

  const handleSaveNarrative = () => {
    updateQuarterlyNarrative(narrativeData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportReportExcel = () => {
    const clientNumbersSheet = [
      { Metric: 'New clients this quarter', Value: clients.length, Notes: 'Referrals accepted in reporting period' },
      { Metric: 'Total cumulative clients to date', Value: clients.length, Notes: 'All registered project beneficiaries' },
      { Metric: 'Active cases at end of quarter', Value: stats.activeCases, Notes: 'Ongoing active casework' },
      { Metric: 'High risk priority cases', Value: stats.highRiskCases, Notes: 'Requiring intensive legal support' },
      { Metric: '% of annual target met', Value: `${Math.round((clients.length / (settings.annualClientTarget || 50)) * 100)}%`, Notes: 'Target: 50 clients per year' }
    ];

    const demographicsSheet = [
      { Category: 'Borough - Ealing', Count: clients.filter(c => c.borough.includes('Ealing')).length, Share: `${stats.percentEaling}%` },
      { Category: 'Borough - Hillingdon', Count: clients.filter(c => c.borough.includes('Hillingdon')).length, Share: `${stats.percentHillingdon}%` },
      { Category: 'Borough - Hounslow', Count: clients.filter(c => c.borough.includes('Hounslow')).length, Share: `${stats.percentHounslow}%` },
      { Category: 'Gender - Female', Count: clients.filter(c => c.genderIdentity === 'Female').length, Share: `${stats.percentFemale}%` }
    ];

    const outcomesSheet = settings.outcomes.map((out, i) => {
      const rate =
        i === 0
          ? stats.o1AchievementRate
          : i === 1
          ? stats.o2AchievementRate
          : i === 2
          ? stats.o3AchievementRate
          : i === 3
          ? stats.o4AchievementRate
          : stats.o5AchievementRate;

      return {
        'Outcome Code': out.code,
        'Outcome Title': out.title,
        'Achievement Rate': `${rate}%`,
        'Funder Target': `${out.targetPercent}%`
      };
    });

    exportToExcel(
      [
        { sheetName: '1. Client Numbers', data: clientNumbersSheet },
        { sheetName: '2. Demographics', data: demographicsSheet },
        { sheetName: '3. Outcomes Achieved', data: outcomesSheet }
      ],
      `${settings.projectName.replace(/\s+/g, '_')}_Quarterly_Report_${selectedQuarter}`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Quarterly Funder Monitoring Report Generator</h2>
            <Badge variant="primary" size="sm">Auto-Populated</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auto-populates 7 core report sections from live casework data, with editable narrative commentary for funder submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedQuarter}
            onChange={e => setSelectedQuarter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="Q1 2025-26">Q1 2025-26 (01 Apr – 30 Jun 2026)</option>
            <option value="Q2 2025-26">Q2 2025-26 (01 Jul – 30 Sep 2026)</option>
            <option value="Q3 2025-26">Q3 2025-26 (01 Oct – 31 Dec 2026)</option>
            <option value="Q4 2025-26">Q4 2025-26 (01 Jan – 31 Mar 2027)</option>
          </select>

          <button
            onClick={handleExportReportExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Excel Export
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Report
          </button>
        </div>
      </div>

      {/* Printable Funder Report Container */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-10 shadow-2xl print:bg-white print:text-slate-900 print:p-0 print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="border-b border-slate-800 pb-8 space-y-4 print:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-brand-400 uppercase tracking-widest print:text-blue-700">
                Quarterly Monitoring & Evaluation Submission
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight print:text-slate-900">
                {settings.projectName}
              </h1>
              <div className="text-sm text-slate-300 font-medium print:text-slate-700">
                {settings.leadOrganisation}
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1 text-xs text-slate-400 print:text-slate-600">
              <div className="font-bold text-white text-sm print:text-slate-900">{selectedQuarter}</div>
              <div>Period: {quarterlyNarrative.reportingPeriod}</div>
              <div>Funder: <strong className="text-brand-300 print:text-blue-800">{settings.funderName}</strong> ({settings.totalFunding})</div>
              <div>Project Duration: {settings.projectDuration}</div>
            </div>
          </div>
        </div>

        {/* Section 1: Client Numbers & Caseload */}
        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 print:text-slate-900 print:border-slate-300">
            <span className="font-mono text-brand-400 print:text-blue-600">1.</span> Client Numbers & Caseload Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="text-[11px] text-slate-400">New Clients This Quarter</div>
              <div className="text-2xl font-bold text-white print:text-slate-900">{clients.length}</div>
              <div className="text-[10px] text-slate-500">100% accepted</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="text-[11px] text-slate-400">Total Cumulative Beneficiaries</div>
              <div className="text-2xl font-bold text-brand-400 print:text-blue-700">{clients.length}</div>
              <div className="text-[10px] text-slate-500">Project to date</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="text-[11px] text-slate-400">Active Live Caseload</div>
              <div className="text-2xl font-bold text-amber-400 print:text-amber-700">{stats.activeCases}</div>
              <div className="text-[10px] text-slate-500">In casework triage</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="text-[11px] text-slate-400">High Risk Priority Cases</div>
              <div className="text-2xl font-bold text-rose-400 print:text-rose-700">{stats.highRiskCases}</div>
              <div className="text-[10px] text-slate-500">Injunction / Police Lead</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <div className="text-[11px] text-slate-400">% Annual Target ({settings.annualClientTarget})</div>
              <div className="text-2xl font-bold text-emerald-400 print:text-emerald-700">
                {Math.round((clients.length / (settings.annualClientTarget || 50)) * 100)}%
              </div>
              <div className="text-[10px] text-slate-500">On-track delivery</div>
            </div>
          </div>
        </div>

        {/* Section 2: Borough & Demographic Breakdown */}
        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 print:text-slate-900 print:border-slate-300">
            <span className="font-mono text-brand-400 print:text-blue-600">2.</span> Geographic Reach & Demographic Breakdown
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-200">
              <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block print:text-slate-700">
                Borough Distribution
              </span>
              <div className="space-y-1 text-slate-300 print:text-slate-800">
                <div className="flex justify-between">
                  <span>Ealing (Hub)</span>
                  <strong className="text-white print:text-slate-900">{clients.filter(c => c.borough.includes('Ealing')).length} ({stats.percentEaling}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hillingdon</span>
                  <strong className="text-white print:text-slate-900">{clients.filter(c => c.borough.includes('Hillingdon')).length} ({stats.percentHillingdon}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hounslow</span>
                  <strong className="text-white print:text-slate-900">{clients.filter(c => c.borough.includes('Hounslow')).length} ({stats.percentHounslow}%)</strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-200">
              <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider block print:text-slate-700">
                Gender & Vulnerability Profile
              </span>
              <div className="space-y-1 text-slate-300 print:text-slate-800">
                <div className="flex justify-between">
                  <span>Female Beneficiaries</span>
                  <strong className="text-white print:text-slate-900">{stats.percentFemale}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Persistent Harassment / ASB</span>
                  <strong className="text-white print:text-slate-900">{clients.filter(c => c.isHarassmentASB).length} ({Math.round((clients.filter(c => c.isHarassmentASB).length / clients.length) * 100)}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Average Client Satisfaction</span>
                  <strong className="text-emerald-400 font-bold print:text-emerald-700">{stats.averageSatisfaction} / 5.0</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 5 Core Framework Outcomes */}
        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 print:text-slate-900 print:border-slate-300">
            <span className="font-mono text-brand-400 print:text-blue-600">3.</span> Outcome Achievement Rates (M&E Framework)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 print:text-slate-800">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] print:bg-slate-100 print:text-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">Outcome Indicator</th>
                  <th className="py-2.5 px-4 text-center">Funder Target</th>
                  <th className="py-2.5 px-4 text-center">Achieved Rate</th>
                  <th className="py-2.5 px-4 text-right">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {settings.outcomes.map((out, i) => {
                  const rate =
                    i === 0
                      ? stats.o1AchievementRate
                      : i === 1
                      ? stats.o2AchievementRate
                      : i === 2
                      ? stats.o3AchievementRate
                      : i === 3
                      ? stats.o4AchievementRate
                      : stats.o5AchievementRate;

                  return (
                    <tr key={out.id} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-4 font-mono font-bold text-brand-400 print:text-blue-700">{out.code}</td>
                      <td className="py-2.5 px-4 font-medium text-white print:text-slate-900">{out.title}</td>
                      <td className="py-2.5 px-4 text-center text-slate-400">{out.targetPercent}%</td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-400 font-mono text-sm print:text-emerald-700">{rate}%</td>
                      <td className="py-2.5 px-4 text-right font-semibold text-xs text-slate-300 print:text-slate-700">
                        {rate >= out.targetPercent ? '✓ Target Met' : 'In Progress'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Activities, Training & Volunteers */}
        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 print:text-slate-900 print:border-slate-300">
            <span className="font-mono text-brand-400 print:text-blue-600">4.</span> Community Reach, Training & Volunteer Capacity
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-400 block">Training Sessions</span>
              <strong className="text-lg font-bold text-white print:text-slate-900">{trainingSessions.length}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-400 block">Participants Trained</span>
              <strong className="text-lg font-bold text-white print:text-slate-900">{stats.totalTrainingParticipants}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-400 block">Volunteer Hours</span>
              <strong className="text-lg font-bold text-white print:text-slate-900">{stats.totalVolunteerHours} hrs</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-400 block">Knowledge Score Gain</span>
              <strong className="text-lg font-bold text-emerald-400 print:text-emerald-700">+{stats.avgKnowledgeDelta} pts</strong>
            </div>
          </div>
        </div>

        {/* Section 5: Executive Narrative (Editable) */}
        <div className="space-y-4 print-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-slate-300">
            <h2 className="text-base font-bold text-white flex items-center gap-2 print:text-slate-900">
              <span className="font-mono text-brand-400 print:text-blue-600">5.</span> Executive Summary & Impact Commentary
            </h2>
            <button
              onClick={handleSaveNarrative}
              className="no-print flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-brand-300 border border-slate-700 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Commentary
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 print:text-slate-900">
                Executive Overview:
              </label>
              <textarea
                rows={3}
                value={narrativeData.executiveSummary}
                onChange={e => setNarrativeData({ ...narrativeData, executiveSummary: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:border-brand-500 print:bg-transparent print:border-none print:p-0 print:text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 print:text-slate-900">
                Key Highlights & Transformative Breakthroughs:
              </label>
              <textarea
                rows={3}
                value={narrativeData.keyHighlights}
                onChange={e => setNarrativeData({ ...narrativeData, keyHighlights: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:border-brand-500 print:bg-transparent print:border-none print:p-0 print:text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Challenges & Mitigation */}
        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 print:text-slate-900 print:border-slate-300">
            <span className="font-mono text-brand-400 print:text-blue-600">6.</span> Delivery Challenges & Strategic Mitigation Actions
          </h2>

          <div className="text-xs">
            <textarea
              rows={3}
              value={narrativeData.challengesAndMitigations}
              onChange={e => setNarrativeData({ ...narrativeData, challengesAndMitigations: e.target.value })}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:border-brand-500 print:bg-transparent print:border-none print:p-0 print:text-slate-800"
            />
          </div>
        </div>

        {/* Section 7: Priorities Next Quarter & Signoff */}
        <div className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 print:text-slate-900 print:border-slate-300">
            <span className="font-mono text-brand-400 print:text-blue-600">7.</span> Strategic Priorities for Next Reporting Quarter
          </h2>

          <div className="text-xs">
            <textarea
              rows={2}
              value={narrativeData.prioritiesNextQuarter}
              onChange={e => setNarrativeData({ ...narrativeData, prioritiesNextQuarter: e.target.value })}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:border-brand-500 print:bg-transparent print:border-none print:p-0 print:text-slate-800"
            />
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 print:border-slate-300 print:text-slate-600">
            <div>
              Submitted on behalf of <strong className="text-white print:text-slate-900">{settings.leadOrganisation}</strong> by <strong className="text-white print:text-slate-900">Freda Ritchie</strong>.
            </div>
            <div>
              Grant Ref: <strong className="text-slate-300 print:text-slate-800">{settings.id}</strong> | City Bridge Foundation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
