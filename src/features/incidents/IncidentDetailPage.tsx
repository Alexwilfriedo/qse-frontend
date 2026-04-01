import {
  Badge,
  Button,
  Card,
  CardHeader,
  DomainBadge,
  PageHeader,
  SkeletonCard,
} from '@/components/ui';
import { useProcessMap, useWorkUnits } from '@/features/cartography/hooks';
import { useReferenceItems } from '@/features/configuration/hooks';
import { showToast } from '@/lib/toast';
import { ArrowLeft, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FiveWhyPanel from './components/FiveWhyPanel';
import IncidentActionsPanel from './components/IncidentActionsPanel';
import {
  useAnalyzeFiveWhy,
  useCloseIncident,
  useIncident,
  useStartTreatment,
} from './hooks';
import type { Domaine, IncidentStatus, IncidentType } from './types';

const TYPE_LABEL: Record<IncidentType, string> = {
  ACCIDENT_AVEC_ARRET: 'Accident avec Arrêt',
  ACCIDENT_SANS_ARRET: 'Accident sans Arrêt',
  PRESQU_ACCIDENT: "Presqu'accident",
  INCIDENT: 'Incident',
  NON_CONFORMITE: 'Non-conformité',
  OPPORTUNITE: 'Opportunité',
};

const STATUS_BADGE: Record<
  IncidentStatus,
  { variant: 'info' | 'warning' | 'success'; label: string }
> = {
  DECLARE: { variant: 'info', label: 'Déclaré' },
  EN_ANALYSE: { variant: 'warning', label: 'En analyse' },
  EN_TRAITEMENT: { variant: 'warning', label: 'En traitement' },
  CLOS: { variant: 'success', label: 'Clos' },
};

const DOMAINE_KEY: Record<Domaine, 'qualite' | 'securite' | 'environnement'> = {
  QUALITE: 'qualite',
  SECURITE: 'securite',
  ENVIRONNEMENT: 'environnement',
};

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: incident, isLoading } = useIncident(id!);
  const { data: processMap } = useProcessMap();
  const { data: workUnits } = useWorkUnits();
  const { data: locations } = useReferenceItems('incident-locations', true);
  const { data: consequences } = useReferenceItems(
    'incident-immediate-consequences',
    true,
  );
  const { data: triggerFactors } = useReferenceItems(
    'incident-trigger-factors',
    true,
  );
  const analyzeMutation = useAnalyzeFiveWhy(id!);
  const startTreatmentMutation = useStartTreatment(id!);
  const closeMutation = useCloseIncident(id!);

  const processLabelById = useMemo(() => {
    if (!processMap) {
      return new Map<string, string>();
    }

    return new Map(
      [...processMap.management, ...processMap.realisation, ...processMap.support].map(
        (process) => [process.id, `${process.codification} - ${process.nom}`],
      ),
    );
  }, [processMap]);

  const workUnitLabelById = useMemo(
    () =>
      new Map(
        (workUnits ?? []).map((workUnit) => [
          workUnit.id,
          `${workUnit.code} - ${workUnit.name}`,
        ]),
      ),
    [workUnits],
  );
  const locationLabelByCode = useMemo(
    () => new Map((locations ?? []).map((item) => [item.code, item.label])),
    [locations],
  );
  const consequenceLabelByCode = useMemo(
    () => new Map((consequences ?? []).map((item) => [item.code, item.label])),
    [consequences],
  );
  const triggerLabelByCode = useMemo(
    () => new Map((triggerFactors ?? []).map((item) => [item.code, item.label])),
    [triggerFactors],
  );

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className='py-20 text-center text-gray-500'>
        Incident introuvable
      </div>
    );
  }

  const stBadge = STATUS_BADGE[incident.status];
  const scopeLabel =
    incident.domaine === 'QUALITE'
      ? processLabelById.get(incident.processusId ?? '') ?? '—'
      : workUnitLabelById.get(incident.workUnitId ?? '') ?? '—';
  const scopeFieldLabel =
    incident.domaine === 'QUALITE' ? 'Processus' : 'Unité de travail';

  const handleStartTreatment = async () => {
    try {
      await startTreatmentMutation.mutateAsync();
      showToast.success('Incident passé en traitement');
    } catch {
      showToast.error('Erreur lors du changement de statut');
    }
  };

  const handleClose = async () => {
    try {
      await closeMutation.mutateAsync();
      showToast.success('Incident clôturé');
    } catch {
      showToast.error('Erreur lors de la clôture');
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`${incident.code} — ${incident.title}`}
        actions={
          <div className='flex gap-2'>
            <Button variant='secondary' onClick={() => navigate('/incidents')}>
              <ArrowLeft className='mr-1 h-4 w-4' />
              Retour
            </Button>
            {incident.status === 'EN_ANALYSE' && (
              <Button
                variant='secondary'
                onClick={handleStartTreatment}
                disabled={startTreatmentMutation.isPending}>
                <ArrowRight className='mr-1 h-4 w-4' />
                Passer en traitement
              </Button>
            )}
            {incident.status !== 'CLOS' && (
              <Button
                variant='secondary'
                onClick={handleClose}
                disabled={closeMutation.isPending}>
                <Lock className='mr-1 h-4 w-4' />
                Clôturer
              </Button>
            )}
          </div>
        }
      />

      {/* Informations générales */}
      <Card>
        <CardHeader title='Informations générales' />
        <div className='grid grid-cols-2 gap-4 p-4 md:grid-cols-4'>
          <InfoItem label='Spécificité'>
            <DomainBadge domain={DOMAINE_KEY[incident.domaine]} />
          </InfoItem>
          <InfoItem label='Type'>
            <span className='text-sm font-medium'>
              {TYPE_LABEL[incident.incidentType]}
            </span>
          </InfoItem>
          <InfoItem label='Statut'>
            <Badge variant={stBadge.variant}>{stBadge.label}</Badge>
          </InfoItem>
          <InfoItem label='Date et Heure'>
            <span className='text-sm'>
              {new Date(incident.incidentDate).toLocaleString('fr-FR')}
            </span>
          </InfoItem>
          <InfoItem label={scopeFieldLabel}>
            <span className='text-sm'>{scopeLabel}</span>
          </InfoItem>
          <InfoItem label='Localisation'>
            <span className='text-sm'>
              {locationLabelByCode.get(incident.location ?? '') ?? '—'}
            </span>
          </InfoItem>
          <InfoItem label='Détails (localisation)'>
            <span className='text-sm'>{incident.locationDetails ?? '—'}</span>
          </InfoItem>
          <InfoItem label='Conséquence immédiate'>
            <span className='text-sm'>
              {consequenceLabelByCode.get(incident.immediateConsequence ?? '') ?? '—'}
            </span>
          </InfoItem>
          <InfoItem label='Facteur déclencheur'>
            <span className='text-sm'>
              {triggerLabelByCode.get(incident.triggerFactor ?? '') ?? '—'}
            </span>
          </InfoItem>
          <InfoItem label='Créé le'>
            <span className='text-sm'>
              {new Date(incident.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </InfoItem>
        </div>
        {incident.conservativeMeasures && (
          <div className='border-t border-gray-200 p-4 dark:border-gray-700'>
            <p className='text-xs font-medium uppercase text-gray-500'>
              Mesures conservatoires
            </p>
            <p className='mt-1 text-sm text-gray-800 dark:text-gray-200'>
              {incident.conservativeMeasures}
            </p>
          </div>
        )}
        {incident.description && (
          <div className='border-t border-gray-200 p-4 dark:border-gray-700'>
            <p className='text-xs font-medium uppercase text-gray-500'>
              Description
            </p>
            <p className='mt-1 text-sm text-gray-800 dark:text-gray-200'>
              {incident.description}
            </p>
          </div>
        )}
      </Card>

      {/* Analyse 5 Pourquoi */}
      <FiveWhyPanel
        incident={incident}
        onSubmit={(data) => analyzeMutation.mutateAsync(data).then(() => {})}
        isPending={analyzeMutation.isPending}
      />

      {/* Actions correctives */}
      <IncidentActionsPanel
        incidentId={incident.id}
        incidentDomaine={incident.domaine}
        isClosed={incident.status === 'CLOS'}
      />

      {/* Clôture */}
      {incident.closedAt && (
        <Card>
          <div className='flex items-center gap-3 p-4'>
            <CheckCircle className='h-5 w-5 text-success-500' />
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>
                Incident clôturé le{' '}
                {new Date(incident.closedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function InfoItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className='text-xs font-medium uppercase text-gray-500'>{label}</p>
      <div className='mt-1'>{children}</div>
    </div>
  );
}
