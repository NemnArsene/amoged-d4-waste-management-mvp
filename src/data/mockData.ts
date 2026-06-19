// ============================================
// AMOGED-D4 - Données Mock Réalistes
// Douala 4ème Arrondissement
// ============================================

import type {
  User, Agent, Report, Intervention, Notification,
  CollectionSchedule, AuditLog, DashboardStats,
  UserRole, ReportStatus, WasteCategory, UrgencyLevel,
  CollectionZone, AgentStatus, NotificationType,
  InterventionStatus, ReportTimelineEvent
} from '../types';

// ─── ZONES DOUALA 4ÈME ────────────────────────────────────────────────────────

export const ZONES_DATA: Record<CollectionZone, { name: string; center: [number, number]; color: string }> = {
  BONABERI: { name: 'Bonabéri', center: [4.0522, 9.6817], color: '#059669' },
  BOJONGO: { name: 'Bojongo', center: [4.0680, 9.6723], color: '#3b82f6' },
  MABANDA: { name: 'Mabanda', center: [4.0445, 9.6940], color: '#f59e0b' },
  SODIKO: { name: 'Sodiko', center: [4.0590, 9.6655], color: '#8b5cf6' },
  NKOMBA: { name: 'Nkomba', center: [4.0350, 9.6780], color: '#ec4899' },
  GRAND_HANGAR: { name: 'Grand Hangar', center: [4.0620, 9.6880], color: '#14b8a6' },
  BONASSAMA: { name: 'Bonassama', center: [4.0480, 9.7010], color: '#f97316' },
  MAMBANDA: { name: 'Mambanda', center: [4.0720, 9.6760], color: '#ef4444' },
};

// ─── PHOTOS MOCK (URLs Unsplash/placeholder) ──────────────────────────────────

const WASTE_PHOTOS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
  'https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=400&q=80',
  'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80',
  'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80',
  'https://images.unsplash.com/photo-1567118624561-7e28dd87c45f?w=400&q=80',
  'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80',
  'https://images.unsplash.com/photo-1586255986505-5b4c7a73e3c7?w=400&q=80',
];

