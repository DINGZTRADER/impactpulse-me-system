import React, { useRef } from 'react';
import {
  ShieldAlert,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const {
    settings,
    anonymizeView,
    setAnonymizeView,
    exportBackupJSON,
    importBackupJSON,
    resetToDefaultData
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJSON(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl no-print">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand / Project Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-glow-brand">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white sm:text-base text-sm">
                  {settings.projectName}
                </span>
                <Badge variant="primary" size="sm">
                  {settings.currentYear}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Building2 className="w-3 h-3 text-brand-400" />
                  {settings.leadOrganisation}
                </span>
                <span className="text-slate-600">•</span>
                <span className="hidden md:inline text-slate-400">{settings.funderName} ({settings.totalFunding})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Anonymize Toggle (GDPR Protection) */}
          <button
            onClick={() => setAnonymizeView(prev => !prev)}
            title={anonymizeView ? "Full Confidential Names Visible" : "Anonymized IDs View (GDPR & Funder Safe)"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              anonymizeView
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {anonymizeView ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Anonymized (Active)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Anonymize View</span>
              </>
            )}
          </button>

          {/* Backup Database */}
          <button
            onClick={exportBackupJSON}
            title="Download JSON Database Backup"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden lg:inline">Export DB</span>
          </button>

          {/* Restore Database */}
          <label
            title="Import JSON Database Backup"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Import DB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Reset to Default WLEC Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all project data to the official WLEC Hate Crime Support Project defaults?')) {
                resetToDefaultData();
              }
            }}
            title="Reset system to WLEC Hate Crime sample dataset"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
