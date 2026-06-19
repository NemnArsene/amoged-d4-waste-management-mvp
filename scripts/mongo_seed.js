// ============================================
// AMOGED-D4 - Script d'Insertion MongoDB (mongosh)
// ============================================
// Ce script insère les données mockées dans la base MongoDB.
// 
// EXÉCUTION :
// Si vous utilisez Mongo Shell (mongosh) en local :
//    mongosh "mongodb://localhost:27017/amoged" mongo_seed.js
//
// Si vous utilisez Docker :
//    docker cp mongo_seed.js amoged-mongo:/mongo_seed.js
//    docker exec -it amoged-mongo mongosh "mongodb://localhost:27017/amoged" /mongo_seed.js
// ============================================

print("⏳ Début de la génération et de l'insertion des données mock...");

// Sélection de la base (pour être sûr)
db = db.getSiblingDB('amoged');

// Vider les collections existantes
print("🗑️ Nettoyage des anciennes collections...");
db.users.drop();
db.reports.drop();
db.interventions.drop();
db.notifications.drop();
db.schedules.drop();
db.auditLogs.drop();
db.rewards.drop();
db.rewardRequests.drop();
db.zones.drop();

// ─── DONNÉES DE RÉFÉRENCE ────────────────────────────────────────────────────────

const ZONES_DATA = {
  BONABERI: { name: 'Bonabéri', center: [4.0522, 9.6817], color: '#059669' },
  BOJONGO: { name: 'Bojongo', center: [4.0680, 9.6723], color: '#3b82f6' },
  MABANDA: { name: 'Mabanda', center: [4.0445, 9.6940], color: '#f59e0b' },
  SODIKO: { name: 'Sodiko', center: [4.0590, 9.6655], color: '#8b5cf6' },
  NKOMBA: { name: 'Nkomba', center: [4.0350, 9.6780], color: '#ec4899' },
  GRAND_HANGAR: { name: 'Grand Hangar', center: [4.0620, 9.6880], color: '#14b8a6' },
  BONASSAMA: { name: 'Bonassama', center: [4.0480, 9.7010], color: '#f97316' },
  MAMBANDA: { name: 'Mambanda', center: [4.0720, 9.6760], color: '#ef4444' },
};

const zonesList = Object.entries(ZONES_DATA).map(([id, data]) => ({
  _id: id,
  name: data.name,
  center: data.center,
  color: data.color
}));
db.zones.insertMany(zonesList);
print(`✅ ${zonesList.length} Zones (Quartiers) insérées.`);

const WASTE_PHOTOS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
  'https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=400&q=80',
  'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80',
];