const AVATAR_URLS = Array.from({ length: 30 }, (_, i) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}&backgroundColor=b6e3f4,c0aede,d1d4f9`
);

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function randomGPS(zone: CollectionZone): { lat: number; lng: number } {
  const center = ZONES_DATA[zone].center;
  return {
    lat: center[0] + (Math.random() - 0.5) * 0.015,
    lng: center[1] + (Math.random() - 0.5) * 0.015,
  };
}

function generateRef(prefix: string, num: number): string {
  return `${prefix}-2026-${String(num).padStart(5, '0')}`;
}

// ─── FIRST NAMES & LAST NAMES (Camerounais) ───────────────────────────────────

const FIRST_NAMES_M = [
  'Emmanuel', 'Jean-Pierre', 'Paul', 'André', 'François', 'Michel', 'Daniel', 'Thierry',
  'Patrick', 'Joseph', 'Marcel', 'Bernard', 'Philippe', 'Alain', 'Nicolas', 'Christophe',
  'Kevin', 'Steve', 'Rodrigue', 'Serge', 'Claude', 'Gaston', 'René', 'Valentin', 'Léon',
  'Aurelien', 'Boris', 'Eric', 'Fabrice', 'Gilles', 'Hugo', 'Ivan', 'Justin', 'Karl'
];

const FIRST_NAMES_F = [
  'Marie', 'Claire', 'Jeanne', 'Sandrine', 'Céline', 'Florence', 'Nadège', 'Estelle',
  'Pascale', 'Véronique', 'Christine', 'Isabelle', 'Sylvie', 'Nathalie', 'Stéphanie',
  'Linda', 'Laure', 'Aurore', 'Béatrice', 'Carmen', 'Diane', 'Evelyne', 'Fatima',
  'Grace', 'Henriette', 'Irène', 'Julie', 'Karine', 'Laurence', 'Micheline'
];

const LAST_NAMES = [
  'Ngono', 'Mbarga', 'Essono', 'Ateba', 'Nkodo', 'Biyong', 'Ekwalla', 'Njike',
  'Fouda', 'Mvondo', 'Ottou', 'Belinga', 'Messi', 'Eto\'o', 'Bassogog', 'Onana',
  'Kameni', 'Aboubakar', 'Choupo', 'Toko', 'Bebey', 'Billong', 'Bilong', 'Foko',
  'Hamadou', 'Issa', 'Manga', 'Nana', 'Oumar', 'Sali', 'Sama', 'Tchamba', 'Tida',
  'Wamba', 'Yami', 'Zanga', 'Zobo', 'Kuete', 'Mbapte', 'Nkeng', 'Pangop', 'Sop'
];

const ADDRESSES = [
  'Rue de la Liberté, Bonabéri', 'Avenue du Général, Bojongo', 'Boulevard Wouri, Mabanda',
  'Rue des Accias, Sodiko', 'Quartier Nkomba Centre', 'Grand Hangar Marché',
  'Rue Bonassama 12', 'Mambanda Lot 45', 'Carrefour Bonabéri', 'Derrière École Publique Bojongo',
  'Face Marché de Mabanda', 'Cité SIC Sodiko', 'Rue de l\'Église Nkomba',
  'Impasse Grand Hangar', 'Lotissement Bonassama B', 'Quartier Mambanda Nord',
  'Avenue de l\'Indépendance, Bonabéri', 'Rue du Commerce, Bojongo',
  'Impasse de la Paix, Mabanda', 'Carrefour Central Sodiko'
];

// ─── ADMIN USER ───────────────────────────────────────────────────────────────

export const MOCK_ADMIN: User = {
  id: 'admin-001',
  email: 'admin@amoged-d4.cm',
  phone: '+237 699 000 001',
  firstName: 'Système',
  lastName: 'Administrateur',
  fullName: 'Administrateur Système',
  role: 'ADMIN',
  avatar: AVATAR_URLS[0],
  isActive: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  lastLoginAt: new Date().toISOString(),
  stats: { totalReports: 0, resolvedReports: 0, pendingReports: 0, points: 9999, rank: 'Administrateur' }
};

// ─── GENERATE SUPERVISORS ─────────────────────────────────────────────────────

export const MOCK_SUPERVISORS: User[] = [
  { id: 'sup-001', email: 'supervisor1@amoged-d4.cm', phone: '+237 699 100 001', firstName: 'Jean-Claude', lastName: 'Mbarga', fullName: 'Jean-Claude Mbarga', role: 'SUPERVISOR', avatar: AVATAR_URLS[1], isActive: true, isEmailVerified: true, isPhoneVerified: true, zone: 'BONABERI', address: 'Bureau Mairie, Bonabéri', createdAt: '2024-02-01T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z', lastLoginAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'sup-002', email: 'supervisor2@amoged-d4.cm', phone: '+237 699 100 002', firstName: 'Marie-Claire', lastName: 'Ateba', fullName: 'Marie-Claire Ateba', role: 'SUPERVISOR', avatar: AVATAR_URLS[2], isActive: true, isEmailVerified: true, isPhoneVerified: true, zone: 'MABANDA', address: 'Bureau Zone Mabanda', createdAt: '2024-02-01T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z', lastLoginAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'sup-003', email: 'supervisor3@amoged-d4.cm', phone: '+237 699 100 003', firstName: 'Paul', lastName: 'Essono', fullName: 'Paul Essono', role: 'SUPERVISOR', avatar: AVATAR_URLS[3], isActive: true, isEmailVerified: true, isPhoneVerified: true, zone: 'BOJONGO', address: 'Bureau Zone Bojongo', createdAt: '2024-03-01T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z', lastLoginAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'sup-004', email: 'supervisor4@amoged-d4.cm', phone: '+237 699 100 004', firstName: 'André', lastName: 'Nkodo', fullName: 'André Nkodo', role: 'SUPERVISOR', avatar: AVATAR_URLS[4], isActive: true, isEmailVerified: true, isPhoneVerified: true, zone: 'BONASSAMA', address: 'Bureau Zone Bonassama', createdAt: '2024-03-15T00:00:00Z', updatedAt: '2025-01-25T00:00:00Z', lastLoginAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'sup-005', email: 'supervisor5@amoged-d4.cm', phone: '+237 699 100 005', firstName: 'Florence', lastName: 'Mvondo', fullName: 'Florence Mvondo', role: 'SUPERVISOR', avatar: AVATAR_URLS[5], isActive: true, isEmailVerified: true, isPhoneVerified: true, zone: 'MAMBANDA', address: 'Bureau Zone Mambanda', createdAt: '2024-04-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z', lastLoginAt: new Date(Date.now() - 900000).toISOString() },
];

// ─── GENERATE AGENTS ──────────────────────────────────────────────────────────

const AGENT_ZONES: CollectionZone[] = ['BONABERI', 'BOJONGO', 'MABANDA', 'SODIKO', 'NKOMBA', 'GRAND_HANGAR', 'BONASSAMA', 'MAMBANDA'];
const VEHICLE_TYPES: Array<'TRUCK' | 'MINIVAN' | 'MOTORCYCLE' | 'TRICYCLE'> = ['TRUCK', 'MINIVAN', 'MOTORCYCLE', 'TRICYCLE'];
const AGENT_STATUSES: AgentStatus[] = ['ACTIVE', 'ON_MISSION', 'ACTIVE', 'ACTIVE', 'ON_LEAVE'];

export const MOCK_AGENTS: Agent[] = Array.from({ length: 20 }, (_, i) => {
  const isMale = i % 3 !== 0;
  const firstName = isMale ? FIRST_NAMES_M[i % FIRST_NAMES_M.length] : FIRST_NAMES_F[i % FIRST_NAMES_F.length];
  const lastName = LAST_NAMES[(i + 10) % LAST_NAMES.length];
  const zone = AGENT_ZONES[i % AGENT_ZONES.length];
  const gps = randomGPS(zone);
  return {
    id: `agent-${String(i + 1).padStart(3, '0')}`,
    agentId: `AGT-${String(i + 1).padStart(4, '0')}`,
    email: `agent${i + 1}@amoged-d4.cm`,
    phone: `+237 6${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    role: 'AGENT' as UserRole,
    avatar: AVATAR_URLS[(i + 6) % AVATAR_URLS.length],
    isActive: i < 17,
    isEmailVerified: true,
    isPhoneVerified: true,
    zone,
    address: ADDRESSES[i % ADDRESSES.length],
    status: AGENT_STATUSES[i % AGENT_STATUSES.length],
    specialization: [randomFrom(['HOUSEHOLD', 'ORGANIC', 'INDUSTRIAL', 'ILLEGAL_DUMPING']) as WasteCategory],
    assignedZone: zone,
    vehicleType: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
    vehiclePlate: `LT-${Math.floor(1000 + Math.random() * 9000)}-A`,
    supervisor: MOCK_SUPERVISORS[i % MOCK_SUPERVISORS.length].id,
    activeInterventions: Math.floor(Math.random() * 3),
    completedInterventions: Math.floor(Math.random() * 50 + 10),
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    createdAt: randomDate(new Date('2025-01-01'), new Date('2025-12-01')),
    updatedAt: randomDate(new Date('2026-01-01'), new Date()),
    lastLoginAt: randomDate(new Date('2026-01-01'), new Date()),
  };
});

