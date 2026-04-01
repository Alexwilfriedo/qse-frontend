import { Badge, Button, Card, CardHeader, PageHeader } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { ArrowLeft, Check, Play, Plus, Send, X as XIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuditTable } from './components/AuditTable';
import { PlanAuditModal } from './components/PlanAuditModal';
import {
  useCampaign,
  useAuditors,
  usePlanAudit,
  useTransitionCampaign,
} from './hooks/useAudits';
import type { CampaignStatut, PlanAuditRequest } from './types';

const STATUT_LABELS: Record<CampaignStatut, string> = {
  PLANIFIEE: 'Planifiee',
  SOUMISE: 'Soumise DG',
  CONFIRMEE: 'Confirmee',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminee',
  ANNULEE: 'Annulee',
};

const PRIORITY_LABELS = {
  HAUTE: 'Haute',
  MOYENNE: 'Moyenne',
  FAIBLE: 'Faible',
} as const;

const EXECUTION_STATUS_LABELS = {
  PLANIFIE: 'Planifié',
  EN_EXECUTION: 'En exécution',
  EN_COURS_SUIVI: 'En cours de suivi',
  FINALISE: 'Finalisé',
  REPORTE: 'Reporté',
} as const;

const TRANSITION_ACTIONS: Partial<
  Record<CampaignStatut, { label: string; action: string; icon: typeof Send }[]>
