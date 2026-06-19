import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { useRewardStore } from '../../store/useRewardStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Star, ChevronLeft, Gift, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUserPoints } from '../../hooks/useUserPoints';

export function RewardsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useAppStore();
  const { rewards, requests, addRequest } = useRewardStore();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!user) return null;

  const points = useUserPoints();

  const myRequests = requests.filter(r => r.citizenId === user.id);
  const reward = rewards.find(r => r.id === selectedReward);

  const handleRequest = () => {
    if (!reward) return;
    if (points < reward.pointsCost) {
      toast.error('Points insuffisants pour cette récompense.');
      return;
    }

    // Ajouter la demande dans le store
    addRequest({
      citizenId: user.id,
      citizenName: user.fullName,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsCost: reward.pointsCost,
    });

    // Envoyer une notification à l'admin (admin-1 est mocké pour le dashboard)
    addNotification({
      userId: 'admin-1',
      type: 'REWARD_REQUESTED',
      title: 'Nouvelle demande de récompense',
      message: `${user.fullName} a demandé : ${reward.title}`,
      priority: 'NORMAL',
      isRead: false
    });

    toast.success('Demande de récompense envoyée avec succès !');
    setIsConfirming(false);
    setSelectedReward(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Programme de Fidélité</h2>
            <p className="text-xs text-gray-500">Échangez vos points contre des cadeaux</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Points Banner */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Mon Solde de Points</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">{points}</span>
                <span className="text-purple-200 font-medium text-sm">pts</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>
          </div>
          <p className="text-purple-100 text-xs mt-4 max-w-[200px] leading-relaxed">
            Continuez à faire des signalements validés pour gagner plus de points !
          </p>
        </div>

        {/* History of requests */}
        {myRequests.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Mes Demandes Récentes</h3>
            <div className="space-y-3">
              {myRequests.slice(0, 3).map(req => (
                <div key={req.id} className="bg-white dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                    {rewards.find(r => r.id === req.rewardId)?.icon || '🎁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{req.rewardTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(req.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">-{req.pointsCost} pts</span>
                    {req.status === 'PENDING' && <Badge icon={<Clock className="w-3 h-3" />} text="En attente" color="amber" />}
                    {req.status === 'VALIDATED' && <Badge icon={<CheckCircle className="w-3 h-3" />} text="Validé" color="emerald" />}
                    {req.status === 'REJECTED' && <Badge icon={<XCircle className="w-3 h-3" />} text="Refusé" color="red" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogue */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Catalogue de Récompenses</h3>
          <div className="grid grid-cols-2 gap-3">
            {rewards.map(item => {
              const canAfford = points >= item.pointsCost;
              return (
                <Card
                  key={item.id}
                  padding="sm"
                  className={cn(
                    "flex flex-col cursor-pointer transition-all border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 relative overflow-hidden",
                    !canAfford && "opacity-70 grayscale-[30%]"
                  )}
                  onClick={() => {
                    setSelectedReward(item.id);
                    setIsConfirming(true);
                  }}
                >
                  <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {item.pointsCost}
                  </div>
                  <div className="text-4xl mb-3 mt-2">{item.icon}</div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight mb-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-auto">{item.description}</p>
                  {!canAfford && (
                    <div className="mt-2 text-[10px] font-medium text-red-500">
                      Manque {item.pointsCost - points} pts
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        title="Confirmer la demande"
        size="sm"
      >
        {reward && (
          <div className="space-y-4 text-center pb-2">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              {reward.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{reward.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{reward.description}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Coût en points</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">-{reward.pointsCost} pts</span>
            </div>

            {points < reward.pointsCost ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium">
                Vous n'avez pas assez de points pour cette récompense.
              </div>
            ) : (
              <div className="pt-2 flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setIsConfirming(false)}>
                  Annuler
                </Button>
                <Button variant="primary" fullWidth onClick={handleRequest} leftIcon={<Gift className="w-4 h-4" />}>
                  Demander
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Badge({ icon, text, color }: { icon: React.ReactNode, text: string, color: 'amber' | 'emerald' | 'red' }) {
  const colors = {
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1", colors[color])}>
      {icon} {text}
    </span>
  );
}
