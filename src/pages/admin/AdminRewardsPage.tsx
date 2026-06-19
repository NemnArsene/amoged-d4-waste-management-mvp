import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useRewardStore } from '../../store/useRewardStore';
import { useAppStore } from '../../store/useAppStore';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, XCircle, Clock, Gift, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminRewardsPage() {
  const { requests, rewards, updateRequestStatus } = useRewardStore();
  const { addNotification } = useAppStore();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VALIDATED' | 'REJECTED'>('ALL');

  const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

  const handleValidate = (reqId: string, citizenId: string, rewardTitle: string) => {
    updateRequestStatus(reqId, 'VALIDATED', 'admin-1');
    addNotification({
      userId: citizenId,
      type: 'REWARD_VALIDATED',
      title: 'Récompense Validée ! 🎉',
      message: `Votre demande pour "${rewardTitle}" a été approuvée. Présentez-vous à la Mairie pour la retirer.`,
      priority: 'HIGH',
      isRead: false
    });
    toast.success('Demande validée avec succès');
  };

  const handleReject = (reqId: string, citizenId: string, rewardTitle: string) => {
    updateRequestStatus(reqId, 'REJECTED', 'admin-1');
    addNotification({
      userId: citizenId,
      type: 'REWARD_REJECTED',
      title: 'Demande Refusée',
      message: `Votre demande pour "${rewardTitle}" n'a pas pu être validée.`,
      priority: 'NORMAL',
      isRead: false
    });
    toast.error('Demande refusée');
  };

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Programme de Fidélité</h1>
        <p className="text-sm text-gray-500">Gérez les demandes de récompenses des citoyens</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['ALL', 'PENDING', 'VALIDATED', 'REJECTED'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(f as any)}
          >
            {f === 'ALL' ? 'Toutes' : f === 'PENDING' ? 'En Attente' : f === 'VALIDATED' ? 'Validées' : 'Refusées'}
          </Button>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden">
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon="🎁"
            title="Aucune demande"
            description="Il n'y a aucune demande de récompense correspondant à ce filtre."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Citoyen</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Récompense</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Points</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRequests.map(req => {
                  const reward = rewards.find(r => r.id === req.rewardId);
                  return (
                    <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {req.citizenName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{reward?.icon || '🎁'}</span>
                          <span className="text-gray-700 dark:text-gray-300">{req.rewardTitle}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">{req.pointsCost} pts</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {format(new Date(req.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-4 py-3">
                        {req.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" /> En attente
                          </span>
                        )}
                        {req.status === 'VALIDATED' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Validé
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            <XCircle className="w-3 h-3" /> Refusé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {req.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              className="bg-emerald-600 hover:bg-emerald-700 border-none"
                              onClick={() => handleValidate(req.id, req.citizenId, req.rewardTitle)}
                            >
                              Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(req.id, req.citizenId, req.rewardTitle)}
                            >
                              Rejeter
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