// ─── GENERATE CITIZENS ────────────────────────────────────────────────────────

export const MOCK_CITIZENS: User[] = Array.from({ length: 100 }, (_, i) => {
  const isMale = i % 2 === 0;
  const firstName = isMale ? FIRST_NAMES_M[i % FIRST_NAMES_M.length] : FIRST_NAMES_F[i % FIRST_NAMES_F.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];
  const zone = AGENT_ZONES[i % AGENT_ZONES.length] as CollectionZone;
  const reportCount = Math.floor(Math.random() * 15);
  const resolved = Math.floor(reportCount * 0.7);
  return {
    id: `citizen-${String(i + 1).padStart(3, '0')}`,
    email: `${firstName.toLowerCase().replace(/[^a-z]/g, '')}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}${i}@gmail.com`,
    phone: `+237 6${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    role: 'CITIZEN' as UserRole,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=citizen${i + 1}`,
    isActive: i < 95,
    isEmailVerified: Math.random() > 0.3,
    isPhoneVerified: Math.random() > 0.1,
    zone,
    address: ADDRESSES[i % ADDRESSES.length],
    createdAt: randomDate(new Date('2025-01-01'), new Date('2026-04-01')),
    updatedAt: randomDate(new Date('2026-01-01'), new Date()),
    lastLoginAt: randomDate(new Date('2026-03-01'), new Date()),
    stats: {
      totalReports: reportCount,
      resolvedReports: resolved,
      pendingReports: reportCount - resolved,
      points: resolved * 50 + Math.floor(Math.random() * 100),
      rank: resolved > 10 ? 'Citoyen Exemplaire' : resolved > 5 ? 'Citoyen Actif' : 'Nouveau Citoyen',
    },
  };
});

// ─── GENERATE REPORTS ─────────────────────────────────────────────────────────

