import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Share2,
  CalendarCheck,
  HeartHandshake,
  GraduationCap,
  TrendingUp,
  FileText,
  BookOpen,
  AlertTriangle,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type ActiveTabId =
  | 'dashboard'
  | 'clients'
  | 'outcomes'
  | 'referrals'
  | 'activities'
  | 'volunteers'
  | 'training'
  | 'kpis'
  | 'reports'
  | 'casestudies'
  | 'risks'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTabId;
  setActiveTab: (tab: ActiveTabId) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { clients, outcomes, referrals, volunteers, trainingSessions, risks, caseStudies } = useApp();

  const navItems = [
    {
      id: 'dashboard' as ActiveTabId,
      label: 'Executive Dashboard',
      sheetNumber: '01',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'clients' as ActiveTabId,
      label: 'Client Intake & Cases',
      sheetNumber: '02',
      icon: Users,
      badge: clients.length
    },
    {
      id: 'outcomes' as ActiveTabId,
      label: '5-Outcome Tracker',
      sheetNumber: '03',
      icon: Target,
      badge: outcomes.length
    },
    {
      id: 'referrals' as ActiveTabId,
      label: 'Referral Network',
      sheetNumber: '04',
      icon: Share2,
      badge: referrals.length
    },
    {
      id: 'activities' as ActiveTabId,
      label: '5-Yr Activities Log',
      sheetNumber: '05',
      icon: CalendarCheck,
      badge: null
    },
    {
      id: 'volunteers' as ActiveTabId,
      label: 'Volunteer & DBS Log',
      sheetNumber: '06',
      icon: HeartHandshake,
      badge: volunteers.length
    },
    {
      id: 'training' as ActiveTabId,
      label: 'Training Register',
      sheetNumber: '07',
      icon: GraduationCap,
      badge: trainingSessions.length
    },
    {
      id: 'kpis' as ActiveTabId,
      label: 'KPI Trend Analytics',
      sheetNumber: '08',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'reports' as ActiveTabId,
      label: 'Quarterly Funder Report',
      sheetNumber: '09',
      icon: FileText,
      badge: 'Auto'
    },
    {
      id: 'casestudies' as ActiveTabId,
      label: 'Case Studies Builder',
      sheetNumber: '10',
      icon: BookOpen,
      badge: caseStudies.length
    },
    {
      id: 'risks' as ActiveTabId,
      label: '5x5 Risk Register',
      sheetNumber: '11',
      icon: AlertTriangle,
      badge: risks.filter(r => r.currentStatus === 'Active').length
    },
    {
      id: 'settings' as ActiveTabId,
      label: 'System Customizer',
      sheetNumber: '12',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 pt-16 bg-slate-950/95 border-r border-slate-800/80 transition-transform duration-300 lg:static lg:translate-x-0 no-print flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          M&E Workbook Modules (12 Sheets)
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-brand-500/15 text-white border border-brand-500/30 shadow-glow-brand'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300'
                      : 'bg-slate-900 text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  {item.sheetNumber}
                </span>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-xl p-3 bg-gradient-to-br from-slate-900 to-navy-800 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-300">WLEC Hate Crime Support</div>
          <div className="text-[10px] text-slate-400 mt-0.5">5-Year M&E Framework (2025–2030)</div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-emerald-400 font-medium">● City Bridge Foundation</span>
            <span className="text-slate-400">£480,801</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
