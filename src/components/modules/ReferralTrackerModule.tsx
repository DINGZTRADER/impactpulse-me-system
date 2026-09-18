import React, { useState, useMemo } from 'react';
import {
  Share2,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Building2,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReferralRecord, ReferralType, ProjectYear } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { exportToExcel } from '../../utils/exportUtils';

export const ReferralTrackerModule: React.FC = () => {
  const { referrals, clients, settings, addReferral, updateReferral, deleteReferral } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<ReferralRecord | null>(null);

  const [formData, setFormData] = useState<{
    clientRef: string;
    date: string;
    type: ReferralType;
    sourceCategory: string;
    partnerOrgName: string;
    reason: string;
    caseworker: string;
    status: 'Accepted' | 'Pending' | 'Completed' | 'Declined';
    projectYear: ProjectYear;
    notes: string;
  }>({
    clientRef: clients[0]?.clientRef || 'HC/1',
    date: new Date().toISOString().slice(0, 10),
    type: 'Incoming',
    sourceCategory: settings.referralSources[0] || 'Victim Support',
    partnerOrgName: 'Victim Support Hub',
    reason: 'Initial intake referral for hate incident support',
    caseworker: settings.caseworkers[0] || 'Paula Howell',
    status: 'Accepted',
    projectYear: settings.currentYear,
    notes: ''
  });

  const handleOpenNew = (type: ReferralType = 'Incoming') => {
    setEditingReferral(null);
    setFormData({
      clientRef: clients[0]?.clientRef || 'HC/1',
      date: new Date().toISOString().slice(0, 10),
      type,
      sourceCategory: settings.referralSources[0] || 'Victim Support',
      partnerOrgName: '',
      reason: '',
      caseworker: settings.caseworkers[0] || 'Paula Howell',
      status: 'Accepted',
      projectYear: settings.currentYear,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: ReferralRecord) => {
    setEditingReferral(rec);
    setFormData({
      clientRef: rec.clientRef || '',
      date: rec.date,
      type: rec.type,
      sourceCategory: rec.sourceCategory,
      partnerOrgName: rec.partnerOrgName,
      reason: rec.reason,
      caseworker: rec.caseworker,
      status: rec.status,
      projectYear: rec.projectYear,
      notes: rec.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReferral) {
      updateReferral(editingReferral.id, formData);
    } else {
      addReferral(formData);
    }
    setIsModalOpen(false);
  };

  // Automated 17-Category Source Summary (matches Sheet 4)
  const sourceSummary = useMemo(() => {
    const totalCount = referrals.length;
    return settings.referralSources.map(source => {
      const sourceRefs = referrals.filter(r => r.sourceCategory === source);
      const count = sourceRefs.length;
      const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      const y1Count = sourceRefs.filter(r => r.projectYear === 'Year 1').length;
      const y2Count = sourceRefs.filter(r => r.projectYear === 'Year 2').length;
      const y3Count = sourceRefs.filter(r => r.projectYear === 'Year 3').length;
      const y4Count = sourceRefs.filter(r => r.projectYear === 'Year 4').length;
      const y5Count = sourceRefs.filter(r => r.projectYear === 'Year 5').length;

      return {
        source,
        count,
        percent,
        y1Count,
        y2Count,
        y3Count,
        y4Count,
        y5Count
      };
    });
  }, [referrals, settings.referralSources]);

  const filteredReferrals = useMemo(() => {
    return referrals.filter(r => {
      const matchesSearch =
        (r.clientRef && r.clientRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.partnerOrgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.caseworker.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'All' || r.type === filterType;
      const matchesCategory = filterCategory === 'All' || r.sourceCategory === filterCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [referrals, searchTerm, filterType, filterCategory]);

  const handleExportData = () => {
    const exportData = filteredReferrals.map(r => ({
      'Date': r.date,
      'Type': r.type,
      'Client Ref': r.clientRef || 'N/A',
      'Source Category': r.sourceCategory,
      'Partner Organisation': r.partnerOrgName,
      'Reason / Presenting Issue': r.reason,
      'Caseworker': r.caseworker,
      'Status': r.status,
      'Project Year': r.projectYear,
      'Notes': r.notes || ''
    }));

    const summaryExportData = sourceSummary.map(s => ({
      'Referral Source Category': s.source,
      'Total Count': s.count,
      '% of Total': `${s.percent}%`,
      'Year 1': s.y1Count,
      'Year 2': s.y2Count,
      'Year 3': s.y3Count,
      'Year 4': s.y4Count,
      'Year 5': s.y5Count
    }));

    exportToExcel(
      [
        { sheetName: 'Referral Log', data: exportData },
        { sheetName: 'Source Breakdown', data: summaryExportData }
      ],
      'WLEC_Referral_Tracker_Register'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Referral Network Tracker</h2>
            <Badge variant="info" size="sm">{referrals.length} Referrals Logged</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track all incoming referrals TO the project and outgoing specialist referrals to statutory and community partners.
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
            onClick={() => handleOpenNew('Incoming')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <Plus className="w-4 h-4" />
            + New Referral
          </button>
        </div>
      </div>

      {/* 17-Category Source Summary Table (Auto-calculated from live data) */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white">
              Automated Referral Source Summary (17 Categories Across 5-Year Horizon)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Real-time breakdown</span>
        </div>

        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Referral Source Category</th>
                <th className="py-2.5 px-3 text-center font-semibold">Total Count</th>
                <th className="py-2.5 px-3 text-center font-semibold">% of Total</th>
                <th className="py-2.5 px-3 text-center font-semibold text-slate-400">Y1</th>
                <th className="py-2.5 px-3 text-center font-semibold text-slate-400">Y2</th>
                <th className="py-2.5 px-3 text-center font-semibold text-slate-400">Y3</th>
                <th className="py-2.5 px-3 text-center font-semibold text-slate-400">Y4</th>
                <th className="py-2.5 px-3 text-center font-semibold text-slate-400">Y5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sourceSummary.map(s => (
                <tr key={s.source} className="hover:bg-slate-900/40">
                  <td className="py-2 px-4 font-medium text-slate-200">{s.source}</td>
                  <td className="py-2 px-3 text-center font-bold text-brand-400">{s.count}</td>
                  <td className="py-2 px-3 text-center text-slate-300">{s.percent}%</td>
                  <td className="py-2 px-3 text-center text-slate-400">{s.y1Count}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{s.y2Count}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{s.y3Count}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{s.y4Count}</td>
                  <td className="py-2 px-3 text-center text-slate-400">{s.y5Count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partner, client, reason..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Referral Types (Incoming & Outgoing)</option>
              <option value="Incoming">Incoming Referrals (To WLEC)</option>
              <option value="Outgoing">Outgoing Referrals (To Partner)</option>
            </select>
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Source Categories</option>
              {settings.referralSources.map(rs => (
                <option key={rs} value={rs}>{rs}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Referral Log Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Direction</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Client Ref</th>
                <th className="py-3.5 px-4 font-semibold">Source Category</th>
                <th className="py-3.5 px-4 font-semibold">Partner Organization</th>
                <th className="py-3.5 px-4 font-semibold">Reason & Focus</th>
                <th className="py-3.5 px-4 font-semibold">Caseworker</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No referral entries match the filters.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      {ref.type === 'Incoming' ? (
                        <Badge variant="primary" size="sm">
                          <ArrowDownLeft className="w-3 h-3 text-brand-400" />
                          Incoming
                        </Badge>
                      ) : (
                        <Badge variant="purple" size="sm">
                          <ArrowUpRight className="w-3 h-3 text-purple-400" />
                          Outgoing
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {ref.date}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      {ref.clientRef || '-'}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {ref.sourceCategory}
                    </td>

                    <td className="py-3.5 px-4 text-white font-semibold">
                      {ref.partnerOrgName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={ref.reason}>
                      {ref.reason}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {ref.caseworker}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          ref.status === 'Accepted' || ref.status === 'Completed'
                            ? 'success'
                            : ref.status === 'Pending'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {ref.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(ref)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Referral"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete referral entry for ${ref.partnerOrgName}?`)) {
                              deleteReferral(ref.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Referral"
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

      {/* Referral Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReferral ? 'Edit Referral Record' : 'Log New Project Referral'}
        subtitle="Record incoming referral source or onward specialist referral."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Referral Direction</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ReferralType })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Incoming">Incoming (To Project)</option>
                <option value="Outgoing">Outgoing (To Partner Service)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Reference</label>
              <select
                value={formData.clientRef}
                onChange={e => setFormData({ ...formData, clientRef: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-brand-400 font-mono focus:border-brand-500"
              >
                <option value="">None / General Enquiry</option>
                {clients.map(c => (
                  <option key={c.id} value={c.clientRef}>
                    {c.clientRef} - {c.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Source Category (17 Types)</label>
              <select
                value={formData.sourceCategory}
                onChange={e => setFormData({ ...formData, sourceCategory: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.referralSources.map(rs => (
                  <option key={rs} value={rs}>{rs}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Partner Organization Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Victim Support, Ealing Council..."
                value={formData.partnerOrgName}
                onChange={e => setFormData({ ...formData, partnerOrgName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Caseworker</label>
              <select
                value={formData.caseworker}
                onChange={e => setFormData({ ...formData, caseworker: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.caseworkers.map(cw => (
                  <option key={cw} value={cw}>{cw}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Accepted">Accepted</option>
                <option value="Pending">Pending Review</option>
                <option value="Completed">Completed</option>
                <option value="Declined">Declined</option>
              </select>
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Focus for Referral</label>
            <textarea
              rows={2}
              required
              placeholder="Why was the referral made and what support is requested..."
              value={formData.reason}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
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
              {editingReferral ? 'Save Changes' : 'Save Referral'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