const CATEGORIES: WasteCategory[] = ['HOUSEHOLD', 'INDUSTRIAL', 'MEDICAL', 'ELECTRONIC', 'CONSTRUCTION', 'ORGANIC', 'ILLEGAL_DUMPING', 'DRAIN_BLOCKAGE', 'OTHER'];
const URGENCIES: UrgencyLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES: ReportStatus[] = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const REPORT_TITLES: Record<WasteCategory, string[]> = {
  HOUSEHOLD: ['Tas d\'ordures ménagères', 'Déchets non collectés', 'Poubelles débordantes', 'Sacs plastiques épars'],
  INDUSTRIAL: ['Déchets industriels déversés', 'Déchets chimiques abandonnés', 'Huiles usagées déversées'],
  MEDICAL: ['Déchets médicaux dangereux', 'Seringues abandonnées', 'Médicaments périmés jetés'],
  ELECTRONIC: ['Appareils électroniques abandonnés', 'Câbles et batteries jetés', 'Équipements informatiques usagés'],
  CONSTRUCTION: ['Gravats de démolition', 'Débris de construction', 'Ferrailles abandonnées'],
  ORGANIC: ['Déchets végétaux en décomposition', 'Restes alimentaires répandus', 'Matières organiques putréfiées'],
  ILLEGAL_DUMPING: ['Dépôt sauvage de déchets', 'Déversement illégal nocturne', 'Site de décharge illégal'],
  DRAIN_BLOCKAGE: ['Égout bouché par les déchets', 'Canal d\'évacuation obstrué', 'Caniveau bloqué'],
  OTHER: ['Déchets non identifiés', 'Nuisance olfactive grave', 'Pollution diverse'],
};

function generateTimeline(status: ReportStatus, createdAt: string, citizen: User, agent?: Agent): ReportTimelineEvent[] {
  const events: ReportTimelineEvent[] = [{
    id: `tl-${Math.random().toString(36).substr(2, 9)}`,
    status: 'PENDING',
    message: 'Signalement créé et soumis pour traitement',
    author: citizen.fullName,
    authorRole: 'CITIZEN',
    timestamp: createdAt,
  }];

  if (['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
    const assignedDate = new Date(new Date(createdAt).getTime() + 3600000 * 2);
    events.push({
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      status: 'ASSIGNED',
      message: `Signalement assigné à ${agent?.fullName || 'un agent'}`,
      author: randomFrom(MOCK_SUPERVISORS).fullName,
      authorRole: 'SUPERVISOR',
      timestamp: assignedDate.toISOString(),
    });
  }

  if (['IN_PROGRESS', 'RESOLVED'].includes(status)) {
    const startDate = new Date(new Date(createdAt).getTime() + 3600000 * 5);
    events.push({
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      status: 'IN_PROGRESS',
      message: 'Équipe sur place, intervention en cours',
      author: agent?.fullName || 'Agent terrain',
      authorRole: 'AGENT',
      timestamp: startDate.toISOString(),
      photo: Math.random() > 0.5 ? randomFrom(WASTE_PHOTOS) : undefined,
    });
  }

  if (status === 'RESOLVED') {
    const resolvedDate = new Date(new Date(createdAt).getTime() + 3600000 * 10);
    events.push({
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      status: 'RESOLVED',
      message: 'Intervention terminée avec succès. Zone nettoyée.',
      author: agent?.fullName || 'Agent terrain',
      authorRole: 'AGENT',
      timestamp: resolvedDate.toISOString(),
      photo: randomFrom(WASTE_PHOTOS),
    });
  }

  if (status === 'REJECTED') {
    const rejectedDate = new Date(new Date(createdAt).getTime() + 3600000 * 1);
    events.push({
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      status: 'REJECTED',
      message: 'Signalement rejeté: doublon ou information insuffisante',
      author: randomFrom(MOCK_SUPERVISORS).fullName,
      authorRole: 'SUPERVISOR',
      timestamp: rejectedDate.toISOString(),
    });
  }

  return events;
}

export const MOCK_REPORTS: Report[] = Array.from({ length: 500 }, (_, i) => {
  const citizen = MOCK_CITIZENS[i % MOCK_CITIZENS.length];
  const zone = citizen.zone || randomFrom(Object.keys(ZONES_DATA) as CollectionZone[]);
  const gps = randomGPS(zone);
  const category = CATEGORIES[i % CATEGORIES.length];
  const urgency = URGENCIES[Math.floor(i / 125) % 4];
  const status = STATUSES[i % STATUSES.length];
  const agent = status !== 'PENDING' ? MOCK_AGENTS[i % MOCK_AGENTS.length] : undefined;
  const createdAt = randomDate(new Date('2024-06-01'), new Date());
  const titles = REPORT_TITLES[category];
  const title = titles[i % titles.length];

  return {
    id: `report-${String(i + 1).padStart(3, '0')}`,
    referenceNumber: generateRef('RPT', i + 1),
    title,
    description: `${title} signalé au niveau de ${ADDRESSES[i % ADDRESSES.length]}. La situation nécessite une intervention ${urgency === 'CRITICAL' ? 'urgente et immédiate' : urgency === 'HIGH' ? 'rapide' : 'dans les meilleurs délais'}. Des résidents du quartier se plaignent depuis ${Math.floor(Math.random() * 7) + 1} jours.`,
    category,
    urgency,
    status,
    location: {
      lat: gps.lat,
      lng: gps.lng,
      address: ADDRESSES[i % ADDRESSES.length],
      district: ZONES_DATA[zone].name,
      zone,
    },
    photos: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => randomFrom(WASTE_PHOTOS)),
    citizenId: citizen.id,
    citizenName: citizen.fullName,
    citizenPhone: citizen.phone,
    assignedAgentId: agent?.id,
    assignedAgentName: agent?.fullName,
    timeline: generateTimeline(status, createdAt, citizen, agent),
    resolvedAt: status === 'RESOLVED' ? new Date(new Date(createdAt).getTime() + 3600000 * 10).toISOString() : undefined,
    resolvedBy: status === 'RESOLVED' ? agent?.fullName : undefined,
    resolutionNote: status === 'RESOLVED' ? 'Zone nettoyée et déchets évacués vers le centre de traitement.' : undefined,
    rejectionReason: status === 'REJECTED' ? 'Informations insuffisantes ou signalement en doublon' : undefined,
    rating: status === 'RESOLVED' ? Math.floor(Math.random() * 2) + 4 : undefined,
    createdAt,
    updatedAt: new Date(new Date(createdAt).getTime() + 3600000 * Math.random() * 24).toISOString(),
    estimatedResolutionTime: new Date(new Date(createdAt).getTime() + 3600000 * 24).toISOString(),
    tags: [category.toLowerCase(), zone.toLowerCase(), urgency.toLowerCase()],
  };
});

