import React, { useState } from 'react';
import {
  CalendarCheck,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { exportToExcel } from '../../utils/exportUtils';

export const ActivitiesModule: React.FC = () => {
  const { settings, clients, trainingSessions, volunteers, referrals } = useApp();

  // Dynamic calculation of actuals
  const actualCases = clients.length;
  const actualWorkshops = trainingSessions.length;
  const actualVolunteers = volunteers.length;
  const actualPartnerships = referrals.filter(r => r.status === 'Accepted' || r.status === 'Completed').length;
  const actualRoundtables = trainingSessions.filter(t => t.audience === 'Staff & Partners' || t.audience === 'Community & Volunteers').length;

  const activitiesData = [
    {
      key: 'cases_handled',
      title: 'Hate crime cases handled & supported',
      category: 'Direct Casework (Outcome 1 & 2)',
      y1: 50,
      y2: 50,
      y3: 50,
      y4: 50,
      y5: 50,
      y5CumTarget: 250,
      actual: actualCases,
      unit: 'cases'
    },
    {
      key: 'workshops_delivered',
      title: 'Awareness workshops & community briefings delivered',
      category: 'Community Outreach & Education (Outcome 4)',
      y1: 10,
      y2: 15,
      y3: 15,
      y4: 15,
      y5: 15,
      y5CumTarget: 70,
      actual: actualWorkshops,
      unit: 'workshops'
    },
    {
      key: 'volunteers_recruited',
      title: 'New community volunteers recruited & trained',
      category: 'Capacity Building & Grassroots Support',
      y1: 0,
      y2: 15,
      y3: 0,
      y4: 0,
      y5: 0,
      y5CumTarget: 15,
      actual: actualVolunteers,
      unit: 'volunteers'
    },
    {
      key: 'formal_partnerships',
      title: 'Formal agency partnerships & referral protocols established',
      category: 'Multi-Agency Liaison (Outcome 3)',
      y1: 5,
      y2: 10,
      y3: 15,
      y4: 18,
      y5: 20,
      y5CumTarget: 20,
      actual: actualPartnerships,
      unit: 'partnerships'
    },
    {
      key: 'community_initiatives',
      title: 'Community roundtables & peer dialogue sessions',
      category: 'Restorative Community Resilience (Outcome 5)',
      y1: 4,
      y2: 6,
      y3: 8,
      y4: 8,
      y5: 8,
      y5CumTarget: 34,
      actual: actualRoundtables,
      unit: 'sessions'
    }
  ];

  const handleExportData = () => {
    const exportData = activitiesData.map(a => ({
      'Activity / Deliverable': a.title,
      'Category': a.category,
      'Year 1 Target': a.y1,
      'Year 2 Target': a.y2,
      'Year 3 Target': a.y3,
      'Year 4 Target': a.y4,
      'Year 5 Target': a.y5,
      '5-Year Total Target': a.y5CumTarget,
      'Actual to Date': a.actual,
      '% of Total Target': `${Math.round((a.actual / a.y5CumTarget) * 100)}%`,
      'Unit': a.unit
    }));
    exportToExcel([{ sheetName: 'Activities Log', data: exportData }], 'WLEC_5Year_Activities_Log');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">5-Year Project Activities & Deliverables Log</h2>
            <Badge variant="primary" size="sm">Framework Milestones</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracks progress against the year-by-year targets set out in the WLEC 5-Year M&E Framework (2025–2030).
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Export Excel
        </button>
      </div>

      {/* Main Activities Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 font-semibold">Activity & Deliverable</th>
                <th className="py-4 px-3 text-center font-semibold">Y1 Target</th>
                <th className="py-4 px-3 text-center font-semibold">Y2 Target</th>
                <th className="py-4 px-3 text-center font-semibold">Y3 Target</th>
                <th className="py-4 px-3 text-center font-semibold">Y4 Target</th>
                <th className="py-4 px-3 text-center font-semibold">Y5 Target</th>
                <th className="py-4 px-4 text-center font-semibold bg-brand-500/10 text-brand-300">Actual to Date</th>
                <th className="py-4 px-4 text-center font-semibold">% of 5-Yr Target</th>
                <th className="py-4 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activitiesData.map(act => {
                const percent = Math.round((act.actual / act.y5CumTarget) * 100);
                const isAhead = act.actual >= act.y1;

                return (
                  <tr key={act.key} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{act.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{act.category}</div>
                    </td>

                    <td className="py-4 px-3 text-center font-mono text-slate-300">{act.y1}</td>
                    <td className="py-4 px-3 text-center font-mono text-slate-400">{act.y2}</td>
                    <td className="py-4 px-3 text-center font-mono text-slate-400">{act.y3}</td>
                    <td className="py-4 px-3 text-center font-mono text-slate-400">{act.y4}</td>
                    <td className="py-4 px-3 text-center font-mono text-slate-400">{act.y5}</td>

                    <td className="py-4 px-4 text-center bg-brand-500/10">
                      <span className="font-bold text-base text-brand-300 font-mono">
                        {act.actual}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">{act.unit}</span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-white text-xs">{percent}%</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Badge variant={isAhead ? 'success' : 'primary'} size="sm">
                        {isAhead ? 'On Track (Y1)' : 'In Progress'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Year Milestone Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-4 space-y-2 border-t-2 border-t-brand-500">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>Year 1 (2025–26)</span>
            <Badge variant="primary" size="sm">Current</Badge>
          </div>
          <p className="text-[11px] text-slate-400">
            Establish project foundations, intake first 50 cases, deliver 10 workshops, formalise 5 partner MoUs.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-2 border-t-2 border-t-indigo-500">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Year 2 (2026–27)</span>
            <span className="text-[10px] text-slate-500">Planned</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Recruit and train 15 volunteers, deliver 15 workshops, expand reach into Hillingdon & Hounslow.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-2 border-t-2 border-t-cyan-500">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Year 3 (2027–28)</span>
            <span className="text-[10px] text-slate-500">Planned</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Mid-term review, reach 150 cumulative clients, scale community roundtables and policy advocacy.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-2 border-t-2 border-t-purple-500">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Year 4 (2028–29)</span>
            <span className="text-[10px] text-slate-500">Planned</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Reach 200 cumulative clients, 18 formal partnerships, launch youth peer safety network.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-2 border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Year 5 (2029–30)</span>
            <span className="text-[10px] text-slate-500">Target</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Complete 250 case milestone, final independent evaluation, project sustainability transition.
          </p>
        </div>
      </div>
    </div>
  );
};
