// ============================================
// AMOGED-D4 - TypeScript Types & Interfaces
// Domain-Driven Design Type Definitions
// ============================================

// ─── ENUMS ───────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'CITIZEN';

export type ReportStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'CANCELLED';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WasteCategory =
  | 'HOUSEHOLD'
  | 'INDUSTRIAL'
  | 'MEDICAL'
  | 'ELECTRONIC'
  | 'CONSTRUCTION'
  | 'ORGANIC'
  | 'ILLEGAL_DUMPING'
  | 'DRAIN_BLOCKAGE'
  | 'OTHER';

export type InterventionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type NotificationType =
  | 'REPORT_CREATED'
  | 'REPORT_ASSIGNED'
  | 'REPORT_IN_PROGRESS'
  | 'REPORT_RESOLVED'
  | 'REPORT_REJECTED'
  | 'INTERVENTION_ASSIGNED'
  | 'INTERVENTION_COMPLETED'
  | 'REWARD_REQUESTED'
  | 'REWARD_VALIDATED'
  | 'REWARD_REJECTED'
  | 'SYSTEM'
  | 'ALERT'
  | 'INFO';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type AgentStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE' | 'ON_MISSION';

export type VehicleType = 'TRUCK' | 'MINIVAN' | 'MOTORCYCLE' | 'TRICYCLE';

export type CollectionZone =
  | 'BONABERI'
  | 'BOJONGO'
  | 'MABANDA'
  | 'SODIKO'
  | 'NKOMBA'
  | 'GRAND_HANGAR'
  | 'BONASSAMA'
  | 'MAMBANDA';

export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'fr' | 'en';

// ─── GEOLOCATION ──────────────────────────────────────────────────────────────

export interface GeoPoint {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
  zone?: CollectionZone;
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  zone?: CollectionZone;
  address?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  stats?: UserStats;
}

export interface UserStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  points: number;
  rank?: string;
}

export interface Agent extends User {
  agentId: string;
  status: AgentStatus;
  specialization: WasteCategory[];
  assignedZone: CollectionZone;
  vehicleType?: VehicleType;
  vehiclePlate?: string;
  supervisor?: string;
  activeInterventions: number;
  completedInterventions: number;
  rating?: number;
}

// ─── REPORT ───────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  category: WasteCategory;
  urgency: UrgencyLevel;
  status: ReportStatus;
  location: GeoPoint;
  photos: string[];
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  interventionId?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  rejectionReason?: string;
  timeline: ReportTimelineEvent[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
  estimatedResolutionTime?: string;
  tags?: string[];
}

export interface ReportTimelineEvent {
  id: string;
  status: ReportStatus;
  message: string;
  author: string;
  authorRole: UserRole;
  timestamp: string;
  photo?: string;
}

// ─── INTERVENTION ─────────────────────────────────────────────────────────────

export interface Intervention {
  id: string;
  referenceNumber: string;
  reportIds: string[];
  title: string;
  description: string;
  status: InterventionStatus;
  priority: UrgencyLevel;
  assignedAgentIds: string[];
  supervisorId: string;
  supervisorName: string;
  zone: CollectionZone;
  location: GeoPoint;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  equipment: string[];
  notes?: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// ─── COLLECTION SCHEDULE ──────────────────────────────────────────────────────

export interface CollectionSchedule {
  id: string;
  zone: CollectionZone;
  zoneName: string;
  dayOfWeek: number[]; // 0=Sunday, 1=Monday...
  startTime: string;
  endTime: string;
  frequency: 'DAILY' | 'TWICE_WEEKLY' | 'WEEKLY' | 'BI_WEEKLY';
  assignedTeam: string[];
  coverageArea: string;
  nextCollection: string;
  isActive: boolean;
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  timestamp: string;
}

// ─── STATS ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
  todayReports: number;
  weekReports: number;
  monthReports: number;
  averageResolutionTime: number; // hours
  resolutionRate: number; // percentage
  activeAgents: number;
  activeInterventions: number;
  citizenSatisfaction: number; // 1-5
  reportsByZone: { zone: CollectionZone; count: number }[];
  reportsByCategory: { category: WasteCategory; count: number }[];
  reportsByStatus: { status: ReportStatus; count: number }[];
  reportsTrend: { date: string; count: number }[];
  interventionsTrend: { date: string; count: number }[];
  topReportingZones: { zone: string; count: number }[];
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  zone?: CollectionZone;
  address?: string;
  agreeTerms: boolean;
}

// ─── API RESPONSE ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  zone?: CollectionZone;
  category?: WasteCategory;
  urgency?: UrgencyLevel;
  startDate?: string;
  endDate?: string;
  agentId?: string;
  citizenId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── FORM TYPES ───────────────────────────────────────────────────────────────

export interface CreateReportForm {
  title: string;
  description: string;
  category: WasteCategory;
  urgency: UrgencyLevel;
  address: string;
  lat?: number;
  lng?: number;
  photos?: FileList;
}

export interface CreateInterventionForm {
  reportIds: string[];
  title: string;
  description: string;
  priority: UrgencyLevel;
  agentIds: string[];
  scheduledAt: string;
  estimatedDuration: number;
  equipment: string[];
}

// ─── SYSTEM SETTINGS ──────────────────────────────────────────────────────────

export interface SystemSettings {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxPhotosPerReport: number;
  maxReportsPerDay: number;
  defaultLanguage: Language;
  supportedZones: CollectionZone[];
  emergencyContact: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

// ─── CHART DATA ───────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  reports: number;
  interventions?: number;
  resolved?: number;
}

// ─── REWARDS ──────────────────────────────────────────────────────────────────

export type RewardStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
  category: 'BON' | 'GOODIES' | 'SERVICE' | 'TECH' | 'INTERNET';
  isAvailable: boolean;
}

export interface RewardRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  status: RewardStatus;
  createdAt: string;
  validatedAt?: string;
  validatedBy?: string;
}