// ─── GENERATE INTERVENTIONS ───────────────────────────────────────────────────

const INT_STATUSES: InterventionStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export const MOCK_INTERVENTIONS: Intervention[] = Array.from({ length: 300 }, (_, i) => {
  const zone = AGENT_ZONES[i % AGENT_ZONES.length] as CollectionZone;
  const gps = randomGPS(zone);
  const report = MOCK_REPORTS[i % MOCK_REPORTS.length];
  const supervisor = MOCK_SUPERVISORS[i % MOCK_SUPERVISORS.length];
  const agents = [MOCK_AGENTS[i % MOCK_AGENTS.length], MOCK_AGENTS[(i + 1) % MOCK_AGENTS.length]];
  const status = INT_STATUSES[i % INT_STATUSES.length];
  const createdAt = randomDate(new Date('2024-06-01'), new Date());
  const scheduledAt = new Date(new Date(createdAt).getTime() + 3600000 * 6).toISOString();

  return {
    id: `int-${String(i + 1).padStart(3, '0')}`,
    referenceNumber: generateRef('INT', i + 1),
    reportIds: [report.id],
    title: `Intervention ${ZONES_DATA[zone].name} #${i + 1}`,
    description: `Collecte et évacuation des déchets signalés dans la zone ${ZONES_DATA[zone].name}. Nettoyage complet du secteur prévu.`,
    status,
    priority: URGENCIES[i % 4],
    assignedAgentIds: agents.map(a => a.id),
    supervisorId: supervisor.id,
    supervisorName: supervisor.fullName,
    zone,
    location: { lat: gps.lat, lng: gps.lng, address: ADDRESSES[i % ADDRESSES.length], zone },
    scheduledAt,
    startedAt: ['IN_PROGRESS', 'COMPLETED'].includes(status) ? new Date(new Date(scheduledAt).getTime() + 1800000).toISOString() : undefined,
    completedAt: status === 'COMPLETED' ? new Date(new Date(scheduledAt).getTime() + 7200000).toISOString() : undefined,
    estimatedDuration: 60 + Math.floor(Math.random() * 120),
    actualDuration: status === 'COMPLETED' ? 45 + Math.floor(Math.random() * 90) : undefined,
    equipment: randomFrom([['Camion benne', 'Pelles', 'Sacs industriels'], ['Balayeuses', 'Brouettes', 'Gants'], ['Pompe hydraulique', 'Tuyaux', 'Camion citerne']]),
    notes: Math.random() > 0.5 ? 'Accès difficile, prévoir équipement adapté. Zone résidentielle dense.' : undefined,
    photos: status === 'COMPLETED' ? [randomFrom(WASTE_PHOTOS), randomFrom(WASTE_PHOTOS)] : [],
    createdAt,
    updatedAt: new Date(new Date(createdAt).getTime() + 3600000 * 2).toISOString(),
  };
});

