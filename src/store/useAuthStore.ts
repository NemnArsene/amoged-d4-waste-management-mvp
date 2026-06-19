// ============================================
// AMOGED-D4 - Auth Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { DEMO_USERS, MOCK_CITIZENS } from '../data/mockData';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  appView: 'citizen' | 'admin'; // Separation of portals

  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginDemo: (role: UserRole) => void;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setAppView: (view: 'citizen' | 'admin') => void;
}

// Generate JWT-like token
function generateToken(userId: string, role: UserRole): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId, role, iat: Date.now(), exp: Date.now() + 86400000 * 7 }));
  const signature = btoa(`${userId}.${role}.${Date.now()}`);
  return `${header}.${payload}.${signature}`;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      appView: 'citizen',

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 1200)); // Simulate API call

        // Check demo accounts
        const demoUser = Object.values(DEMO_USERS).find(
          u => u.email === email && u.password === password
        );

        if (demoUser) {
          const { password: _, ...userWithoutPwd } = demoUser as typeof demoUser & { password: string };
          const token = generateToken(userWithoutPwd.id, userWithoutPwd.role);
          const appView = ['ADMIN', 'SUPERVISOR', 'AGENT'].includes(userWithoutPwd.role) ? 'admin' : 'citizen';
          set({
            user: userWithoutPwd,
            token,
            isAuthenticated: true,
            isLoading: false,
            appView,
          });
          return { success: true };
        }

        // Check citizens
        const citizen = MOCK_CITIZENS.find(c => c.email === email);
        if (citizen && password === 'Citizen@2026') {
          const token = generateToken(citizen.id, 'CITIZEN');
          set({ user: citizen, token, isAuthenticated: true, isLoading: false, appView: 'citizen' });
          return { success: true };
        }

        set({ isLoading: false });
        return { success: false, message: 'Email ou mot de passe incorrect' };
      },

      loginDemo: (role: UserRole) => {
        const roleMap: Record<UserRole, keyof typeof DEMO_USERS> = {
          ADMIN: 'admin',
          SUPERVISOR: 'supervisor',
          AGENT: 'agent',
          CITIZEN: 'citizen',
        };
        const demoKey = roleMap[role];
        const demoUser = DEMO_USERS[demoKey];
        const { password: _, ...userWithoutPwd } = demoUser as typeof demoUser & { password: string };
        const token = generateToken(userWithoutPwd.id, userWithoutPwd.role);
        const appView = ['ADMIN', 'SUPERVISOR', 'AGENT'].includes(role) ? 'admin' : 'citizen';
        set({ user: userWithoutPwd, token, isAuthenticated: true, appView });
      },

      register: async (data) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 1500));

        // Check if email already exists
        const emailExists = MOCK_CITIZENS.some(c => c.email === data.email);
        if (emailExists) {
          set({ isLoading: false });
          return { success: false, message: 'Cet email est déjà utilisé' };
        }

        const newUser: User = {
          id: `citizen-${Date.now()}`,
          email: data.email || '',
          phone: data.phone || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          fullName: `${data.firstName} ${data.lastName}`,
          role: 'CITIZEN',
          isActive: true,
          isEmailVerified: false,
          isPhoneVerified: false,
          zone: data.zone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: { totalReports: 0, resolvedReports: 0, pendingReports: 0, points: 0, rank: 'Nouveau Citoyen' },
        };

        const token = generateToken(newUser.id, 'CITIZEN');
        set({ user: newUser, token, isAuthenticated: true, isLoading: false, appView: 'citizen' });
        return { success: true };
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, appView: 'citizen' });
      },

      updateUser: (data) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data, updatedAt: new Date().toISOString() } });
        }
      },

      setAppView: (view) => set({ appView: view }),
    }),
    {
      name: 'amoged-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        appView: state.appView,
      }),
    }
  )
);
