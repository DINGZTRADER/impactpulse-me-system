import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  AlertTriangle,
  MapPin,
  Calendar,
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClientRecord, RiskLevel, CaseStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { exportToExcel, exportToCSV } from '../../utils/exportUtils';

export const ClientIntakeModule: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, anonymizeView, settings } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBorough, setFilterBorough] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    clientRef: string;
    fullName: string;
    initials: string;
    caseworker: string;
    dateReferred: string;
    caseStatus: CaseStatus;
    borough: string;
    referralSource: string;
    ageGroup: string;
    genderIdentity: string;
    ethnicOrigin: string;
    religion: string;
    riskLevel: RiskLevel;
    hateCrimeTypes: string[];
    isHarassmentASB: boolean;
    presentingIssue: string;
    notes: string;
  }>({
    clientRef: '',
    fullName: '',
    initials: '',
    caseworker: settings.caseworkers[0] || 'Paula Howell',
    dateReferred: new Date().toISOString().slice(0, 10),
    caseStatus: 'Active',
    borough: settings.primaryBoroughs[0] || 'Ealing',
    referralSource: settings.referralSources[0] || 'Victim Support',
    ageGroup: '26-55',
    genderIdentity: 'Female',
    ethnicOrigin: settings.ethnicities[0] || 'Black: African',
    religion: settings.religions[0] || 'Christian',
    riskLevel: 'Medium',
    hateCrimeTypes: ['Racial'],
    isHarassmentASB: true,
    presentingIssue: '',
    notes: ''
  });

  const nextAutoRef = useMemo(() => {
    const nextNum = clients.length + 1;
    return `HC/${nextNum}`;
  }, [clients.length]);

  const handleOpenNew = () => {
    setEditingClient(null);
    setFormData({
      clientRef: nextAutoRef,
      fullName: '',
      initials: '',
      caseworker: settings.caseworkers[0] || 'Paula Howell',
      dateReferred: new Date().toISOString().slice(0, 10),
      caseStatus: 'Active',
      borough: settings.primaryBoroughs[0] || 'Ealing',
      referralSource: settings.referralSources[0] || 'Victim Support',
      ageGroup: '26-55',
      genderIdentity: 'Female',
      ethnicOrigin: settings.ethnicities[0] || 'Black: African',
      religion: settings.religions[0] || 'Christian',
      riskLevel: 'Medium',
      hateCrimeTypes: ['Racial'],
      isHarassmentASB: true,
      presentingIssue: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: ClientRecord) => {
    setEditingClient(client);
    setFormData({
      clientRef: client.clientRef,
      fullName: client.fullName,
      initials: client.initials,
      caseworker: client.caseworker,
      dateReferred: client.dateReferred,
      caseStatus: client.caseStatus,
      borough: client.borough,
      referralSource: client.referralSource,
      ageGroup: client.ageGroup,
      genderIdentity: client.genderIdentity,
      ethnicOrigin: client.ethnicOrigin,
      religion: client.religion,
      riskLevel: client.riskLevel,
      hateCrimeTypes: client.hateCrimeTypes,
      isHarassmentASB: client.isHarassmentASB,
      presentingIssue: client.presentingIssue || '',
      notes: client.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials =
      formData.initials.trim() ||
      formData.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() ||
      'CLI';

    if (editingClient) {
      updateClient(editingClient.id, {
        ...formData,
        initials
      });
    } else {
      addClient({
        ...formData,
        initials
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleHateCrimeType = (type: string) => {
    setFormData(prev => {
      const exists = prev.hateCrimeTypes.includes(type);
      return {
        ...prev,
        hateCrimeTypes: exists
          ? prev.hateCrimeTypes.filter(t => t !== type)
          : [...prev.hateCrimeTypes, type]
      };
    });
  };

  // Filtered clients list
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch =
        c.clientRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseworker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.presentingIssue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBorough = filterBorough === 'All' || c.borough === filterBorough;
      const matchesStatus = filterStatus === 'All' || c.caseStatus === filterStatus;
      const matchesRisk = filterRisk === 'All' || c.riskLevel === filterRisk;
      const matchesCategory =
        filterCategory === 'All' || c.hateCrimeTypes.includes(filterCategory);

      return matchesSearch && matchesBorough && matchesStatus && matchesRisk && matchesCategory;
    });
  }, [clients, searchTerm, filterBorough, filterStatus, filterRisk, filterCategory]);

  const handleExportData = () => {
    const exportData = filteredClients.map(c => ({
      'Client Ref': c.clientRef,
      'Full Name (Internal)': anonymizeView ? '[CONFIDENTIAL]' : c.fullName,
      'Initials / ID': c.initials,
      'Caseworker': c.caseworker,
      'Date Referred': c.dateReferred,
      'Case Status': c.caseStatus,
      'Borough': c.borough,
      'Referral Source': c.referralSource,
      'Age Group': c.ageGroup,
      'Gender Identity': c.genderIdentity,
      'Ethnic Origin': c.ethnicOrigin,
      'Religion': c.religion,
      'Risk Level': c.riskLevel,
      'Type of Hate Crime': c.hateCrimeTypes.join(', '),
      'Harassment/ASB': c.isHarassmentASB ? 'Yes' : 'No',
      'Presenting Issue': c.presentingIssue || '',
      'Notes': c.notes || ''
    }));
    exportToExcel([{ sheetName: 'Client Intake', data: exportData }], 'WLEC_Client_Intake_Register');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Client Intake & Case Management</h2>
            <Badge variant="primary" size="sm">{clients.length} Registered</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capture full client profiles at the start of their journey. Feeds all dashboard metrics and quarterly funder reports.
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
            <UserPlus className="w-4 h-4" />
            New Client Intake
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, name, notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Borough Filter */}
          <div>
            <select
              value={filterBorough}
              onChange={e => setFilterBorough(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Boroughs</option>
              {settings.allBoroughs.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Statuses</option>
              {settings.caseStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Risk Levels</option>
              {settings.riskLevels.map(r => (
                <option key={r} value={r}>{r} Risk</option>
              ))}
            </select>
          </div>

          {/* Hate Crime Type Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Hate Crime Types</option>
              {settings.hateCrimeTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Client Ref</th>
                <th className="py-3.5 px-4 font-semibold">Client Identity</th>
                <th className="py-3.5 px-4 font-semibold">Caseworker</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Borough & Source</th>
                <th className="py-3.5 px-4 font-semibold">Demographics</th>
                <th className="py-3.5 px-4 font-semibold">Risk & Type</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No client records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      {client.clientRef}
                    </td>

                    <td className="py-3.5 px-4">
                      {anonymizeView ? (
                        <div className="flex items-center gap-1.5 font-mono text-amber-300">
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          {client.initials} (Protected)
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-white">{client.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {client.initials}</div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {client.caseworker}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {client.dateReferred}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{client.borough}</div>
                      <div className="text-[10px] text-slate-400">{client.referralSource}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[11px]">
                      <div>{client.genderIdentity} • {client.ageGroup}</div>
                      <div className="text-slate-400 text-[10px]">{client.ethnicOrigin}</div>
                    </td>

                    <td className="py-3.5 px-4 space-y-1">
                      <div>
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
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {client.hateCrimeTypes.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={client.caseStatus === 'Active' ? 'primary' : 'neutral'} size="sm">
                        {client.caseStatus}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Client"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete client record ${client.clientRef}?`)) {
                              deleteClient(client.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Client"
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

      {/* Create / Edit Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? `Edit Client: ${editingClient.clientRef}` : 'New Client Intake Registration'}
        subtitle="One row per client journey. Feeds live into Outcome Tracker and Funder Reports."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Client Reference <span className="text-brand-400 font-mono">(Auto)</span>
              </label>
              <input
                type="text"
                required
                value={formData.clientRef}
                onChange={e => setFormData({ ...formData, clientRef: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-slate-500">(Confidential)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amara Okonjo"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initials / Anonymised ID
              </label>
              <input
                type="text"
                placeholder="e.g. AO"
                value={formData.initials}
                onChange={e => setFormData({ ...formData, initials: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-brand-500"
              />
            </div>
          </div>

          {/* Row 2: Caseworker & Journey Details */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date Referred</label>
              <input
                type="date"
                required
                value={formData.dateReferred}
                onChange={e => setFormData({ ...formData, dateReferred: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Case Status</label>
              <select
                value={formData.caseStatus}
                onChange={e => setFormData({ ...formData, caseStatus: e.target.value as CaseStatus })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.caseStatuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Risk Level</label>
              <select
                value={formData.riskLevel}
                onChange={e => setFormData({ ...formData, riskLevel: e.target.value as RiskLevel })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.riskLevels.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Location & Referral Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Borough</label>
              <select
                value={formData.borough}
                onChange={e => setFormData({ ...formData, borough: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.allBoroughs.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Referral Source</label>
              <select
                value={formData.referralSource}
                onChange={e => setFormData({ ...formData, referralSource: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.referralSources.map(rs => (
                  <option key={rs} value={rs}>{rs}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age Group</label>
              <select
                value={formData.ageGroup}
                onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.ageGroups.map(ag => (
                  <option key={ag} value={ag}>{ag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender Identity</label>
              <select
                value={formData.genderIdentity}
                onChange={e => setFormData({ ...formData, genderIdentity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ethnic Origin</label>
              <select
                value={formData.ethnicOrigin}
                onChange={e => setFormData({ ...formData, ethnicOrigin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.ethnicities.map(eth => (
                  <option key={eth} value={eth}>{eth}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Religion / Belief</label>
              <select
                value={formData.religion}
                onChange={e => setFormData({ ...formData, religion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                {settings.religions.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Nature of Incident */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Nature of Incident (Tick all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {settings.hateCrimeTypes.map(type => {
                const isSelected = formData.hateCrimeTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleToggleHateCrimeType(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {type}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isHarassmentASB}
                  onChange={e => setFormData({ ...formData, isHarassmentASB: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                />
                <span>Includes Persistent Harassment or Anti-Social Behaviour (ASB)</span>
              </label>
            </div>
          </div>

          {/* Row 6: Narrative & Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Presenting Issue & Allegation Summary
              </label>
              <textarea
                rows={2}
                placeholder="Brief factual summary of the incident and client needs..."
                value={formData.presentingIssue}
                onChange={e => setFormData({ ...formData, presentingIssue: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Internal Casework Notes & Action Plan
              </label>
              <textarea
                rows={2}
                placeholder="Next steps, legal referrals, safeguarding considerations..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          {/* Footer Submit */}
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
              {editingClient ? 'Save Changes' : 'Complete Intake'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