// ─── GENERATE NOTIFICATIONS ───────────────────────────────────────────────────

const NOTIF_TYPES: NotificationType[] = ['REPORT_CREATED', 'REPORT_ASSIGNED', 'REPORT_IN_PROGRESS', 'REPORT_RESOLVED', 'SYSTEM', 'ALERT', 'INFO'];

export const MOCK_NOTIFICATIONS: Notification[] = Array.from({ length: 200 }, (_, i) => {
  const citizen = MOCK_CITIZENS[i % MOCK_CITIZENS.length];
  const type = NOTIF_TYPES[i % NOTIF_TYPES.length];
  const report = MOCK_REPORTS[i % MOCK_REPORTS.length];

  const messages: Record<NotificationType, { title: string; message: string }> = {
    REPORT_CREATED: { title: '✅ Signalement Enregistré', message: `Votre signalement ${report.referenceNumber} a été reçu et est en cours de traitement.` },
    REPORT_ASSIGNED: { title: '👷 Agent Assigné', message: `Un agent a été assigné à votre signalement ${report.referenceNumber}. Intervention prévue sous 24h.` },
    REPORT_IN_PROGRESS: { title: '🚛 Intervention en Cours', message: `L'équipe est sur place pour traiter votre signalement ${report.referenceNumber}.` },
    REPORT_RESOLVED: { title: '🎉 Problème Résolu', message: `Votre signalement ${report.referenceNumber} a été traité avec succès. Merci de votre contribution!` },
    REPORT_REJECTED: { title: '❌ Signalement Rejeté', message: `Votre signalement ${report.referenceNumber} n'a pas pu être traité. Contactez-nous pour plus d'informations.` },
    INTERVENTION_ASSIGNED: { title: '📋 Nouvelle Mission', message: 'Une nouvelle intervention vous a été assignée. Consultez les détails dans l\'application.' },
    INTERVENTION_COMPLETED: { title: '✅ Mission Complétée', message: 'Votre intervention a été marquée comme terminée. Excellent travail!' },
    SYSTEM: { title: '🔔 Mise à Jour Système', message: 'AMOGED-D4 a été mis à jour. Découvrez les nouvelles fonctionnalités.' },
    ALERT: { title: '⚠️ Alerte Zone', message: `Augmentation des signalements dans votre zone ${ZONES_DATA[citizen.zone || 'BONABERI'].name}. Vigilance requise.` },
    INFO: { title: 'ℹ️ Information', message: 'Calendrier de collecte mis à jour pour votre quartier. Consultez le nouveau planning.' },
    REWARD_REQUESTED: {
      title: '',
      message: ''
    },
    REWARD_VALIDATED: {
      title: '',
      message: ''
    },
    REWARD_REJECTED: {
      title: '',
      message: ''
    }
  };

  const msg = messages[type];
  const createdAt = randomDate(new Date('2025-01-01'), new Date());

  return {
    id: `notif-${String(i + 1).padStart(4, '0')}`,
    userId: citizen.id,
    type,
    priority: i % 10 === 0 ? 'URGENT' : i % 5 === 0 ? 'HIGH' : 'NORMAL',
    title: msg.title,
    message: msg.message,
    isRead: Math.random() > 0.4,
    data: { reportId: report.id, referenceNumber: report.referenceNumber },
    actionUrl: `/citizen/reports/${report.id}`,
    createdAt,
    readAt: Math.random() > 0.4 ? new Date(new Date(createdAt).getTime() + 3600000).toISOString() : undefined,
  };
});

// ─── COLLECTION SCHEDULES ─────────────────────────────────────────────────────

