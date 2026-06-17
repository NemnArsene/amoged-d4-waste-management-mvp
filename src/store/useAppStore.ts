// ============================================
// AMOGED-D4 - App Store (Zustand)
// Theme, UI State, Notifications
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, Language, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

interface AppStore {
  theme: ThemeMode;
  language: Language;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  unreadCount: number;
  isOnline: boolean;

  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void;
  setOnlineStatus: (online: boolean) => void;
  getUnreadCount: () => number;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'fr',
      sidebarOpen: true,
      sidebarCollapsed: false,
      notifications: MOCK_NOTIFICATIONS.slice(0, 20),
      unreadCount: MOCK_NOTIFICATIONS.slice(0, 20).filter(n => !n.isRead).length,
      isOnline: true,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else if (theme === 'light') root.classList.remove('dark');
        else {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
          else root.classList.remove('dark');
        }
      },

      setLanguage: (language) => set({ language }),

      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

      collapseSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
          unreadCount: 0,
        }));
      },

      addNotification: (notif) => {
        const newNotif: Notification = {
          ...notif,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        set(state => ({
          notifications: [newNotif, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      setOnlineStatus: (online) => set({ isOnline: online }),

      getUnreadCount: () => get().notifications.filter(n => !n.isRead).length,
    }),
    {
      name: 'amoged-app',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
