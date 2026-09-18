import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Sidebar, ActiveTabId } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { DashboardModule } from './components/modules/DashboardModule';
import { ClientIntakeModule } from './components/modules/ClientIntakeModule';
import { OutcomeTrackerModule } from './components/modules/OutcomeTrackerModule';
import { ReferralTrackerModule } from './components/modules/ReferralTrackerModule';
import { ActivitiesModule } from './components/modules/ActivitiesModule';
import { VolunteerModule } from './components/modules/VolunteerModule';
import { TrainingRegisterModule } from './components/modules/TrainingRegisterModule';
import { KPITrendsModule } from './components/modules/KPITrendsModule';
import { QuarterlyReportModule } from './components/modules/QuarterlyReportModule';
import { CaseStudiesModule } from './components/modules/CaseStudiesModule';
import { RiskRegisterModule } from './components/modules/RiskRegisterModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { Menu } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Navbar */}
      <Navbar onOpenSettings={() => setActiveTab('settings')} />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/70 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Mobile Menu Bar Button */}
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-800 no-print">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              <Menu className="w-4 h-4" />
              <span>Workbook Modules</span>
            </button>
            <span className="text-xs font-mono text-brand-400 font-bold uppercase">{activeTab}</span>
          </div>

          {/* Module Router */}
          {activeTab === 'dashboard' && <DashboardModule onNavigate={setActiveTab} />}
          {activeTab === 'clients' && <ClientIntakeModule />}
          {activeTab === 'outcomes' && <OutcomeTrackerModule />}
          {activeTab === 'referrals' && <ReferralTrackerModule />}
          {activeTab === 'activities' && <ActivitiesModule />}
          {activeTab === 'volunteers' && <VolunteerModule />}
          {activeTab === 'training' && <TrainingRegisterModule />}
          {activeTab === 'kpis' && <KPITrendsModule />}
          {activeTab === 'reports' && <QuarterlyReportModule />}
          {activeTab === 'casestudies' && <CaseStudiesModule />}
          {activeTab === 'risks' && <RiskRegisterModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </main>
      </div>

      {/* Global Toast Notification */}
      <Toast />
    </div>
  );
};

export default App;