export const MOCK_SCHEDULES: CollectionSchedule[] = [
  { id: 'sch-001', zone: 'BONABERI', zoneName: 'Bonabéri', dayOfWeek: [1, 3, 5], startTime: '07:00', endTime: '12:00', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[0].id, MOCK_AGENTS[1].id], coverageArea: 'Bonabéri Centre, Carrefour Bonabéri, Rue de la Liberté', nextCollection: new Date(Date.now() + 86400000).toISOString(), isActive: true },
  { id: 'sch-002', zone: 'BOJONGO', zoneName: 'Bojongo', dayOfWeek: [1, 4], startTime: '06:30', endTime: '11:30', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[2].id, MOCK_AGENTS[3].id], coverageArea: 'Bojongo Bas, Bojongo Haut, Lycée de Bojongo', nextCollection: new Date(Date.now() + 172800000).toISOString(), isActive: true },
  { id: 'sch-003', zone: 'MABANDA', zoneName: 'Mabanda', dayOfWeek: [2, 5], startTime: '07:30', endTime: '12:30', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[4].id, MOCK_AGENTS[5].id], coverageArea: 'Marché de Mabanda, Cité SIC, Zone Résidentielle', nextCollection: new Date(Date.now() + 259200000).toISOString(), isActive: true },
  { id: 'sch-004', zone: 'SODIKO', zoneName: 'Sodiko', dayOfWeek: [2, 6], startTime: '07:00', endTime: '12:00', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[6].id, MOCK_AGENTS[7].id], coverageArea: 'Sodiko Centre, Carrefour Central, Zone Commerciale', nextCollection: new Date(Date.now() + 345600000).toISOString(), isActive: true },
  { id: 'sch-005', zone: 'NKOMBA', zoneName: 'Nkomba', dayOfWeek: [1, 3, 6], startTime: '06:00', endTime: '11:00', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[8].id, MOCK_AGENTS[9].id], coverageArea: 'Nkomba Est, Nkomba Ouest, Église de Nkomba', nextCollection: new Date(Date.now() + 86400000 * 2).toISOString(), isActive: true },
  { id: 'sch-006', zone: 'GRAND_HANGAR', zoneName: 'Grand Hangar', dayOfWeek: [1, 2, 3, 4, 5], startTime: '05:30', endTime: '10:30', frequency: 'DAILY', assignedTeam: [MOCK_AGENTS[10].id, MOCK_AGENTS[11].id, MOCK_AGENTS[12].id], coverageArea: 'Grand Hangar Marché, Zone Commerciale Intensive', nextCollection: new Date(Date.now() + 3600000 * 6).toISOString(), isActive: true },
  { id: 'sch-007', zone: 'BONASSAMA', zoneName: 'Bonassama', dayOfWeek: [2, 4, 6], startTime: '07:00', endTime: '12:00', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[13].id, MOCK_AGENTS[14].id], coverageArea: 'Bonassama Lot A, Lot B, Zone Industrielle', nextCollection: new Date(Date.now() + 86400000 * 3).toISOString(), isActive: true },
  { id: 'sch-008', zone: 'MAMBANDA', zoneName: 'Mambanda', dayOfWeek: [3, 6], startTime: '07:00', endTime: '12:00', frequency: 'TWICE_WEEKLY', assignedTeam: [MOCK_AGENTS[15].id, MOCK_AGENTS[16].id], coverageArea: 'Mambanda Nord, Mambanda Sud, Marché Local', nextCollection: new Date(Date.now() + 86400000 * 4).toISOString(), isActive: true },
];

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

const ACTIONS = [
  'LOGIN', 'LOGOUT', 'CREATE_REPORT', 'UPDATE_REPORT', 'DELETE_REPORT',
  'ASSIGN_AGENT', 'CREATE_INTERVENTION', 'UPDATE_INTERVENTION',
  'CREATE_USER', 'UPDATE_USER', 'DEACTIVATE_USER', 'EXPORT_REPORT',
  'VIEW_DASHBOARD', 'CHANGE_SETTINGS'
];

