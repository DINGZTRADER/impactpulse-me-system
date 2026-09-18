export type RiskLevel = 'High' | 'Medium' | 'Low';
export type CaseStatus = 'Active' | 'Closed' | 'Pending' | 'Transferred';
export type AssessmentStage = 'Intake' | '3 Months' | '6 Months' | 'Closure' | 'Funder Review';
export type ProjectYear = 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5';
export type ReferralType = 'Incoming' | 'Outgoing';
export type DBSStatus = 'Valid' | 'Pending' | 'Expired';
export type RiskStatus = 'Active' | 'Mitigated' | 'Monitor' | 'Closed';

export interface OutcomeDefinition {
  id: string; // e.g. 'O1', 'O2', 'O3', 'O4', 'O5'
  code: string; // 'O1'
  title: string;
  description: string;
  category: string;
  targetPercent: number; // e.g. 80%
}

export interface ActivityTarget {
  id: string;
  key: string;
  title: string;
  category: string;
  y1Target: number;
  y2Target: number;
  y3Target: number;
  y4Target: number;
  y5Target: number;
  unit: string;
}

export interface TrainingModuleMeta {
  id: string;
  code: string;
  title: string;
  description: string;
  defaultHours: number;
  targetAudience: string;
}

export interface ProjectSettings {
  id: string;
  projectName: string;
  leadOrganisation: string;
  funderName: string;
  totalFunding: string; // e.g. '£480,801'
  projectStartDate: string; // '2025-11-01'
  projectEndDate: string; // '2030-10-31'
  projectDuration: string; // '5 Years (Nov 2025 - Oct 2030)'
  currentYear: ProjectYear;
  annualClientTarget: number; // 50
  fiveYearClientTarget: number; // 250
  contactEmail: string;
  primaryBoroughs: string[];
  allBoroughs: string[];
  referralSources: string[];
  caseworkers: string[];
  ageGroups: string[];
  genders: string[];
  ethnicities: string[];
  religions: string[];
  hateCrimeTypes: string[];
  riskLevels: RiskLevel[];
  caseStatuses: CaseStatus[];
  outcomes: OutcomeDefinition[];
  activityTargets: ActivityTarget[];
  trainingModules: TrainingModuleMeta[];
}

export interface ClientRecord {
  id: string;
  clientRef: string; // 'HC/1' or 'HCSP-001'
  fullName: string;
  initials: string;
  caseworker: string;
  dateReferred: string; // 'YYYY-MM-DD'
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
  presentingIssue?: string;
  notes?: string;
  dateClosed?: string;
}

export interface OutcomeRecord {
  id: string;
  clientRef: string;
  assessmentDate: string;
  assessmentStage: AssessmentStage;
  caseworker: string;
  o1LegalAccess: boolean;
  o2ConfidentToReport: boolean;
  o3PartnershipEngaged: boolean;
  o4AwarenessIncreased: boolean;
  o5CommunitySolution: boolean;
  satisfactionRating?: number; // 1-5
  knowledgeScorePre?: number; // 1-10
  knowledgeScorePost?: number; // 1-10
  reportedToPolice: boolean;
  partnerReferred?: string;
  projectYear: ProjectYear;
  notes?: string;
}

export interface ReferralRecord {
  id: string;
  clientRef?: string;
  date: string;
  type: ReferralType;
  sourceCategory: string;
  partnerOrgName: string;
  reason: string;
  caseworker: string;
  status: 'Accepted' | 'Pending' | 'Completed' | 'Declined';
  projectYear: ProjectYear;
  notes?: string;
}

export interface VolunteerRecord {
  id: string;
  volunteerRef: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  dateJoined: string;
  dbsStatus: DBSStatus;
  dbsExpiryDate: string;
  modulesCompleted: string[]; // module IDs
  totalHoursLogged: number;
  notes?: string;
}

export interface VolunteerHourLog {
  id: string;
  volunteerId: string;
  volunteerName: string;
  date: string;
  hours: number;
  activityDescription: string;
  projectYear: ProjectYear;
  supervisor: string;
}

export interface TrainingSessionRecord {
  id: string;
  date: string;
  trainingTitle: string;
  moduleId?: string;
  topicContent: string;
  audience: 'Staff' | 'Volunteers' | 'Staff & Volunteers' | 'Community & Volunteers' | 'Staff & Partners' | 'Public';
  projectYear: ProjectYear;
  deliveredBy: string;
  location: string;
  participantsCount: number;
  hours: number;
  borough: string;
  deliveryMethod: 'In-person' | 'Online' | 'Hybrid';
  preAssessmentScore?: number; // 1-5
  postAssessmentScore?: number; // 1-5
  certificateIssued: boolean;
  feedbackRatingAvg?: number; // 1-5
  notes?: string;
}

export interface RiskRecord {
  id: string;
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
}

export interface CaseStudyRecord {
  id: string;
  clientRef: string;
  title: string;
  theme: string;
  consentObtained: boolean;
  contextChallenge: string;
  interventionSupport: string;
  outcomesTransformation: string;
  clientQuotes: string;
  caseworkerReflection: string;
  dateCreated: string;
  author: string;
}

export interface QuarterlyNarrative {
  quarterKey: string; // e.g. 'Q1 2025-26'
  reportingPeriod: string; // '01 Apr 2026 to 30 Jun 2026'
  funderName: string;
  executiveSummary: string;
  keyHighlights: string;
  outcomeAnalysis: string;
  challengesAndMitigations: string;
  prioritiesNextQuarter: string;
  caseworkerNotes: string;
}
