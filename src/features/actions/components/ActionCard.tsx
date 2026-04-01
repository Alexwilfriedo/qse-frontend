import { Button, Card, DomainBadge } from '@/components/ui';
import { useAuthStore } from '@/features/auth/authStore';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  RefreshCw,
  Trash2,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  useRejectAction,
  useReopenAction,
  useUpdateProgress,
  useValidateAction,
} from '../hooks/useActions';
import { ACTION_ORIGIN_LABELS, ACTION_TYPE_LABELS } from '../actionOptions';
import type { Action } from '../types';
import { ActionHistory } from './ActionHistory';
import { ProgressUpdateModal } from './ProgressUpdateModal';
import { RejectActionModal } from './RejectActionModal';
import { ReopenActionModal } from './ReopenActionModal';
import { ValidateActionModal } from './ValidateActionModal';

interface ActionCardProps {
  action: Action;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  showHistory?: boolean;
}

const statutConfig: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  OUVERTE: {
    label: 'Ouverte',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
  },
  EN_COURS: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  TERMINEE: {
    label: 'Terminée',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
  },
  VALIDEE: {
    label: 'Validée',
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle2,
  },
  REFUSEE: {
    label: 'Refusée',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  CORRECTIVE: {
    label: ACTION_TYPE_LABELS.CORRECTIVE,
    color: 'bg-orange-100 text-orange-800',
  },
  PREVENTIVE: {
    label: ACTION_TYPE_LABELS.PREVENTIVE,
    color: 'bg-purple-100 text-purple-800',
  },
  CURATIVE: {
    label: ACTION_TYPE_LABELS.CURATIVE,
    color: 'bg-cyan-100 text-cyan-800',
  },
  AMELIORATION: {
    label: ACTION_TYPE_LABELS.AMELIORATION,
    color: 'bg-emerald-100 text-emerald-800',
  },
};

const prioriteConfig: Record<string, { label: string; color: string }> = {
  BASSE: { label: 'Basse', color: 'text-gray-600' },
  MOYENNE: { label: 'Moyenne', color: 'text-blue-600' },
  HAUTE: { label: 'Haute', color: 'text-orange-600' },
  CRITIQUE: { label: 'Critique', color: 'text-red-600 font-semibold' },
};

