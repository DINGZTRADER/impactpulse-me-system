import React from 'react';
import {
  Users,
  Target,
  ShieldCheck,
  Award,
  Clock,
  GraduationCap,
  Share2,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const DashboardModule: React.FC<{ onNavigate: (tab: any) => void }> = ({ onNavigate }) => {
  const { settings, stats, clients, outcomes, referrals, trainingSessions, volunteers } = useApp();

  // Progress towards 5-Year Target (250 cases)
  const target5Yr = settings.fiveYearClientTarget || 250;
  const progress5Yr = Math.min(100, Math.round((stats.totalClients / target5Yr) * 100));

  // Progress towards Annual Target (50 cases)
  const targetYear = settings.annualClientTarget || 50;
  const progressYear = Math.min(100, Math.round((stats.totalClients / targetYear) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Funder Grant Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-slate-800 shadow-glass">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="md">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Live M&E Intelligence Hub
              </Badge>
              <Badge variant="neutral" size="md">
                {settings.currentYear} Active
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {settings.projectName}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring and evaluation portal for <span className="text-white font-medium">{settings.leadOrganisation}</span>. Funded by <span className="text-brand-300 font-semibold">{settings.funderName}</span> ({settings.totalFunding}) across {settings.projectDuration}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              Generate Funder Report
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('clients')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              + Client Intake
            </button>
          </div>
        </div>
      </div>

      {/* FUNDER QUICK-ANSWER PANEL (As requested by City Bridge Foundation & Funder review specs) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Funder Quick-Answer Panel — Instant Answers to Core Questions
          </h2>
          <span className="text-xs text-slate-400">Updates live from client intake</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="glass-card rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400">Total Clients to Date</div>
            <div className="text-2xl font-bold text-white">{stats.totalClients}</div>
            <div className="text-[10px] text-emerald-400 font-medium">{progressYear}% of Annual Target ({targetYear})</div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400">% from Ealing</div>
            <div className="text-2xl font-bold text-brand-400">{stats.percentEaling}%</div>
            <div className="text-[10px] text-slate-400">Primary West Hub</div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400">% from Hillingdon</div>
            <div className="text-2xl font-bold text-cyan-400">{stats.percentHillingdon}%</div>
            <div className="text-[10px] text-slate-400">West Border Reach</div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400">% from Hounslow</div>
            <div className="text-2xl font-bold text-indigo-400">{stats.percentHounslow}%</div>
            <div className="text-[10px] text-slate-400">South West Reach</div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400">% Female Clients</div>
            <div className="text-2xl font-bold text-purple-400">{stats.percentFemale}%</div>
            <div className="text-[10px] text-slate-400">Gender Parity Metric</div>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400">Active Live Cases</div>
            <div className="text-2xl font-bold text-amber-400">{stats.activeCases}</div>
            <div className="text-[10px] text-slate-400">{stats.highRiskCases} Priority High Risk</div>
          </div>
        </div>
      </div>

      {/* 5-YEAR PROGRESS TRAJECTORY TRACKER */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-white">5-Year Beneficiary Target Trajectory</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Framework milestone target: 50 cases in Year 1 scaling to 250 cumulative beneficiaries by Year 5.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">5-Year Completion</span>
              <span className="text-lg font-extrabold text-white">{stats.totalClients} / {target5Yr} Cases</span>
            </div>
            <Badge variant="primary" size="lg">
              {progress5Yr}% Completed
            </Badge>
          </div>
        </div>

        {/* Multi-stage Progress Meter */}
        <div className="space-y-2">
          <div className="relative h-4 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700 shadow-glow-brand"
              style={{ width: `${Math.max(5, progress5Yr)}%` }}
            />
          </div>
          <div className="grid grid-cols-5 text-[11px] text-slate-400 font-medium text-center pt-1">
            <div>Year 1 (50)</div>
            <div>Year 2 (100)</div>
            <div>Year 3 (150)</div>
            <div>Year 4 (200)</div>
            <div>Year 5 (250)</div>
          </div>
        </div>
      </div>

      {/* 5 CORE OUTCOMES PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">5 Core Outcomes Achievement</h3>
            </div>
            <button
              onClick={() => onNavigate('outcomes')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              View Detailed Matrix →
            </button>
          </div>

          <div className="space-y-4">
            {settings.outcomes.map((outcome, idx) => {
              const rate =
                idx === 0
                  ? stats.o1AchievementRate
                  : idx === 1
                  ? stats.o2AchievementRate
                  : idx === 2
                  ? stats.o3AchievementRate
                  : idx === 3
                  ? stats.o4AchievementRate
                  : stats.o5AchievementRate;

              return (
                <div key={outcome.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      <span className="text-brand-400 font-mono mr-1.5">{outcome.code}:</span>
                      {outcome.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Target: {outcome.targetPercent}%</span>
                      <span className={`font-bold ${rate >= outcome.targetPercent ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rate >= outcome.targetPercent ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-amber-500'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMMUNITY IMPACT & CAPABILITY KPIS */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Community Reach & Capacity Metrics</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock className="w-4 h-4 text-brand-400" />
                Volunteer Hours Logged
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalVolunteerHours} hrs</div>
              <div className="text-[11px] text-slate-400">{stats.activeVolunteers} Active Community Advocates</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Training Reach
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalTrainingParticipants} people</div>
              <div className="text-[11px] text-slate-400">{stats.totalTrainingSessions} Modular Sessions</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Referral Network Partners
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalReferrals} referrals</div>
              <div className="text-[11px] text-slate-400">17 Partner Categories</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Knowledge Delta Shift
              </div>
              <div className="text-2xl font-bold text-emerald-400">+{stats.avgKnowledgeDelta} pts</div>
              <div className="text-[11px] text-slate-400">Pre ({stats.averagePreScore}) → Post ({stats.averagePostScore}/10)</div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT CASEWORK & CLIENT SNAPSHOT */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Recent Client Intake & Case Activity</h3>
          </div>
          <button
            onClick={() => onNavigate('clients')}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium"
          >
            Manage All {clients.length} Cases →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Client Ref</th>
                <th className="py-3 px-4">Caseworker</th>
                <th className="py-3 px-4">Date Referred</th>
                <th className="py-3 px-4">Borough</th>
                <th className="py-3 px-4">Referral Source</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Primary Category</th>
                <th className="py-3 px-4 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {clients.slice(0, 5).map(client => (
                <tr key={client.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-400">{client.clientRef}</td>
                  <td className="py-3 px-4 text-slate-200">{client.caseworker}</td>
                  <td className="py-3 px-4 text-slate-400">{client.dateReferred}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {client.borough}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{client.referralSource}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        client.riskLevel === 'High'
                          ? 'danger'
                          : client.riskLevel === 'Medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {client.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {client.hateCrimeTypes[0] || 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={client.caseStatus === 'Active' ? 'primary' : 'neutral'} size="sm">
                      {client.caseStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
