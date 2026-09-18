import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ProjectSettings,
  ClientRecord,
  OutcomeRecord,
  ReferralRecord,
  VolunteerRecord,
  VolunteerHourLog,
  TrainingSessionRecord,
  RiskRecord,
  CaseStudyRecord,
  QuarterlyNarrative,
  AssessmentStage
} from '../types';
import {
  defaultSettings,
  initialClients,
  initialOutcomes,
  initialReferrals,
  initialVolunteers,
  initialVolunteerHours,
  initialTrainingSessions,
  initialRisks,
  initialCaseStudies,
  initialQuarterlyNarrative
} from '../data/defaultData';

interface DashboardStats {
  totalClients: number;
  activeCases: number;
  closedCases: number;
  highRiskCases: number;
  percentEaling: number;
  percentHillingdon: number;
  percentHounslow: number;
  percentOther: number;
  percentFemale: number;
  totalVolunteerHours: number;
  activeVolunteers: number;
  totalTrainingSessions: number;
  totalTrainingParticipants: number;
  totalReferrals: number;
  o1AchievementRate: number;
  o2AchievementRate: number;
  o3AchievementRate: number;
  o4AchievementRate: number;
  o5AchievementRate: number;
  averageSatisfaction: number;
  averagePreScore: number;
  averagePostScore: number;
  avgKnowledgeDelta: number;
}

interface AppContextType {
  settings: ProjectSettings;
  updateSettings: (newSettings: Partial<ProjectSettings>) => void;
  resetToDefaultData: () => void;

  // Clients
  clients: ClientRecord[];
  addClient: (client: Omit<ClientRecord, 'id'>) => ClientRecord;
  updateClient: (id: string, updates: Partial<ClientRecord>) => void;
  deleteClient: (id: string) => void;
  anonymizeView: boolean;
  setAnonymizeView: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Outcomes
  outcomes: OutcomeRecord[];
  addOutcome: (outcome: Omit<OutcomeRecord, 'id'>) => OutcomeRecord;
  updateOutcome: (id: string, updates: Partial<OutcomeRecord>) => void;
  deleteOutcome: (id: string) => void;

  // Referrals
  referrals: ReferralRecord[];
  addReferral: (referral: Omit<ReferralRecord, 'id'>) => ReferralRecord;
  updateReferral: (id: string, updates: Partial<ReferralRecord>) => void;
  deleteReferral: (id: string) => void;

  // Volunteers
  volunteers: VolunteerRecord[];
  addVolunteer: (vol: Omit<VolunteerRecord, 'id'>) => VolunteerRecord;
  updateVolunteer: (id: string, updates: Partial<VolunteerRecord>) => void;
  deleteVolunteer: (id: string) => void;

  // Volunteer Hours
  volunteerHours: VolunteerHourLog[];
  addVolunteerHour: (hour: Omit<VolunteerHourLog, 'id'>) => VolunteerHourLog;
  deleteVolunteerHour: (id: string) => void;

  // Training Sessions
  trainingSessions: TrainingSessionRecord[];
  addTrainingSession: (session: Omit<TrainingSessionRecord, 'id'>) => TrainingSessionRecord;
  updateTrainingSession: (id: string, updates: Partial<TrainingSessionRecord>) => void;
  deleteTrainingSession: (id: string) => void;

  // Risks
  risks: RiskRecord[];
  addRisk: (risk: Omit<RiskRecord, 'id'>) => RiskRecord;
  updateRisk: (id: string, updates: Partial<RiskRecord>) => void;
  deleteRisk: (id: string) => void;

  // Case Studies
  caseStudies: CaseStudyRecord[];
  addCaseStudy: (study: Omit<CaseStudyRecord, 'id'>) => CaseStudyRecord;
  updateCaseStudy: (id: string, updates: Partial<CaseStudyRecord>) => void;
  deleteCaseStudy: (id: string) => void;

  // Quarterly Narrative
  quarterlyNarrative: QuarterlyNarrative;
  updateQuarterlyNarrative: (updates: Partial<QuarterlyNarrative>) => void;