> = {
  PLANIFIEE: [{ label: 'Soumettre a la DG', action: 'soumettre', icon: Send }],
  SOUMISE: [
    { label: 'Confirmer', action: 'confirmer', icon: Check },
    { label: 'Rejeter', action: 'rejeter', icon: XIcon },
  ],
  CONFIRMEE: [{ label: 'Demarrer', action: 'demarrer', icon: Play }],
  EN_COURS: [{ label: 'Terminer', action: 'terminer', icon: Check }],
};

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useCampaign(id!);
  const { data: users } = useUsers();
  const { data: auditors } = useAuditors(true);
  const transitionMutation = useTransitionCampaign();
  const planAuditMutation = usePlanAudit();
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  const handlePlanAudit = (data: PlanAuditRequest) => {
    planAuditMutation.mutate(
      { campaignId: id!, data },
      {
        onSuccess: () => {
          showToast.success('Audit planifie avec succes');
          setIsPlanOpen(false);
        },
        onError: (err) => showToast.error(getApiErrorMessage(err)),
      },
    );
  };

  const handleTransition = (action: string) => {
    transitionMutation.mutate(
      { id: id!, action },
      {
        onSuccess: () => showToast.success('Statut mis a jour'),
        onError: (err) => showToast.error(getApiErrorMessage(err)),
      },
    );
  };

  if (isLoading || !campaign) {
    return <div className='p-8 text-center text-gray-500'>Chargement...</div>;
  }

  const actions = TRANSITION_ACTIONS[campaign.statut] ?? [];
  const firstAudit = campaign.audits?.[0];
  const managerPilotName = users?.find(
    (user) => user.id === campaign.managerPilotUserId,
  );
  const responsableAudit = auditors?.find(
    (auditor) => auditor.id === campaign.responsableAuditId,
  );
  const responsableAuditName = users?.find(
    (user) => user.id === responsableAudit?.userId,
  );
  const equipeNames = campaign.auditeursInternesIds
    .map((auditorId) => auditors?.find((auditor) => auditor.id === auditorId))
    .filter(Boolean)
    .map((auditor) => {
      const user = users?.find((item) => item.id === auditor!.userId);
      return user
        ? `${user.firstName} ${user.lastName}`
        : (auditor!.nomComplet ?? `Auditeur ${auditor!.id.slice(0, 8)}`);
    });
  const fallbackResponsible = users?.find(
    (user) => user.id === firstAudit?.equipe.auditeurPrincipalId,
  );
  const displayReferentiel =
    campaign.referentielNormatif ?? firstAudit?.referentielNormatif ?? '—';
  const displayPerimetre =
    campaign.scopeLabel ?? firstAudit?.perimetre ?? '—';
  const displayDatePrevisionnelle =
    campaign.dateExecutionPrevisionnelle ?? firstAudit?.datePrevisionnelle ?? '—';
  const displayManagerPilot = managerPilotName
    ? `${managerPilotName.firstName} ${managerPilotName.lastName}`
    : '—';
  const displayResponsable = responsableAuditName
    ? `${responsableAuditName.firstName} ${responsableAuditName.lastName}`
    : (fallbackResponsible
        ? `${fallbackResponsible.firstName} ${fallbackResponsible.lastName}`
        : '—');

  return (
    <div className='space-y-6'>
      <PageHeader
        title={campaign.titre}
        description={`Campagne ${campaign.annee} — ${campaign.dateDebut} au ${campaign.dateFin}`}
        actions={
          <div className='flex items-center gap-2'>
            <Button variant='secondary' onClick={() => navigate('/audits')}>
              <ArrowLeft className='w-4 h-4 mr-1' />
              Retour
            </Button>
            {campaign.statut !== 'TERMINEE' &&
              campaign.statut !== 'ANNULEE' && (
                <Button variant='secondary' onClick={() => setIsPlanOpen(true)}>
                  <Plus className='w-4 h-4 mr-1' />
                  Planifier un audit
                </Button>
              )}
            {actions.map((a) => (
              <Button
                key={a.action}
                onClick={() => handleTransition(a.action)}
                disabled={transitionMutation.isPending}>
                <a.icon className='w-4 h-4 mr-1' />
                {a.label}
              </Button>
            ))}
          </div>
        }
      />

      <div className='flex items-center gap-3'>
        <Badge variant='brand'>{STATUT_LABELS[campaign.statut]}</Badge>
        {campaign.executionStatus && (
          <Badge variant='default'>
            {EXECUTION_STATUS_LABELS[campaign.executionStatus]}
          </Badge>
        )}
        {campaign.priorite && (
          <Badge variant='default'>{PRIORITY_LABELS[campaign.priorite]}</Badge>
        )}
        {campaign.perimetre.map((d) => (
          <Badge key={d} variant='default'>
            {d}
          </Badge>
        ))}
      </div>

      <Card className='p-5'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Référentiel normatif
            </p>
            <p className='mt-1 text-sm text-gray-800'>
              {displayReferentiel}
            </p>
          </div>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Périmètre audité
            </p>
            <p className='mt-1 text-sm text-gray-800'>
              {displayPerimetre}
            </p>
          </div>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Cycle d&apos;évaluation
            </p>
            <p className='mt-1 text-sm text-gray-800'>
              {campaign.cycleEvaluation ?? '—'}
            </p>
          </div>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Date prévisionnelle
            </p>
            <p className='mt-1 text-sm text-gray-800'>
              {displayDatePrevisionnelle}
            </p>
          </div>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Manager ou pilote
            </p>
            <p className='mt-1 text-sm text-gray-800'>
              {displayManagerPilot}
            </p>
          </div>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
              Responsable d&apos;audit
            </p>
            <p className='mt-1 text-sm text-gray-800'>
              {displayResponsable}
            </p>
          </div>
        </div>
      </Card>

      {campaign.objectifsAudit && (
        <Card className='p-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Objectifs de l&apos;audit
          </p>
          <p className='text-sm text-gray-700'>{campaign.objectifsAudit}</p>
        </Card>
      )}

      <Card className='p-4'>
        <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
          Équipe d&apos;audit
        </p>
        <div className='space-y-2 text-sm text-gray-700'>
          <p>
            Responsable :{' '}
            {responsableAuditName
              ? `${responsableAuditName.firstName} ${responsableAuditName.lastName}`
              : '—'}
          </p>
          <p>
            Auditeurs internes :{' '}
            {equipeNames.length > 0 ? equipeNames.join(', ') : '—'}
          </p>
        </div>
      </Card>

      {campaign.surveillanceControle && (
        <Card className='p-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Surveillance et contrôle
          </p>
          <p className='text-sm text-gray-700'>
            {campaign.surveillanceControle}
          </p>
        </Card>
      )}

      <Card>
        <CardHeader
          title={`Audits planifies (${campaign.audits?.length ?? 0})`}
        />
        <AuditTable audits={campaign.audits} isLoading={false} />
      </Card>

      <PlanAuditModal
        isOpen={isPlanOpen}
        onClose={() => setIsPlanOpen(false)}
        onSave={handlePlanAudit}
        isPending={planAuditMutation.isPending}
        campaign={campaign}
      />
    </div>
  );
}