export function ActionCard({
  action,
  onEdit,
  onDelete,
  onBack,
  showHistory = true,
}: ActionCardProps) {
  const statut = statutConfig[action.statut];
  const type = typeConfig[action.type];
  const priorite = prioriteConfig[action.priorite];
  const StatutIcon = statut.icon;

  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showReopenValidatedModal, setShowReopenValidatedModal] =
    useState(false);

  const { user } = useAuthStore();
  const updateProgress = useUpdateProgress();
  const validateAction = useValidateAction();
  const rejectAction = useRejectAction();
  const reopenAction = useReopenAction();

  const isVerificateur = user?.id === action.verificateurId;
  const isResponsable = user?.id === action.responsableId;
  const canUpdateProgress =
    isResponsable &&
    !['VALIDEE', 'REFUSEE', 'TERMINEE'].includes(action.statut);
  const canValidate = isVerificateur && action.statut === 'TERMINEE';
  const canReopen = isResponsable && action.statut === 'REFUSEE';
  const canReopenValidated = action.statut === 'VALIDEE';
  const canEdit = !['VALIDEE', 'REFUSEE'].includes(action.statut);
  const canDelete = !['VALIDEE'].includes(action.statut);

  const handleProgressSave = (avancement: number) => {
    updateProgress.mutate(
      { id: action.id, avancement },
      {
        onSuccess: () => setShowProgressModal(false),
      },
    );
  };

  const getProgressColor = (value: number) => {
    if (value >= 100) return 'bg-green-500';
    if (value >= 75) return 'bg-emerald-500';
    if (value >= 50) return 'bg-blue-500';
    if (value >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const handleValidate = (commentaire?: string) => {
    validateAction.mutate(
      { id: action.id, commentaire },
      {
        onSuccess: () => setShowValidateModal(false),
      },
    );
  };

  const handleReject = (motif: string) => {
    rejectAction.mutate(
      { id: action.id, motif },
      {
        onSuccess: () => setShowRejectModal(false),
      },
    );
  };

  const handleReopen = () => {
    reopenAction.mutate(action.id);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {onBack && (
            <Button variant='ghost' size='sm' onClick={onBack}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Retour
            </Button>
          )}
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {action.titre}
          </h1>
        </div>
        <div className='flex items-center gap-2'>
          {canUpdateProgress && (
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setShowProgressModal(true)}>
              <TrendingUp className='h-4 w-4 mr-2' />
              Modifier l'avancement
            </Button>
          )}
          {canValidate && (
            <>
              <Button
                variant='primary'
                size='sm'
                onClick={() => setShowValidateModal(true)}>
                <CheckCircle2 className='h-4 w-4 mr-2' />
                Valider
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => setShowRejectModal(true)}>
                <XCircle className='h-4 w-4 mr-2' />
                Refuser
              </Button>
            </>
          )}
          {canReopen && (
            <Button
              variant='secondary'
              size='sm'
              onClick={handleReopen}
              disabled={reopenAction.isPending}>
              <RefreshCw className='h-4 w-4 mr-2' />
              {reopenAction.isPending ? 'Réouverture...' : 'Réouvrir'}
            </Button>
          )}
          {canReopenValidated && (
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setShowReopenValidatedModal(true)}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Rouvrir (erreur validation)
            </Button>
          )}
          {onEdit && canEdit && (
            <Button variant='primary' size='sm' onClick={onEdit}>
              <Edit2 className='h-4 w-4 mr-2' />
              Modifier
            </Button>
          )}
          {onDelete && canDelete && (
            <Button variant='destructive' size='sm' onClick={onDelete}>
              <Trash2 className='h-4 w-4 mr-2' />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className='flex flex-wrap items-center gap-3'>
        <DomainBadge
          domain={
            action.domaine.toLowerCase() as
              | 'qualite'
              | 'securite'
              | 'environnement'
          }
        />
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statut.color}`}>
          <StatutIcon className='h-4 w-4' />
          {statut.label}
        </span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${type.color}`}>
          {type.label}
        </span>
        {action.enRetard && (
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'>
            <AlertTriangle className='h-4 w-4' />
            En retard
          </span>
        )}
      </div>

      {/* Main content - 2 colonnes */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Informations */}
        <Card className='p-6'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Informations
          </h2>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <User className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Responsable
                </p>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  {action.responsableNom}
                </p>
              </div>
            </div>

            {action.verificateurNom && (
              <div className='flex items-start gap-3'>
                <User className='h-5 w-5 text-gray-400 mt-0.5' />
                <div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Vérificateur
                  </p>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    {action.verificateurNom}
                  </p>
                </div>
              </div>
            )}

            <div className='flex items-start gap-3'>
              <Calendar className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Échéance
                </p>
                <p
                  className={`text-sm font-medium ${action.enRetard ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {formatDate(action.echeance)}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <AlertTriangle className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Priorité
                </p>
                <p className={`text-sm font-medium ${priorite.color}`}>
                  {priorite.label}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Clock className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Origine
                </p>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  {ACTION_ORIGIN_LABELS[action.origine] ?? action.origine}
                </p>
              </div>
            </div>

            <hr className='border-gray-200 dark:border-gray-700' />

            {/* Description */}
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Description
            </h2>
            <p className='text-gray-600 dark:text-gray-400 whitespace-pre-wrap'>
              {action.description || 'Aucune description fournie.'}
            </p>

            {/* Avancement (lecture seule) */}
            <div className='mt-6'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Avancement
                </h3>
                <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                  {action.avancement}%
                </span>
              </div>
              <div className='h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className={`h-full ${getProgressColor(action.avancement)} transition-all duration-300`}
                  style={{ width: `${action.avancement}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className='space-y-6'>
          {/* Colonne droite - Historique */}
          {showHistory && (
            <Card className='p-0 overflow-hidden h-fit'>
              <ActionHistory actionId={action.id} />
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProgressUpdateModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onSave={handleProgressSave}
        currentValue={action.avancement}
        actionTitre={action.titre}
        isLoading={updateProgress.isPending}
      />

      <ValidateActionModal
        isOpen={showValidateModal}
        onClose={() => setShowValidateModal(false)}
        onValidate={handleValidate}
        actionTitre={action.titre}
        isLoading={validateAction.isPending}
      />

      <RejectActionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        actionTitre={action.titre}
        isLoading={rejectAction.isPending}
      />

      <ReopenActionModal
        isOpen={showReopenValidatedModal}
        onClose={() => setShowReopenValidatedModal(false)}
        actionId={action.id}
        actionTitre={action.titre}
      />
    </div>
  );
}
