import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RewardItem, RewardRequest, RewardStatus } from '../types';

export const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'rew-001',
    title: 'Bon d\'Achat Supermarché 5000 FCFA',
    description: 'Utilisable dans les supermarchés partenaires (Santa Lucia, Mahima) de Douala 4ème.',
    pointsCost: 500,
    icon: '🛒',
    category: 'BON',
    isAvailable: true,
  },
  {
    id: 'rew-002',
    title: 'Forfait Internet 5Go (Orange/MTN)',
    description: 'Restez connecté grâce à vos actions citoyennes. Valable 30 jours.',
    pointsCost: 300,
    icon: '📶',
    category: 'INTERNET',
    isAvailable: true,
  },
  {
    id: 'rew-003',
    title: 'Kit Goodies Mairie',
    description: 'T-shirt, casquette et gourde aux couleurs de la Mairie de Douala 4ème.',
    pointsCost: 150,
    icon: '👕',
    category: 'GOODIES',
    isAvailable: true,
  },
  {
    id: 'rew-004',
    title: 'Service de Nettoyage Spécial',
    description: 'Intervention prioritaire des équipes de la voirie pour nettoyer la devanture de votre domicile ou rue.',
    pointsCost: 1000,
    icon: '🧹',
    category: 'SERVICE',
    isAvailable: true,
  },
  {
    id: 'rew-005',
    title: 'Téléphone Portable Basique',
    description: 'Gagnez un téléphone portable pour vos actes remarquables de citoyenneté environnementale.',
    pointsCost: 5000,
    icon: '📱',
    category: 'TECH',
    isAvailable: true,
  },
  {
    id: 'rew-006',
    title: 'Tablette Tactile Éducative',
    description: 'Idéal pour l\'éducation des enfants. Récompense prestigieuse pour nos meilleurs citoyens.',
    pointsCost: 10000,
    icon: '💻',
    category: 'TECH',
    isAvailable: true,
  }
];

interface RewardStore {
  rewards: RewardItem[];
  requests: RewardRequest[];
  
  addRequest: (request: Omit<RewardRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: RewardStatus, validatedBy?: string) => void;
}

export const useRewardStore = create<RewardStore>()(
  persist(
    (set) => ({
      rewards: MOCK_REWARDS,
      requests: [],

      addRequest: (request) => {
        const newRequest: RewardRequest = {
          ...request,
          id: `req-${Date.now()}`,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          requests: [newRequest, ...state.requests],
        }));
      },

      updateRequestStatus: (id, status, validatedBy) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  ...(status === 'VALIDATED' ? { validatedAt: new Date().toISOString(), validatedBy } : {}),
                }
              : r
          ),
        }));
      },
    }),
    {
      name: 'amoged-rewards',
    }
  )
);
