import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskRecord, RiskLevel, RiskStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { exportToExcel } from '../../utils/exportUtils';

export const RiskRegisterModule: React.FC = () => {
  const { risks, addRisk, updateRisk, deleteRisk } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskRecord | null>(null);

  const [formData, setFormData] = useState<{
    riskTitle: string;
    category: 'Operational' | 'Delivery' | 'Governance' | 'External' | 'Safeguarding' | 'Financial';
    probability: RiskLevel;
    impact: RiskLevel;
    mitigationStrategy: string;
    owner: string;
    reviewDate: string;
    reviewCadence: 'Monthly' | 'Quarterly' | 'Bi-annual' | 'Annual' | 'Ongoing';
    currentStatus: RiskStatus;
    latestActionTaken: string;
  }>({
    riskTitle: '',
    category: 'Delivery',
    probability: 'Medium',
    impact: 'High',
    mitigationStrategy: '',
    owner: 'Project Manager (Freda Ritchie)',
    reviewDate: new Date().toISOString().slice(0, 10),
    reviewCadence: 'Quarterly',
    currentStatus: 'Active',
    latestActionTaken: ''
  });

  const handleOpenNew = () => {
    setEditingRisk(null);
    setFormData({
      riskTitle: '',
      category: 'Delivery',
      probability: 'Medium',
      impact: 'High',
      mitigationStrategy: '',
      owner: 'Project Manager (Freda Ritchie)',
      reviewDate: new Date().toISOString().slice(0, 10),
      reviewCadence: 'Quarterly',
      currentStatus: 'Active',
      latestActionTaken: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (risk: RiskRecord) => {
    setEditingRisk(risk);
    setFormData({
      riskTitle: risk.riskTitle,
      category: risk.category,
      probability: risk.probability,
      impact: risk.impact,
      mitigationStrategy: risk.mitigationStrategy,
      owner: risk.owner,
      reviewDate: risk.reviewDate,
      reviewCadence: risk.reviewCadence,
      currentStatus: risk.currentStatus,
      latestActionTaken: risk.latestActionTaken
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRisk) {
      updateRisk(editingRisk.id, formData);
    } else {
      addRisk(formData);
    }
    setIsModalOpen(false);
  };

  const filteredRisks = useMemo(() => {
    return risks.filter(r => {
      const matchesSearch =
        r.riskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.mitigationStrategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'All' || r.currentStatus === filterStatus;
      const matchesCategory = filterCategory === 'All' || r.category === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [risks, searchTerm, filterStatus, filterCategory]);

  const handleExportData = () => {
    const exportData = filteredRisks.map(r => ({
      'Risk Description': r.riskTitle,
      'Category': r.category,
      'Probability': r.probability,
      'Impact': r.impact,
      'Mitigation Strategy': r.mitigationStrategy,
      'Risk Owner': r.owner,
      'Review Date': r.reviewDate,
      'Cadence': r.reviewCadence,
      'Status': r.currentStatus,
      'Latest Action Taken': r.latestActionTaken
    }));
    exportToExcel([{ sheetName: 'Risk Register', data: exportData }], 'WLEC_Risk_Register');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">5x5 Risk & Mitigation Register</h2>
            <Badge variant="danger" size="sm">{risks.length} Tracked Risks</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactive risk assessment, mitigation protocols, review cadences, and latest operational actions.
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
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <Plus className="w-4 h-4" />
            + New Risk Item
          </button>
        </div>
      </div>

      {/* Risk Severity Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Total Risks Identified</div>
          <div className="text-2xl font-bold text-white">{risks.length}</div>
          <div className="text-[10px] text-slate-400">M&E Framework Matrix</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">High Severity / Active</div>
          <div className="text-2xl font-bold text-rose-400">
            {risks.filter(r => r.impact === 'High' && r.currentStatus === 'Active').length}
          </div>
          <div className="text-[10px] text-rose-400">Requires Weekly Oversight</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Active Mitigations In Place</div>
          <div className="text-2xl font-bold text-emerald-400">
            {risks.filter(r => r.currentStatus === 'Active').length}
          </div>
          <div className="text-[10px] text-emerald-400">100% Assigned Owners</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Monitor / Low Probability</div>
          <div className="text-2xl font-bold text-amber-400">
            {risks.filter(r => r.currentStatus === 'Monitor').length}
          </div>
          <div className="text-[10px] text-slate-400">Scheduled Reviews</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search risk title, mitigation, owner..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Monitor">Monitor</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Risk Categories</option>
              <option value="Delivery">Delivery</option>
              <option value="Operational">Operational</option>
              <option value="Governance">Governance</option>
              <option value="External">External</option>
              <option value="Financial">Financial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risks Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Risk & Category</th>
                <th className="py-3.5 px-3 text-center font-semibold">Probability</th>
                <th className="py-3.5 px-3 text-center font-semibold">Impact</th>
                <th className="py-3.5 px-4 font-semibold">Mitigation Strategy</th>
                <th className="py-3.5 px-4 font-semibold">Owner & Cadence</th>
                <th className="py-3.5 px-4 font-semibold">Latest Action Taken</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRisks.map(r => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-white text-sm">{r.riskTitle}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-1 inline-block">
                      {r.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={r.probability === 'High' ? 'danger' : r.probability === 'Medium' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {r.probability}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={r.impact === 'High' ? 'danger' : r.impact === 'Medium' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {r.impact}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 max-w-sm leading-relaxed">
                    {r.mitigationStrategy}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{r.owner}</div>
                    <div className="text-[10px] text-slate-400">{r.reviewCadence} (Due: {r.reviewDate})</div>
                  </td>

                  <td className="py-3.5 px-4 text-emerald-400 text-[11px]">
                    {r.latestActionTaken || 'Scheduled review in progress'}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={r.currentStatus === 'Active' ? 'primary' : 'neutral'} size="sm">
                      {r.currentStatus}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(r)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Risk"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete risk "${r.riskTitle}"?`)) {
                            deleteRisk(r.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Risk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRisk ? 'Edit Risk Item' : 'Add Risk Register Entry'}
        subtitle="Evaluate probability, impact, mitigation controls, and operational actions."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Risk Title / Threat Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Delays in legal injunction hearings due to tribunal backlog..."
              value={formData.riskTitle}
              onChange={e => setFormData({ ...formData, riskTitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Delivery">Delivery</option>
                <option value="Operational">Operational</option>
                <option value="Governance">Governance</option>
                <option value="External">External</option>
                <option value="Safeguarding">Safeguarding</option>
                <option value="Financial">Financial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Probability</label>
              <select
                value={formData.probability}
                onChange={e => setFormData({ ...formData, probability: e.target.value as RiskLevel })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Impact</label>
              <select
                value={formData.impact}
                onChange={e => setFormData({ ...formData, impact: e.target.value as RiskLevel })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mitigation Strategy</label>
            <textarea
              rows={2}
              required
              placeholder="Controls and prevention actions taken to minimize likelihood or impact..."
              value={formData.mitigationStrategy}
              onChange={e => setFormData({ ...formData, mitigationStrategy: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Risk Owner</label>
              <input
                type="text"
                required
                value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Review Cadence</label>
              <select
                value={formData.reviewCadence}
                onChange={e => setFormData({ ...formData, reviewCadence: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Bi-annual">Bi-annual</option>
                <option value="Annual">Annual</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.currentStatus}
                onChange={e => setFormData({ ...formData, currentStatus: e.target.value as RiskStatus })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Active">Active</option>
                <option value="Monitor">Monitor</option>
                <option value="Mitigated">Mitigated</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Latest Action Taken</label>
            <input
              type="text"
              placeholder="e.g. Distributed multilingual pamphlets to 1,200 local residents..."
              value={formData.latestActionTaken}
              onChange={e => setFormData({ ...formData, latestActionTaken: e.target.value })}
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
              {editingRisk ? 'Save Changes' : 'Save Risk'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