  // Computed stats
  stats: DashboardStats;

  // Export / Backup / Template Switcher
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;

  // Toast / notification feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEYS = {
  SETTINGS: 'impactpulse_me_settings',
  CLIENTS: 'impactpulse_me_clients',
  OUTCOMES: 'impactpulse_me_outcomes',
  REFERRALS: 'impactpulse_me_referrals',
  VOLUNTEERS: 'impactpulse_me_volunteers',
  VOL_HOURS: 'impactpulse_me_vol_hours',
  TRAINING: 'impactpulse_me_training',
  RISKS: 'impactpulse_me_risks',
  CASE_STUDIES: 'impactpulse_me_case_studies',
  NARRATIVE: 'impactpulse_me_narrative',
  ANONYMIZE: 'impactpulse_me_anonymize'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ProjectSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [clients, setClients] = useState<ClientRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OUTCOMES);
    return saved ? JSON.parse(saved) : initialOutcomes;
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return saved ? JSON.parse(saved) : initialReferrals;
  });

  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    return saved ? JSON.parse(saved) : initialVolunteers;
  });

  const [volunteerHours, setVolunteerHours] = useState<VolunteerHourLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOL_HOURS);
    return saved ? JSON.parse(saved) : initialVolunteerHours;
  });

  const [trainingSessions, setTrainingSessions] = useState<TrainingSessionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRAINING);
    return saved ? JSON.parse(saved) : initialTrainingSessions;
  });

  const [risks, setRisks] = useState<RiskRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RISKS);
    return saved ? JSON.parse(saved) : initialRisks;
  });

  const [caseStudies, setCaseStudies] = useState<CaseStudyRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASE_STUDIES);
    return saved ? JSON.parse(saved) : initialCaseStudies;
  });

  const [quarterlyNarrative, setQuarterlyNarrative] = useState<QuarterlyNarrative>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NARRATIVE);
    return saved ? JSON.parse(saved) : initialQuarterlyNarrative;
  });

  const [anonymizeView, setAnonymizeView] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANONYMIZE);
    return saved ? JSON.parse(saved) : false;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OUTCOMES, JSON.stringify(outcomes));
  }, [outcomes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOL_HOURS, JSON.stringify(volunteerHours));
  }, [volunteerHours]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify(trainingSessions));
  }, [trainingSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(risks));
  }, [risks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(caseStudies));
  }, [caseStudies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NARRATIVE, JSON.stringify(quarterlyNarrative));
  }, [quarterlyNarrative]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANONYMIZE, JSON.stringify(anonymizeView));
  }, [anonymizeView]);

  // Client actions
  const addClient = (clientData: Omit<ClientRecord, 'id'>): ClientRecord => {
    const newClient: ClientRecord = {
      ...clientData,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setClients(prev => [newClient, ...prev]);
    showToast(`Client ${newClient.clientRef} registered successfully`);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<ClientRecord>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Client profile updated');
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('Client record deleted');
  };

  // Outcome actions
  const addOutcome = (outcomeData: Omit<OutcomeRecord, 'id'>): OutcomeRecord => {
    const newOutcome: OutcomeRecord = {
      ...outcomeData,
      id: `out-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setOutcomes(prev => [newOutcome, ...prev]);
    showToast(`Outcome assessment for ${newOutcome.clientRef} logged`);
    return newOutcome;
  };

  const updateOutcome = (id: string, updates: Partial<OutcomeRecord>) => {
    setOutcomes(prev => prev.map(o => (o.id === id ? { ...o, ...updates } : o)));
    showToast('Outcome assessment updated');
  };

  const deleteOutcome = (id: string) => {
    setOutcomes(prev => prev.filter(o => o.id !== id));
    showToast('Outcome record deleted');
  };

  // Referral actions
  const addReferral = (referralData: Omit<ReferralRecord, 'id'>): ReferralRecord => {
    const newReferral: ReferralRecord = {
      ...referralData,
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setReferrals(prev => [newReferral, ...prev]);
    showToast('Referral logged successfully');
    return newReferral;
  };

  const updateReferral = (id: string, updates: Partial<ReferralRecord>) => {
    setReferrals(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Referral updated');
  };

  const deleteReferral = (id: string) => {
    setReferrals(prev => prev.filter(r => r.id !== id));
    showToast('Referral removed');
  };

  // Volunteer actions
  const addVolunteer = (volData: Omit<VolunteerRecord, 'id'>): VolunteerRecord => {
    const newVol: VolunteerRecord = {
      ...volData,
      id: `vol-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setVolunteers(prev => [newVol, ...prev]);
    showToast(`Volunteer ${newVol.fullName} registered`);
    return newVol;
  };

  const updateVolunteer = (id: string, updates: Partial<VolunteerRecord>) => {
    setVolunteers(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
    showToast('Volunteer updated');
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    showToast('Volunteer removed');
  };

  // Volunteer Hours actions
  const addVolunteerHour = (hourData: Omit<VolunteerHourLog, 'id'>): VolunteerHourLog => {
    const newHour: VolunteerHourLog = {
      ...hourData,
      id: `vh-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setVolunteerHours(prev => [newHour, ...prev]);
    // update volunteer totalHoursLogged
    setVolunteers(prev =>
      prev.map(v =>
        v.id === hourData.volunteerId ? { ...v, totalHoursLogged: (v.totalHoursLogged || 0) + hourData.hours } : v
      )
    );
    showToast(`${hourData.hours} hours logged for ${hourData.volunteerName}`);
    return newHour;
  };

  const deleteVolunteerHour = (id: string) => {
    const target = volunteerHours.find(h => h.id === id);
    if (target) {
      setVolunteers(prev =>
        prev.map(v =>
          v.id === target.volunteerId ? { ...v, totalHoursLogged: Math.max(0, (v.totalHoursLogged || 0) - target.hours) } : v
        )
      );
    }
    setVolunteerHours(prev => prev.filter(h => h.id !== id));
    showToast('Hours log entry removed');
  };

  // Training Session actions
  const addTrainingSession = (sessData: Omit<TrainingSessionRecord, 'id'>): TrainingSessionRecord => {
    const newSess: TrainingSessionRecord = {
      ...sessData,
      id: `ts-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setTrainingSessions(prev => [newSess, ...prev]);
    showToast(`Training session "${newSess.trainingTitle}" registered`);
    return newSess;
  };

  const updateTrainingSession = (id: string, updates: Partial<TrainingSessionRecord>) => {
    setTrainingSessions(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Training session updated');
  };

  const deleteTrainingSession = (id: string) => {
    setTrainingSessions(prev => prev.filter(s => s.id !== id));
    showToast('Training session removed');
  };

  // Risk actions
  const addRisk = (riskData: Omit<RiskRecord, 'id'>): RiskRecord => {
    const newRisk: RiskRecord = {
      ...riskData,
      id: `r-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setRisks(prev => [newRisk, ...prev]);
    showToast('Risk register updated with new entry');
    return newRisk;
  };

  const updateRisk = (id: string, updates: Partial<RiskRecord>) => {
    setRisks(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Risk item updated');
  };

  const deleteRisk = (id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
    showToast('Risk item removed');
  };

  // Case Study actions
  const addCaseStudy = (studyData: Omit<CaseStudyRecord, 'id'>): CaseStudyRecord => {
    const newStudy: CaseStudyRecord = {
      ...studyData,
      id: `cs-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setCaseStudies(prev => [newStudy, ...prev]);
    showToast('Case study published');
    return newStudy;
  };

  const updateCaseStudy = (id: string, updates: Partial<CaseStudyRecord>) => {
    setCaseStudies(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Case study updated');
  };

  const deleteCaseStudy = (id: string) => {
    setCaseStudies(prev => prev.filter(c => c.id !== id));
    showToast('Case study deleted');
  };

  // Settings & Narrative
  const updateSettings = (newSettings: Partial<ProjectSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Project configuration saved');
  };

  const updateQuarterlyNarrative = (updates: Partial<QuarterlyNarrative>) => {
    setQuarterlyNarrative(prev => ({ ...prev, ...updates }));
    showToast('Quarterly report narrative updated');
  };

  const resetToDefaultData = () => {
    setSettings(defaultSettings);
    setClients(initialClients);
    setOutcomes(initialOutcomes);
    setReferrals(initialReferrals);
    setVolunteers(initialVolunteers);
    setVolunteerHours(initialVolunteerHours);
    setTrainingSessions(initialTrainingSessions);
    setRisks(initialRisks);
    setCaseStudies(initialCaseStudies);
    setQuarterlyNarrative(initialQuarterlyNarrative);
    setAnonymizeView(false);
    showToast('System reset to WLEC Hate Crime Support Project default data');
  };

  // Export / Import
  const exportBackupJSON = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      clients,
      outcomes,
      referrals,
      volunteers,
      volunteerHours,
      trainingSessions,
      risks,
      caseStudies,
      quarterlyNarrative
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${settings.projectName.replace(/\s+/g, '_')}_ME_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Full system database backup downloaded');
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings && data.clients && data.outcomes) {
        if (data.settings) setSettings(data.settings);
        if (data.clients) setClients(data.clients);
        if (data.outcomes) setOutcomes(data.outcomes);
        if (data.referrals) setReferrals(data.referrals);
        if (data.volunteers) setVolunteers(data.volunteers);
        if (data.volunteerHours) setVolunteerHours(data.volunteerHours);
        if (data.trainingSessions) setTrainingSessions(data.trainingSessions);
        if (data.risks) setRisks(data.risks);
        if (data.caseStudies) setCaseStudies(data.caseStudies);
        if (data.quarterlyNarrative) setQuarterlyNarrative(data.quarterlyNarrative);
        showToast('System database restored successfully!');
        return true;
      }
      throw new Error('Invalid backup schema');
    } catch (err) {
      showToast('Error importing backup file. Please check format.');
      return false;
    }
  };

  // Dynamic Dashboard Stats Calculations
  const stats = useMemo<DashboardStats>(() => {
    const totalClients = clients.length;
    const activeCases = clients.filter(c => c.caseStatus === 'Active').length;
    const closedCases = clients.filter(c => c.caseStatus === 'Closed').length;
    const highRiskCases = clients.filter(c => c.riskLevel === 'High').length;

    const ealingCount = clients.filter(c => c.borough.toLowerCase().includes('ealing')).length;
    const hillingdonCount = clients.filter(c => c.borough.toLowerCase().includes('hillingdon')).length;
    const hounslowCount = clients.filter(c => c.borough.toLowerCase().includes('hounslow')).length;
    const otherBoroughCount = totalClients - (ealingCount + hillingdonCount + hounslowCount);

    const femaleCount = clients.filter(c => c.genderIdentity.toLowerCase() === 'female').length;

    const percentEaling = totalClients > 0 ? Math.round((ealingCount / totalClients) * 100) : 0;
    const percentHillingdon = totalClients > 0 ? Math.round((hillingdonCount / totalClients) * 100) : 0;
    const percentHounslow = totalClients > 0 ? Math.round((hounslowCount / totalClients) * 100) : 0;
    const percentOther = totalClients > 0 ? Math.round((otherBoroughCount / totalClients) * 100) : 0;
    const percentFemale = totalClients > 0 ? Math.round((femaleCount / totalClients) * 100) : 0;

    const totalVolunteerHours = volunteers.reduce((acc, v) => acc + (v.totalHoursLogged || 0), 0);
    const activeVolunteers = volunteers.filter(v => v.status === 'Active').length;

    const totalTrainingSessions = trainingSessions.length;
    const totalTrainingParticipants = trainingSessions.reduce((acc, s) => acc + (s.participantsCount || 0), 0);

    const totalReferrals = referrals.length;

    // Outcome achievement calculations (calculated on unique clients who achieved the outcome at least once)
    const clientsWithO1 = new Set(outcomes.filter(o => o.o1LegalAccess).map(o => o.clientRef)).size;
    const clientsWithO2 = new Set(outcomes.filter(o => o.o2ConfidentToReport).map(o => o.clientRef)).size;
    const clientsWithO3 = new Set(outcomes.filter(o => o.o3PartnershipEngaged).map(o => o.clientRef)).size;
    const clientsWithO4 = new Set(outcomes.filter(o => o.o4AwarenessIncreased).map(o => o.clientRef)).size;
    const clientsWithO5 = new Set(outcomes.filter(o => o.o5CommunitySolution).map(o => o.clientRef)).size;

    const o1AchievementRate = totalClients > 0 ? Math.round((clientsWithO1 / totalClients) * 100) : 0;
    const o2AchievementRate = totalClients > 0 ? Math.round((clientsWithO2 / totalClients) * 100) : 0;
    const o3AchievementRate = totalClients > 0 ? Math.round((clientsWithO3 / totalClients) * 100) : 0;
    const o4AchievementRate = totalClients > 0 ? Math.round((clientsWithO4 / totalClients) * 100) : 0;
    const o5AchievementRate = totalClients > 0 ? Math.round((clientsWithO5 / totalClients) * 100) : 0;

    // Averages
    const satRatings = outcomes.filter(o => o.satisfactionRating).map(o => o.satisfactionRating!);
    const averageSatisfaction = satRatings.length > 0 ? Number((satRatings.reduce((a, b) => a + b, 0) / satRatings.length).toFixed(1)) : 4.8;

    const preScores = outcomes.filter(o => o.knowledgeScorePre).map(o => o.knowledgeScorePre!);
    const averagePreScore = preScores.length > 0 ? Number((preScores.reduce((a, b) => a + b, 0) / preScores.length).toFixed(1)) : 3.2;

    const postScores = outcomes.filter(o => o.knowledgeScorePost).map(o => o.knowledgeScorePost!);
    const averagePostScore = postScores.length > 0 ? Number((postScores.reduce((a, b) => a + b, 0) / postScores.length).toFixed(1)) : 8.1;

    const avgKnowledgeDelta = Number((averagePostScore - averagePreScore).toFixed(1));

    return {
      totalClients,
      activeCases,
      closedCases,
      highRiskCases,
      percentEaling,
      percentHillingdon,
      percentHounslow,
      percentOther,
      percentFemale,
      totalVolunteerHours,
      activeVolunteers,
      totalTrainingSessions,
      totalTrainingParticipants,
      totalReferrals,
      o1AchievementRate,
      o2AchievementRate,
      o3AchievementRate,
      o4AchievementRate,
      o5AchievementRate,
      averageSatisfaction,
      averagePreScore,
      averagePostScore,
      avgKnowledgeDelta
    };
  }, [clients, outcomes, volunteers, trainingSessions, referrals]);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefaultData,
        clients,
        addClient,
        updateClient,
        deleteClient,
        anonymizeView,
        setAnonymizeView,
        outcomes,
        addOutcome,
        updateOutcome,
        deleteOutcome,
        referrals,
        addReferral,
        updateReferral,
        deleteReferral,
        volunteers,
        addVolunteer,
        updateVolunteer,
        deleteVolunteer,
        volunteerHours,
        addVolunteerHour,
        deleteVolunteerHour,
        trainingSessions,
        addTrainingSession,
        updateTrainingSession,
        deleteTrainingSession,
        risks,
        addRisk,
        updateRisk,
        deleteRisk,
        caseStudies,
        addCaseStudy,
        updateCaseStudy,
        deleteCaseStudy,
        quarterlyNarrative,
        updateQuarterlyNarrative,
        stats,
        exportBackupJSON,
        importBackupJSON,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
