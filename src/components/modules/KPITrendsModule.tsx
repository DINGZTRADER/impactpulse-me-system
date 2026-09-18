import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  FileSpreadsheet,
  Layers,
  Sparkles,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { exportToExcel } from '../../utils/exportUtils';

export const KPITrendsModule: React.FC = () => {
  const { clients, outcomes, settings, stats } = useApp();

  const [activeChartTab, setActiveChartTab] = useState<'trajectory' | 'outcomes' | 'boroughs' | 'risks'>('trajectory');

  // Trajectory Table Data (Matches Sheet 8 Table 1)
  const trajectoryData = [
    { year: 'Year 1', targetCases: 50, actualCases: clients.length, targetWorkshops: 10, actualWorkshops: 4, targetPartners: 5, actualPartners: 5 },
    { year: 'Year 2', targetCases: 100, actualCases: 0, targetWorkshops: 15, actualWorkshops: 0, targetPartners: 10, actualPartners: 0 },
    { year: 'Year 3', targetCases: 150, actualCases: 0, targetWorkshops: 15, actualWorkshops: 0, targetPartners: 15, actualPartners: 0 },
    { year: 'Year 4', targetCases: 200, actualCases: 0, targetWorkshops: 15, actualWorkshops: 0, targetPartners: 18, actualPartners: 0 },
    { year: 'Year 5', targetCases: 250, actualCases: 0, targetWorkshops: 15, actualWorkshops: 0, targetPartners: 20, actualPartners: 0 },
  ];

  // Outcome Achievement Rates
  const outcomeRates = [
    { code: 'O1', label: 'Legal Support & Rights', rate: stats.o1AchievementRate, target: 85, color: '#38a8f6' },
    { code: 'O2', label: 'Confidence to Report', rate: stats.o2AchievementRate, target: 80, color: '#10b981' },
    { code: 'O3', label: 'Partnerships Engaged', rate: stats.o3AchievementRate, target: 75, color: '#8b5cf6' },
    { code: 'O4', label: 'Awareness of Rights', rate: stats.o4AchievementRate, target: 90, color: '#f59e0b' },
    { code: 'O5', label: 'Community Solutions', rate: stats.o5AchievementRate, target: 60, color: '#ec4899' },
  ];

  // Borough Distribution
  const boroughBreakdown = [
    { name: 'Ealing (Hub)', count: clients.filter(c => c.borough.includes('Ealing')).length, percent: stats.percentEaling, color: '#0e8ce8' },
    { name: 'Hillingdon', count: clients.filter(c => c.borough.includes('Hillingdon')).length, percent: stats.percentHillingdon, color: '#06b6d4' },
    { name: 'Hounslow', count: clients.filter(c => c.borough.includes('Hounslow')).length, percent: stats.percentHounslow, color: '#6366f1' },
    { name: 'Other West London', count: clients.filter(c => !c.borough.includes('Ealing') && !c.borough.includes('Hillingdon') && !c.borough.includes('Hounslow')).length, percent: stats.percentOther, color: '#a855f7' },
  ];

  // Risk Distribution
  const riskBreakdown = [
    { level: 'High Risk (Priority Intensive)', count: clients.filter(c => c.riskLevel === 'High').length, color: '#f43f5e' },
    { level: 'Medium Risk (Moderate Casework)', count: clients.filter(c => c.riskLevel === 'Medium').length, color: '#f59e0b' },
    { level: 'Low Risk (Standard Advice)', count: clients.filter(c => c.riskLevel === 'Low').length, color: '#10b981' },
  ];

  const handleExportData = () => {
    const trajectorySheet = trajectoryData.map(d => ({
      'Project Year': d.year,
      'Target Cases': d.targetCases,
      'Actual Cases': d.actualCases,
      'Target Workshops': d.targetWorkshops,
      'Actual Workshops': d.actualWorkshops,
      'Target Partnerships': d.targetPartners,
      'Actual Partnerships': d.actualPartners
    }));

    const outcomeSheet = outcomeRates.map(o => ({
      'Outcome Code': o.code,
      'Outcome Description': o.label,
      'Achievement Rate': `${o.rate}%`,
      'Framework Target': `${o.target}%`
    }));

    exportToExcel(
      [
        { sheetName: 'Cases vs Target', data: trajectorySheet },
        { sheetName: 'Outcome Achievement', data: outcomeSheet }
      ],
      'WLEC_KPI_Trends_Report'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">KPI Trend Analytics & 5-Year Trajectories</h2>
            <Badge variant="primary" size="sm">Visual Analytics</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualise 5-year targets vs actuals, outcome conversion rates, geographic borough shares, and risk profiles.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Export KPI Data
        </button>
      </div>

      {/* Chart Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveChartTab('trajectory')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeChartTab === 'trajectory'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          5-Year Cases vs Target (50 → 250)
        </button>

        <button
          onClick={() => setActiveChartTab('outcomes')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeChartTab === 'outcomes'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          5 Outcomes Achievement %
        </button>

        <button
          onClick={() => setActiveChartTab('boroughs')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeChartTab === 'boroughs'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Borough Reach Breakdown
        </button>

        <button
          onClick={() => setActiveChartTab('risks')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeChartTab === 'risks'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Risk Severity Distribution
        </button>
      </div>

      {/* Chart 1: 5-Year Trajectory */}
      {activeChartTab === 'trajectory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">5-Year Cumulative Caseload Trajectory</h3>
              <p className="text-xs text-slate-400">Target milestones scaling by 50 cases per project year</p>
            </div>

            {/* SVG Trajectory Chart */}
            <div className="space-y-4">
              <div className="h-64 w-full flex items-end gap-6 pt-6 pb-2 border-b border-slate-800">
                {trajectoryData.map((d, i) => {
                  const targetHeight = (d.targetCases / 250) * 100;
                  const actualHeight = (d.actualCases / 250) * 100;

                  return (
                    <div key={d.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Target Bar */}
                        <div
                          className="w-1/2 bg-slate-800 hover:bg-slate-700 rounded-t-lg transition-all relative flex flex-col justify-start items-center pt-2"
                          style={{ height: `${targetHeight}%` }}
                        >
                          <span className="text-[10px] font-mono text-slate-400">{d.targetCases}</span>
                        </div>

                        {/* Actual Bar */}
                        <div
                          className="w-1/2 bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all shadow-glow-brand flex flex-col justify-start items-center pt-2"
                          style={{ height: `${Math.max(8, actualHeight)}%` }}
                        >
                          <span className="text-[10px] font-mono font-bold text-white">{d.actualCases}</span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-slate-300">{d.year}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-800 rounded" />
                  <span>5-Year Cumulative Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-500 rounded shadow-glow-brand" />
                  <span>Actual Beneficiaries Supported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table 1 Data */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Framework Milestone Targets</h3>
            <div className="space-y-3">
              {trajectoryData.map(d => (
                <div key={d.year} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{d.year}</span>
                    <span className="text-slate-400 text-[11px]">{d.targetWorkshops} workshops • {d.targetPartners} partnerships</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-400 font-mono text-sm block">{d.actualCases} / {d.targetCases}</span>
                    <span className="text-[10px] text-slate-500">cases</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart 2: 5 Outcomes Achievement */}
      {activeChartTab === 'outcomes' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">5 Core Framework Outcomes (% of Beneficiaries)</h3>
            <p className="text-xs text-slate-400">Live achievement rates against funder target thresholds</p>
          </div>

          <div className="space-y-5">
            {outcomeRates.map(out => (
              <div key={out.code} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-brand-300">
                      {out.code}
                    </span>
                    <span className="font-semibold text-white">{out.label}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">Funder Target: {out.target}%</span>
                    <span className="font-bold text-sm font-mono text-emerald-400">{out.rate}%</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700 shadow-glow-brand"
                    style={{
                      width: `${Math.max(5, out.rate)}%`,
                      backgroundColor: out.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart 3: Borough Breakdown */}
      {activeChartTab === 'boroughs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Geographic Reach Across West London Hubs</h3>
            <div className="space-y-4 pt-2">
              {boroughBreakdown.map(b => (
                <div key={b.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{b.name}</span>
                    <span className="font-bold text-white font-mono">{b.count} clients ({b.percent}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(4, b.percent)}%`, backgroundColor: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Priority Borough Insights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-white">Ealing</strong> remains the primary casework anchor with {stats.percentEaling}% of all intake volume, driven by Southall community referrals and pro-active drop-in clinics.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-white">Hillingdon ({stats.percentHillingdon}%)</strong> and <strong className="text-white">Hounslow ({stats.percentHounslow}%)</strong> represent secondary expansion zones with active faith and refugee hub partnerships.
            </p>
          </div>
        </div>
      )}

      {/* Chart 4: Risk Distribution */}
      {activeChartTab === 'risks' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Casework Risk Triage Severity Distribution</h3>
            <p className="text-xs text-slate-400">High-risk cases trigger priority casework and legal injunction triage</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {riskBreakdown.map(r => (
              <div key={r.level} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">{r.level}</div>
                <div className="text-3xl font-bold text-white font-mono">{r.count}</div>
                <div className="text-[11px] text-slate-400">
                  {clients.length > 0 ? Math.round((r.count / clients.length) * 100) : 0}% of active caseload
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
