import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  UserPlus,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VolunteerRecord, DBSStatus, ProjectYear } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { exportToExcel } from '../../utils/exportUtils';

export const VolunteerModule: React.FC = () => {
  const {
    volunteers,
    volunteerHours,
    settings,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    addVolunteerHour,
    deleteVolunteerHour
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'hours'>('roster');

  // Volunteer Profile Modal
  const [isVolModalOpen, setIsVolModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerRecord | null>(null);
  const [volFormData, setVolFormData] = useState<{
    volunteerRef: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    dateJoined: string;
    dbsStatus: DBSStatus;
    dbsExpiryDate: string;
    modulesCompleted: string[];
    notes: string;
  }>({
    volunteerRef: `VOL-00${volunteers.length + 1}`,
    fullName: '',
    email: '',
    phone: '',
    role: 'Casework Support Volunteer',
    status: 'Active',
    dateJoined: new Date().toISOString().slice(0, 10),
    dbsStatus: 'Valid',
    dbsExpiryDate: '2028-01-01',
    modulesCompleted: ['mod-1', 'mod-2'],
    notes: ''
  });

  // Hours Log Modal
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [hoursFormData, setHoursFormData] = useState<{
    volunteerId: string;
    volunteerName: string;
    date: string;
    hours: number;
    activityDescription: string;
    projectYear: ProjectYear;
    supervisor: string;
  }>({
    volunteerId: volunteers[0]?.id || '',
    volunteerName: volunteers[0]?.fullName || '',
    date: new Date().toISOString().slice(0, 10),
    hours: 4.0,
    activityDescription: 'Direct community outreach and client support session',
    projectYear: settings.currentYear,
    supervisor: settings.caseworkers[0] || 'Freda Ritchie'
  });

  const totalHours = useMemo(() => {
    return volunteers.reduce((acc, v) => acc + (v.totalHoursLogged || 0), 0);
  }, [volunteers]);

  const fullyTrainedCount = useMemo(() => {
    return volunteers.filter(v => v.modulesCompleted?.length >= 5).length;
  }, [volunteers]);

  const handleOpenNewVol = () => {
    setEditingVolunteer(null);
    setVolFormData({
      volunteerRef: `VOL-00${volunteers.length + 1}`,
      fullName: '',
      email: '',
      phone: '',
      role: 'Casework Support Volunteer',
      status: 'Active',
      dateJoined: new Date().toISOString().slice(0, 10),
      dbsStatus: 'Valid',
      dbsExpiryDate: '2028-01-01',
      modulesCompleted: ['mod-1', 'mod-2'],
      notes: ''
    });
    setIsVolModalOpen(true);
  };

  const handleOpenEditVol = (vol: VolunteerRecord) => {
    setEditingVolunteer(vol);
    setVolFormData({
      volunteerRef: vol.volunteerRef,
      fullName: vol.fullName,
      email: vol.email,
      phone: vol.phone,
      role: vol.role,
      status: vol.status,
      dateJoined: vol.dateJoined,
      dbsStatus: vol.dbsStatus,
      dbsExpiryDate: vol.dbsExpiryDate,
      modulesCompleted: vol.modulesCompleted || [],
      notes: vol.notes || ''
    });
    setIsVolModalOpen(true);
  };

  const handleVolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVolunteer) {
      updateVolunteer(editingVolunteer.id, volFormData);
    } else {
      addVolunteer({
        ...volFormData,
        totalHoursLogged: 0
      });
    }
    setIsVolModalOpen(false);
  };

  const handleHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVol = volunteers.find(v => v.id === hoursFormData.volunteerId);
    addVolunteerHour({
      ...hoursFormData,
      volunteerName: targetVol?.fullName || 'Volunteer'
    });
    setIsHoursModalOpen(false);
  };

  const handleExportData = () => {
    const volData = volunteers.map(v => ({
      'Volunteer Ref': v.volunteerRef,
      'Full Name': v.fullName,
      'Email': v.email,
      'Phone': v.phone,
      'Role': v.role,
      'Status': v.status,
      'Date Joined': v.dateJoined,
      'DBS Status': v.dbsStatus,
      'DBS Expiry': v.dbsExpiryDate,
      'Modules Completed': v.modulesCompleted?.length || 0,
      'Total Hours Logged': v.totalHoursLogged,
      'Notes': v.notes || ''
    }));

    const hoursData = volunteerHours.map(h => ({
      'Date': h.date,
      'Volunteer Name': h.volunteerName,
      'Hours': h.hours,
      'Activity Description': h.activityDescription,
      'Project Year': h.projectYear,
      'Supervisor': h.supervisor
    }));

    exportToExcel(
      [
        { sheetName: 'Volunteer Roster', data: volData },
        { sheetName: 'Hours Log', data: hoursData }
      ],
      'WLEC_Volunteer_Management_Register'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Volunteer Management & DBS Ledger</h2>
            <Badge variant="primary" size="sm">{volunteers.length} Registered Volunteers</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track volunteer profiles, DBS certifications, training status, and contribution hours.
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
            onClick={() => setIsHoursModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Clock className="w-4 h-4 text-brand-400" />
            Log Hours
          </button>
          <button
            onClick={handleOpenNewVol}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
          >
            <UserPlus className="w-4 h-4" />
            + New Volunteer
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Total Volunteers Registered</div>
          <div className="text-2xl font-bold text-white">{volunteers.length}</div>
          <div className="text-[10px] text-emerald-400 font-medium">100% Onboarded</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Currently Active Roster</div>
          <div className="text-2xl font-bold text-brand-400">
            {volunteers.filter(v => v.status === 'Active').length}
          </div>
          <div className="text-[10px] text-slate-400">Deployable for Casework</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">Total Hours Volunteered</div>
          <div className="text-2xl font-bold text-purple-400">{totalHours} hrs</div>
          <div className="text-[10px] text-slate-400">Community Contribution</div>
        </div>

        <div className="glass-card rounded-xl p-4 space-y-1">
          <div className="text-[11px] text-slate-400">DBS Compliance Health</div>
          <div className="text-2xl font-bold text-emerald-400">
            {volunteers.filter(v => v.dbsStatus === 'Valid').length} / {volunteers.length}
          </div>
          <div className="text-[10px] text-slate-400">Valid Certifications</div>
        </div>
      </div>

      {/* Sub-tabs toggle */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'roster'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Volunteer Profiles & DBS Status ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('hours')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'hours'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Hours Log Ledger ({volunteerHours.length} Entries)
        </button>
      </div>

      {/* Tab 1: Roster Table */}
      {activeSubTab === 'roster' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Full Name</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Contact</th>
                  <th className="py-3.5 px-4 font-semibold">DBS Status</th>
                  <th className="py-3.5 px-4 font-semibold">Modules</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Hours Logged</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {volunteers.map(vol => (
                  <tr key={vol.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      {vol.volunteerRef}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {vol.fullName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {vol.role}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      <div>{vol.email}</div>
                      <div>{vol.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <Badge
                          variant={
                            vol.dbsStatus === 'Valid'
                              ? 'success'
                              : vol.dbsStatus === 'Pending'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {vol.dbsStatus}
                        </Badge>
                        <div className="text-[10px] text-slate-500 font-mono">Exp: {vol.dbsExpiryDate}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-cyan-300">
                        {vol.modulesCompleted?.length || 0} / 8 Modules
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-white font-mono text-sm">
                      {vol.totalHoursLogged} hrs
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={vol.status === 'Active' ? 'primary' : 'neutral'} size="sm">
                        {vol.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditVol(vol)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Volunteer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete volunteer ${vol.fullName}?`)) {
                              deleteVolunteer(vol.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Volunteer"
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
      )}

      {/* Tab 2: Hours Log Ledger */}
      {activeSubTab === 'hours' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Volunteer Name</th>
                  <th className="py-3.5 px-4 font-semibold">Activity & Contribution</th>
                  <th className="py-3.5 px-4 text-center font-semibold">Hours</th>
                  <th className="py-3.5 px-4 font-semibold">Year</th>
                  <th className="py-3.5 px-4 font-semibold">Supervisor</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {volunteerHours.map(hour => (
                  <tr key={hour.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400">{hour.date}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{hour.volunteerName}</td>
                    <td className="py-3.5 px-4 text-slate-200">{hour.activityDescription}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400 text-sm">
                      {hour.hours} hrs
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{hour.projectYear}</td>
                    <td className="py-3.5 px-4 text-slate-300">{hour.supervisor}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteVolunteerHour(hour.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Volunteer Modal */}
      <Modal
        isOpen={isVolModalOpen}
        onClose={() => setIsVolModalOpen(false)}
        title={editingVolunteer ? `Edit Volunteer: ${editingVolunteer.fullName}` : 'Register New Volunteer'}
        subtitle="Manage volunteer credentials, DBS certifications, and completed training modules."
        maxWidth="2xl"
      >
        <form onSubmit={handleVolSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={volFormData.fullName}
                onChange={e => setVolFormData({ ...volFormData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Volunteer Reference</label>
              <input
                type="text"
                required
                value={volFormData.volunteerRef}
                onChange={e => setVolFormData({ ...volFormData, volunteerRef: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-brand-400 font-mono focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={volFormData.email}
                onChange={e => setVolFormData({ ...volFormData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={volFormData.phone}
                onChange={e => setVolFormData({ ...volFormData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
              <input
                type="text"
                required
                value={volFormData.role}
                onChange={e => setVolFormData({ ...volFormData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">DBS Status</label>
              <select
                value={volFormData.dbsStatus}
                onChange={e => setVolFormData({ ...volFormData, dbsStatus: e.target.value as DBSStatus })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              >
                <option value="Valid">Valid (Enhanced)</option>
                <option value="Pending">Pending Check</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">DBS Expiry Date</label>
              <input
                type="date"
                required
                value={volFormData.dbsExpiryDate}
                onChange={e => setVolFormData({ ...volFormData, dbsExpiryDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Special Skills / Notes</label>
            <textarea
              rows={2}
              value={volFormData.notes}
              onChange={e => setVolFormData({ ...volFormData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsVolModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              {editingVolunteer ? 'Save Changes' : 'Save Volunteer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Hours Log Modal */}
      <Modal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
        title="Log Volunteer Contribution Hours"
        subtitle="Records volunteer time for project KPI summaries and funder reporting."
        maxWidth="lg"
      >
        <form onSubmit={handleHoursSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Volunteer</label>
            <select
              value={hoursFormData.volunteerId}
              onChange={e => setHoursFormData({ ...hoursFormData, volunteerId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            >
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>
                  {v.fullName} ({v.volunteerRef}) - {v.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={hoursFormData.date}
                onChange={e => setHoursFormData({ ...hoursFormData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Volunteered</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                required
                value={hoursFormData.hours}
                onChange={e => setHoursFormData({ ...hoursFormData, hours: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-bold focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Description</label>
            <textarea
              rows={2}
              required
              value={hoursFormData.activityDescription}
              onChange={e => setHoursFormData({ ...hoursFormData, activityDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsHoursModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-brand transition-all"
            >
              Save Hours
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