const AVATAR_URLS = Array.from({ length: 30 }, (_, i) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}&backgroundColor=b6e3f4,c0aede,d1d4f9`
);

const CATEGORIES = ['HOUSEHOLD', 'INDUSTRIAL', 'MEDICAL', 'ELECTRONIC', 'CONSTRUCTION', 'ORGANIC', 'ILLEGAL_DUMPING', 'DRAIN_BLOCKAGE', 'OTHER'];
const URGENCIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const REPORT_TITLES = {
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

// ─── FONCTIONS UTILITAIRES ────────────────────────────────────────────────────────

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomGPS(zone) {
  const center = ZONES_DATA[zone].center;
  return {
    lat: center[0] + (Math.random() - 0.5) * 0.006,
    lng: center[1] + (Math.random() - 0.5) * 0.006,
  };
}

function generateRef(prefix, num) {
  return `${prefix}-2026-${String(num).padStart(5, '0')}`;
}

const FIRST_NAMES_M = ['Emmanuel', 'Jean-Pierre', 'Paul', 'André', 'François', 'Michel', 'Daniel', 'Thierry', 'Patrick', 'Joseph'];
const FIRST_NAMES_F = ['Marie', 'Claire', 'Jeanne', 'Sandrine', 'Céline', 'Florence', 'Nadège', 'Estelle', 'Pascale', 'Véronique'];
const LAST_NAMES = ['Ngono', 'Mbarga', 'Essono', 'Ateba', 'Nkodo', 'Biyong', 'Ekwalla', 'Njike', 'Fouda', 'Mvondo', 'Ottou', 'Belinga'];
const ADDRESSES = ['Rue de la Liberté, Bonabéri', 'Avenue du Général, Bojongo', 'Boulevard Wouri, Mabanda', 'Rue des Accias, Sodiko'];

// ─── UTILISATEURS ─────────────────────────────────────────────────────────────

print("👤 Génération des Utilisateurs...");

const adminUser = {
  _id: 'admin-001',
  email: 'admin@amoged-d4.cm',
  password: 'Admin@2026', // Note: En prod, ce mot de passe devrait être hashé (bcrypt)
  phone: '+237 699 000 001',
  firstName: 'Système',
  lastName: 'Administrateur',
  fullName: 'Administrateur Système',
  role: 'ADMIN',
  avatar: AVATAR_URLS[0],
  isActive: true,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  lastLoginAt: new Date(),
  stats: { totalReports: 0, resolvedReports: 0, pendingReports: 0, points: 9999, rank: 'Administrateur' }
};

const supervisors = Array.from({ length: 5 }, (_, i) => ({
  _id: `sup-00${i+1}`,
  email: `supervisor${i+1}@amoged-d4.cm`,
  password: 'Supervisor@2026',
  phone: `+237 699 100 00${i+1}`,
  firstName: FIRST_NAMES_M[i % FIRST_NAMES_M.length],
  lastName: LAST_NAMES[i % LAST_NAMES.length],
  fullName: `${FIRST_NAMES_M[i % FIRST_NAMES_M.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  role: 'SUPERVISOR',
  avatar: AVATAR_URLS[i+1],
  isActive: true,
  zone: Object.keys(ZONES_DATA)[i % Object.keys(ZONES_DATA).length],
  createdAt: new Date('2024-02-01T00:00:00Z'),
  updatedAt: new Date(),
  lastLoginAt: new Date()
}));

const AGENT_ZONES = Object.keys(ZONES_DATA);
const VEHICLE_TYPES = ['TRUCK', 'MINIVAN', 'MOTORCYCLE', 'TRICYCLE'];

const agents = Array.from({ length: 20 }, (_, i) => {
  const isMale = i % 3 !== 0;
  const firstName = isMale ? FIRST_NAMES_M[i % FIRST_NAMES_M.length] : FIRST_NAMES_F[i % FIRST_NAMES_F.length];
  const lastName = LAST_NAMES[(i + 10) % LAST_NAMES.length];
  const zone = AGENT_ZONES[i % AGENT_ZONES.length];
  
  return {
    _id: `agent-${String(i + 1).padStart(3, '0')}`,
    agentId: `AGT-${String(i + 1).padStart(4, '0')}`,
    email: `agent${i + 1}@amoged-d4.cm`,
    password: 'Agent@2026',
    phone: `+237 6${Math.floor(Math.random() * 90 + 10)} 000 000`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    role: 'AGENT',
    avatar: AVATAR_URLS[(i + 6) % AVATAR_URLS.length],
    isActive: true,
    zone,
    specialization: [randomFrom(CATEGORIES)],
    assignedZone: zone,
    vehicleType: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
    vehiclePlate: `LT-${Math.floor(1000 + Math.random() * 9000)}-A`,
    supervisorId: supervisors[i % supervisors.length]._id,
    createdAt: randomDate(new Date('2025-01-01'), new Date('2025-12-01')),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };
});

