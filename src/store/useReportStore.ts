// ============================================
// AMOGED-D4 - Report Store (Zustand)
// Centralized store for all reports
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ReportStatus, WasteCategory, UrgencyLevel, CollectionZone, ReportTimelineEvent } from '../types';
import { MOCK_REPORTS } from '../data/mockData';

interface ReportStore {
  reports: Report[];
  _nextRef: number;

  addReport: (data: {
    title: string;
    description: string;
    category: WasteCategory;
    urgency: UrgencyLevel;
    photos: string[];
    location: { lat: number; lng: number; address?: string; district?: string; zone?: CollectionZone };
    citizenId: string;
    citizenName: string;
    citizenPhone: string;
  }) => string; // returns referenceNumber

  assignAgent: (reportId: string, agentId: string, agentName: string, supervisorName: string) => void;

  updateReportStatus: (reportId: string, status: ReportStatus, authorName: string, authorRole: 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'CITIZEN', note?: string) => void;

  resolveReport: (reportId: string, agentId: string, agentName: string, note: string, photo?: string, location?: { lat: number; lng: number }) => void;

  rejectReport: (reportId: string, authorName: string, reason: string) => void;
}

function generateRef(num: number): string {
  return `RPT-2026-${String(num).padStart(5, '0')}`;
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: MOCK_REPORTS,
      _nextRef: MOCK_REPORTS.length + 1,

      addReport: (data) => {
        const state = get();
        const refNum = state._nextRef;
        const referenceNumber = generateRef(refNum);
        const now = new Date().toISOString();

        const timeline: ReportTimelineEvent[] = [{
          id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          status: 'PENDING',
          message: 'Signalement créé et soumis pour traitement',
          author: data.citizenName,
          authorRole: 'CITIZEN',
          timestamp: now,
        }];

        const newReport: Report = {
          id: `report-${Date.now()}`,
          referenceNumber,
          title: data.title,
          description: data.description,
          category: data.category,
          urgency: data.urgency,
          status: 'PENDING',
          location: {
            lat: data.location.lat,
            lng: data.location.lng,
            address: data.location.address || `${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}`,
            district: data.location.district || 'Douala 4ème',
            zone: data.location.zone,
          },
          photos: data.photos,
          citizenId: data.citizenId,
          citizenName: data.citizenName,
          citizenPhone: data.citizenPhone,
          timeline,
          createdAt: now,
          updatedAt: now,
          tags: [data.category.toLowerCase(), data.urgency.toLowerCase()],
        };

        set({
          reports: [newReport, ...state.reports],
          _nextRef: refNum + 1,
        });

        return referenceNumber;
      },

      assignAgent: (reportId, agentId, agentName, supervisorName) => {
        const now = new Date().toISOString();
        set(state => ({
          reports: state.reports.map(r => {
            if (r.id !== reportId) return r;
            return {
              ...r,
              status: 'ASSIGNED' as ReportStatus,
              assignedAgentId: agentId,
              assignedAgentName: agentName,
              updatedAt: now,
              timeline: [...r.timeline, {
                id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                status: 'ASSIGNED' as ReportStatus,
                message: `Signalement assigné à ${agentName}`,
                author: supervisorName,
                authorRole: 'SUPERVISOR' as const,
                timestamp: now,
              }],
            };
          }),
        }));
      },

      updateReportStatus: (reportId, status, authorName, authorRole, note) => {
        const now = new Date().toISOString();
        set(state => ({
          reports: state.reports.map(r => {
            if (r.id !== reportId) return r;
            return {
              ...r,
              status,
              updatedAt: now,
              timeline: [...r.timeline, {
                id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                status,
                message: note || `Statut mis à jour : ${status}`,
                author: authorName,
                authorRole,
                timestamp: now,
              }],
            };
          }),
        }));
      },

      resolveReport: (reportId, agentId, agentName, note, photo, location) => {
        const now = new Date().toISOString();
        set(state => ({
          reports: state.reports.map(r => {
            if (r.id !== reportId) return r;
            return {
              ...r,
              status: 'RESOLVED' as ReportStatus,
              resolvedAt: now,
              resolvedBy: agentName,
              resolutionNote: note,
              updatedAt: now,
              timeline: [...r.timeline, {
                id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                status: 'RESOLVED' as ReportStatus,
                message: `Intervention terminée avec succès. ${note}`,
                author: agentName,
                authorRole: 'AGENT' as const,
                timestamp: now,
                photo: photo || undefined,
              }],
              photos: photo ? [...r.photos, photo] : r.photos,
            };
          }),
        }));
      },

      rejectReport: (reportId, authorName, reason) => {
        const now = new Date().toISOString();
        set(state => ({
          reports: state.reports.map(r => {
            if (r.id !== reportId) return r;
            return {
              ...r,
              status: 'REJECTED' as ReportStatus,
              rejectionReason: reason,
              updatedAt: now,
              timeline: [...r.timeline, {
                id: `tl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                status: 'REJECTED' as ReportStatus,
                message: `Signalement rejeté : ${reason}`,
                author: authorName,
                authorRole: 'ADMIN' as const,
                timestamp: now,
              }],
            };
          }),
        }));
      },
    }),
    {
      name: 'amoged-reports',
      partialize: (state) => ({
        reports: state.reports.slice(0, 600), // Cap stored reports
        _nextRef: state._nextRef,
      }),
    }
  )
);