export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 100 }, (_, i) => {
  const allUsers = [MOCK_ADMIN, ...MOCK_SUPERVISORS, ...MOCK_AGENTS.slice(0, 5)];
  const user = allUsers[i % allUsers.length];
  const action = ACTIONS[i % ACTIONS.length];
  return {
    id: `audit-${String(i + 1).padStart(4, '0')}`,
    userId: user.id,
    userName: user.fullName,
    userRole: user.role,
    action,
    resource: action.includes('REPORT') ? 'Report' : action.includes('INTERVENTION') ? 'Intervention' : action.includes('USER') ? 'User' : 'System',
    resourceId: `resource-${i + 1}`,
    details: `Action: ${action} effectuée avec succès`,
    ipAddress: `192.168.1.${(i % 254) + 1}`,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)',
    success: Math.random() > 0.05,
    timestamp: randomDate(new Date('2025-01-01'), new Date()),
  };
});

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalReports: 500,
  pendingReports: 98,
  inProgressReports: 87,
  resolvedReports: 271,
  rejectedReports: 44,
  todayReports: 23,
  weekReports: 134,
  monthReports: 487,
  averageResolutionTime: 18.5,
  resolutionRate: 74.2,
  activeAgents: 17,
  activeInterventions: 34,
  citizenSatisfaction: 4.2,
  reportsByZone: Object.keys(ZONES_DATA).map(zone => ({
    zone: zone as CollectionZone,
    count: Math.floor(Math.random() * 80 + 20),
  })),
  reportsByCategory: CATEGORIES.map(cat => ({
    category: cat,
    count: Math.floor(Math.random() * 100 + 10),
  })),
  reportsByStatus: [
    { status: 'PENDING', count: 98 },
    { status: 'ASSIGNED', count: 45 },
    { status: 'IN_PROGRESS', count: 87 },
    { status: 'RESOLVED', count: 271 },
    { status: 'REJECTED', count: 44 },
  ],
  reportsTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    count: Math.floor(Math.random() * 25 + 5),
  })),
  interventionsTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    count: Math.floor(Math.random() * 15 + 3),
  })),
  topReportingZones: Object.entries(ZONES_DATA).map(([k, v]) => ({
    zone: v.name,
    count: Math.floor(Math.random() * 80 + 20),
  })).sort((a, b) => b.count - a.count).slice(0, 5),
};

// ─── CURRENT USER (Demo Login) ─────────────────────────────────────────────────

export const DEMO_USERS = {
  admin: { ...MOCK_ADMIN, password: 'Admin@2026' },
  supervisor: { ...MOCK_SUPERVISORS[0], password: 'Supervisor@2026' },
  agent: { ...MOCK_AGENTS[0], password: 'Agent@2026' },
  citizen: { ...MOCK_CITIZENS[0], password: 'Citizen@2026' },
};

// ─── CATEGORY LABELS ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<WasteCategory, { label: string; icon: string; color: string }> = {
  HOUSEHOLD: { label: 'Ordures Ménagères', icon: '🏠', color: '#059669' },
  INDUSTRIAL: { label: 'Déchets Industriels', icon: '🏭', color: '#6b7280' },
  MEDICAL: { label: 'Déchets Médicaux', icon: '🏥', color: '#ef4444' },
  ELECTRONIC: { label: 'Déchets Électroniques', icon: '💻', color: '#3b82f6' },
  CONSTRUCTION: { label: 'Déchets de Construction', icon: '🏗️', color: '#f59e0b' },
  ORGANIC: { label: 'Déchets Organiques', icon: '🌿', color: '#22c55e' },
  ILLEGAL_DUMPING: { label: 'Dépôt Sauvage', icon: '⚠️', color: '#f97316' },
  DRAIN_BLOCKAGE: { label: 'Caniveau Bouché', icon: '🚰', color: '#8b5cf6' },
  OTHER: { label: 'Autre', icon: '❓', color: '#9ca3af' },
};

export const URGENCY_LABELS: Record<UrgencyLevel, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Faible', color: '#059669', bg: '#d1fae5' },
  MEDIUM: { label: 'Moyen', color: '#f59e0b', bg: '#fef3c7' },
  HIGH: { label: 'Élevé', color: '#f97316', bg: '#ffedd5' },
  CRITICAL: { label: 'Critique', color: '#ef4444', bg: '#fee2e2' },
};

export const STATUS_LABELS: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'En Attente', color: '#f59e0b', bg: '#fef3c7' },
  ASSIGNED: { label: 'Assigné', color: '#3b82f6', bg: '#dbeafe' },
  IN_PROGRESS: { label: 'En Cours', color: '#8b5cf6', bg: '#ede9fe' },
  RESOLVED: { label: 'Résolu', color: '#059669', bg: '#d1fae5' },
  REJECTED: { label: 'Rejeté', color: '#ef4444', bg: '#fee2e2' },
  CANCELLED: { label: 'Annulé', color: '#6b7280', bg: '#f3f4f6' },
};