const citizens = Array.from({ length: 100 }, (_, i) => {
  const isMale = i % 2 === 0;
  const firstName = isMale ? FIRST_NAMES_M[i % FIRST_NAMES_M.length] : FIRST_NAMES_F[i % FIRST_NAMES_F.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];
  const zone = AGENT_ZONES[i % AGENT_ZONES.length];
  
  return {
    _id: `citizen-${String(i + 1).padStart(3, '0')}`,
    email: `citizen${i}@gmail.com`,
    password: 'Citizen@2026',
    phone: `+237 6${Math.floor(Math.random() * 90 + 10)} 000 000`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    role: 'CITIZEN',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=citizen${i + 1}`,
    isActive: true,
    zone,
    address: ADDRESSES[i % ADDRESSES.length],
    createdAt: randomDate(new Date('2025-01-01'), new Date('2026-04-01')),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    stats: {
      points: Math.floor(Math.random() * 500)
    }
  };
});

const allUsers = [adminUser, ...supervisors, ...agents, ...citizens];
db.users.insertMany(allUsers);
print(`✅ ${allUsers.length} Utilisateurs insérés.`);

// ─── SIGNALEMENTS (REPORTS) ──────────────────────────────────────────────────

print("📋 Génération des Signalements...");

const reports = Array.from({ length: 500 }, (_, i) => {
  const citizen = citizens[i % citizens.length];
  const zone = citizen.zone || randomFrom(AGENT_ZONES);
  const gps = randomGPS(zone);
  const category = CATEGORIES[i % CATEGORIES.length];
  const urgency = URGENCIES[Math.floor(i / 125) % 4];
  const status = STATUSES[i % STATUSES.length];
  const agent = status !== 'PENDING' ? agents[i % agents.length] : undefined;
  const createdAt = randomDate(new Date('2024-06-01'), new Date());
  const titles = REPORT_TITLES[category] || REPORT_TITLES['OTHER'];
  const title = titles[i % titles.length];

  let timeline = [{
    id: `tl-${Math.random().toString(36).substr(2, 9)}`,
    status: 'PENDING',
    message: 'Signalement créé',
    author: citizen.fullName,
    authorRole: 'CITIZEN',
    timestamp: createdAt,
  }];

  if (status === 'RESOLVED') {
    timeline.push({
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      status: 'RESOLVED',
      message: 'Intervention terminée',
      author: agent ? agent.fullName : 'Agent',
      authorRole: 'AGENT',
      timestamp: new Date(),
    });
  }

  return {
    _id: `report-${String(i + 1).padStart(3, '0')}`,
    referenceNumber: generateRef('RPT', i + 1),
    title,
    description: `${title} signalé au niveau de ${ADDRESSES[i % ADDRESSES.length]}.`,
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
    photos: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => randomFrom(WASTE_PHOTOS)),
    citizenId: citizen._id,
    citizenName: citizen.fullName,
    citizenPhone: citizen.phone,
    assignedAgentId: agent ? agent._id : null,
    assignedAgentName: agent ? agent.fullName : null,
    timeline: timeline,
    resolvedAt: status === 'RESOLVED' ? new Date() : null,
    createdAt: createdAt,
    updatedAt: new Date(),
  };
});

db.reports.insertMany(reports);
print(`✅ ${reports.length} Signalements insérés.`);

// ─── INTERVENTIONS ───────────────────────────────────────────────────────────

print("🚛 Génération des Interventions...");

const interventions = Array.from({ length: 300 }, (_, i) => {
  const zone = AGENT_ZONES[i % AGENT_ZONES.length];
  const report = reports[i % reports.length];
  const supervisor = supervisors[i % supervisors.length];
  const agent1 = agents[i % agents.length];
  const agent2 = agents[(i + 1) % agents.length];
  const status = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'][i % 4];
  const scheduledAt = randomDate(new Date('2025-01-01'), new Date());
  const gps = randomGPS(zone);
  
  return {
    _id: `int-${String(i + 1).padStart(3, '0')}`,
    referenceNumber: generateRef('INT', i + 1),
    reportIds: [report._id],
    title: `Intervention ${ZONES_DATA[zone].name} #${i + 1}`,
    description: `Collecte et évacuation des déchets signalés dans la zone ${ZONES_DATA[zone].name}. Nettoyage complet du secteur prévu.`,
    status,
    priority: URGENCIES[i % 4],
    assignedAgentIds: [agent1._id, agent2._id],
    supervisorId: supervisor._id,
    supervisorName: supervisor.fullName,
    zone,
    location: { lat: gps.lat, lng: gps.lng, address: ADDRESSES[i % ADDRESSES.length], zone },
    scheduledAt,
    startedAt: ['IN_PROGRESS', 'COMPLETED'].includes(status) ? new Date(scheduledAt.getTime() + 1800000) : null,
    completedAt: status === 'COMPLETED' ? new Date(scheduledAt.getTime() + 7200000) : null,
    estimatedDuration: 60 + Math.floor(Math.random() * 120),
    actualDuration: status === 'COMPLETED' ? 45 + Math.floor(Math.random() * 90) : null,
    equipment: randomFrom([['Camion benne', 'Pelles', 'Sacs industriels'], ['Balayeuses', 'Brouettes', 'Gants'], ['Pompe hydraulique', 'Tuyaux']]),
    notes: Math.random() > 0.5 ? 'Accès difficile, prévoir équipement adapté.' : 'Intervention standard, aucun problème.',
    photos: status === 'COMPLETED' ? [randomFrom(WASTE_PHOTOS), randomFrom(WASTE_PHOTOS)] : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

db.interventions.insertMany(interventions);
print(`✅ ${interventions.length} Interventions détaillées insérées.`);

// ─── PLANNINGS DE COLLECTE ───────────────────────────────────────────────────

print("📅 Génération des Plannings de Collecte...");

const schedules = [
  { _id: 'sch-001', zone: 'BONABERI', zoneName: 'Bonabéri', dayOfWeek: [1, 3, 5], startTime: '07:00', endTime: '12:00', frequency: 'TWICE_WEEKLY', assignedTeam: [agents[0]._id, agents[1]._id], coverageArea: 'Bonabéri Centre, Carrefour Bonabéri', nextCollection: new Date(Date.now() + 86400000), isActive: true },
  { _id: 'sch-002', zone: 'BOJONGO', zoneName: 'Bojongo', dayOfWeek: [1, 4], startTime: '06:30', endTime: '11:30', frequency: 'TWICE_WEEKLY', assignedTeam: [agents[2]._id, agents[3]._id], coverageArea: 'Bojongo Bas, Lycée de Bojongo', nextCollection: new Date(Date.now() + 172800000), isActive: true },
  { _id: 'sch-003', zone: 'MABANDA', zoneName: 'Mabanda', dayOfWeek: [2, 5], startTime: '07:30', endTime: '12:30', frequency: 'TWICE_WEEKLY', assignedTeam: [agents[4]._id, agents[5]._id], coverageArea: 'Marché de Mabanda, Cité SIC', nextCollection: new Date(Date.now() + 259200000), isActive: true },
  { _id: 'sch-004', zone: 'SODIKO', zoneName: 'Sodiko', dayOfWeek: [2, 6], startTime: '07:00', endTime: '12:00', frequency: 'TWICE_WEEKLY', assignedTeam: [agents[6]._id, agents[7]._id], coverageArea: 'Sodiko Centre, Zone Commerciale', nextCollection: new Date(Date.now() + 345600000), isActive: true }
];
db.schedules.insertMany(schedules);
print(`✅ ${schedules.length} Plannings de Collecte détaillés insérés.`);

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────

print("🔔 Génération des Notifications...");

const NOTIF_TYPES = ['REPORT_CREATED', 'REPORT_ASSIGNED', 'REPORT_IN_PROGRESS', 'REPORT_RESOLVED', 'SYSTEM', 'ALERT', 'INFO'];
const notifications = Array.from({ length: 200 }, (_, i) => {
  const citizen = citizens[i % citizens.length];
  const type = NOTIF_TYPES[i % NOTIF_TYPES.length];
  const report = reports[i % reports.length];
  return {
    _id: `notif-${String(i + 1).padStart(4, '0')}`,
    userId: citizen._id,
    type,
    priority: i % 10 === 0 ? 'URGENT' : i % 5 === 0 ? 'HIGH' : 'NORMAL',
    title: `Notification ${type}`,
    message: `Mise à jour concernant votre dossier ou alerte système.`,
    isRead: Math.random() > 0.4,
    data: { reportId: report._id, referenceNumber: report.referenceNumber },
    actionUrl: `/citizen/reports/${report._id}`,
    createdAt: randomDate(new Date('2025-01-01'), new Date()),
  };
});
db.notifications.insertMany(notifications);
print(`✅ ${notifications.length} Notifications insérées.`);

// ─── LOGS D'AUDIT ─────────────────────────────────────────────────────────────

print("📝 Génération des Logs d'Audit...");

const ACTIONS = ['LOGIN', 'LOGOUT', 'CREATE_REPORT', 'UPDATE_REPORT', 'ASSIGN_AGENT', 'CREATE_INTERVENTION', 'CREATE_USER'];
const auditLogs = Array.from({ length: 100 }, (_, i) => {
  const user = allUsers[i % allUsers.length];
  const action = ACTIONS[i % ACTIONS.length];
  return {
    _id: `audit-${String(i + 1).padStart(4, '0')}`,
    userId: user._id,
    userName: user.fullName,
    userRole: user.role,
    action,
    resource: action.includes('REPORT') ? 'Report' : 'System',
    resourceId: `resource-${i + 1}`,
    details: `Action: ${action} effectuée avec succès`,
    ipAddress: `192.168.1.${(i % 254) + 1}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    success: Math.random() > 0.05,
    timestamp: randomDate(new Date('2025-01-01'), new Date()),
  };
});
db.auditLogs.insertMany(auditLogs);
print(`✅ ${auditLogs.length} Logs d'Audit insérés.`);

// ─── PROGRAMME DE FIDÉLITÉ (RÉCOMPENSES) ───────────────────────────────────────

print("🎁 Génération du Programme de Fidélité (Catalogue & Demandes)...");

const rewards = [
  { _id: 'rew-001', name: 'Forfait Internet 2Go (Orange)', description: 'Forfait internet mobile valide 7 jours.', pointsCost: 500, category: 'INTERNET', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80', isAvailable: true, stock: 100, createdAt: new Date() },
  { _id: 'rew-002', name: 'Forfait Internet 2Go (MTN)', description: 'Forfait internet mobile valide 7 jours.', pointsCost: 500, category: 'INTERNET', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80', isAvailable: true, stock: 100, createdAt: new Date() },
  { _id: 'rew-003', name: 'Bon d\'achat Supermarché 5000 FCFA', description: 'Valable dans les supermarchés partenaires de Douala 4.', pointsCost: 1500, category: 'VOUCHER', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80', isAvailable: true, stock: 50, createdAt: new Date() },
  { _id: 'rew-004', name: 'T-shirt AMOGED-D4', description: 'T-shirt éco-responsable de la Mairie.', pointsCost: 1000, category: 'GOODIES', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80', isAvailable: true, stock: 200, createdAt: new Date() },
  { _id: 'rew-005', name: 'Kit Scolaire', description: 'Cahiers, stylos et sac à dos pour la rentrée.', pointsCost: 2000, category: 'EDUCATION', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&q=80', isAvailable: true, stock: 30, createdAt: new Date() }
];
db.rewards.insertMany(rewards);
print(`✅ ${rewards.length} Récompenses au catalogue insérées.`);

const rewardRequests = Array.from({ length: 50 }, (_, i) => {
  const citizen = citizens[i % citizens.length];
  const reward = rewards[i % rewards.length];
  const statuses = ['PENDING', 'VALIDATED', 'REJECTED', 'DELIVERED'];
  return {
    _id: `req-${String(i + 1).padStart(4, '0')}`,
    citizenId: citizen._id,
    citizenName: citizen.fullName,
    rewardId: reward._id,
    rewardName: reward.name,
    pointsUsed: reward.pointsCost,
    status: statuses[i % statuses.length],
    requestDate: randomDate(new Date('2025-01-01'), new Date()),
    processedDate: i % 4 !== 0 ? new Date() : null,
    notes: i % 4 === 2 ? 'Points insuffisants ou suspicion de fraude.' : 'Demande valide, traitement en cours.'
  };
});
db.rewardRequests.insertMany(rewardRequests);
print(`✅ ${rewardRequests.length} Demandes de Récompenses insérées.`);

print("🎉 TERMINE ! La base de données 'amoged' est prête.");
