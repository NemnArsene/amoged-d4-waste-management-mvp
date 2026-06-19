import { useReportStore } from '../store/useReportStore';
import { useRewardStore } from '../store/useRewardStore';
import { useAuthStore } from '../store/useAuthStore';

export function useUserPoints() {
  const { user } = useAuthStore();
  const { reports } = useReportStore();
  const { requests, rewards } = useRewardStore();

  if (!user || user.role !== 'CITIZEN') {
    return 0;
  }

  // Points gagnés grâce aux signalements
  const myReports = reports.filter(r => r.citizenId === user.id);
  const earnedPoints = myReports.reduce((acc, r) => {
    switch (r.urgency) {
      case 'CRITICAL': return acc + 50;
      case 'HIGH': return acc + 30;
      case 'MEDIUM': return acc + 20;
      case 'LOW':
      default: return acc + 10;
    }
  }, 0);

  // Points dépensés pour les récompenses (en attente ou validées)
  const myRequests = requests.filter(r => r.citizenId === user.id && r.status !== 'REJECTED');
  const spentPoints = myRequests.reduce((acc, r) => {
    const reward = rewards.find(rw => rw.id === r.rewardId);
    return acc + (reward?.pointsCost || 0);
  }, 0);

  return Math.max(0, earnedPoints - spentPoints);
}
