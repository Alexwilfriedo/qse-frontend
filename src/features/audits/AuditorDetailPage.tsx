import { Badge, Button, Card, CardHeader, PageHeader } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Building2,
  CalendarClock,
  Mail,
  Phone,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auditsApi } from './auditsApi';
import { AuditorDetailModal } from './components/AuditorDetailModal';
import { useAuditor, useEvaluerCompetences } from './hooks/useAudits';

const LEVEL_LABELS = {
  JUNIOR: 'Junior',
  CONFIRME: 'Confirmé',
  LEAD: 'Lead',
} as const;

export function AuditorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: auditor, isLoading, error } = useAuditor(id);
  const { data: users } = useUsers();
  const evaluateMutation = useEvaluerCompetences();
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const user = useMemo(
    () => users?.find((item) => item.id === auditor?.userId),
    [users, auditor?.userId],
  );

  useEffect(() => {
    let objectUrl: string | null = null;

    if (!auditor?.hasPhoto) {
      setPhotoUrl(null);
      return;
    }

    auditsApi
      .getAuditorPhoto(auditor.id)
      .then((blob) => {
        if (!blob) {
          setPhotoUrl(null);
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      })
      .catch(() => setPhotoUrl(null));

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [auditor?.hasPhoto, auditor?.id]);

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Auditeur introuvable'
          description="La fiche demandée n'existe pas ou n'est plus accessible."
          actions={
            <Button variant='secondary' onClick={() => navigate('/audits/auditors')}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Retour
            </Button>
          }
        />
      </div>
    );
  }

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : (auditor?.nomComplet ?? 'Auditeur');

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isLoading ? 'Chargement...' : fullName}
        description='Fiche détaillée de l’auditeur'
        actions={
          <div className='flex gap-3'>
            <Button variant='secondary' onClick={() => navigate('/audits/auditors')}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Retour
            </Button>
            {auditor ? (
              <Button onClick={() => setIsEvaluateOpen(true)}>Évaluer</Button>
            ) : null}
          </div>
        }
      />

      {auditor ? (
        <>
          <Card>
            <div className='grid gap-6 p-6 md:grid-cols-[240px_1fr]'>
              <div className='flex flex-col items-center gap-4'>
                <div className='flex h-52 w-52 items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm'>
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={fullName}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <UserCircle2 className='h-24 w-24 text-gray-300' />
                  )}
                </div>
                <Badge variant='info'>{LEVEL_LABELS[auditor.level]}</Badge>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <InfoRow icon={BadgeCheck} label='Code auditeur' value={auditor.auditorCode} />
                <InfoRow icon={Mail} label='Email' value={user?.email ?? '-'} />
                <InfoRow icon={Building2} label='Direction / Service' value={auditor.directionService ?? '-'} />
                <InfoRow icon={Phone} label='Téléphone professionnel' value={auditor.professionalPhone ?? '-'} />
                <InfoRow icon={Award} label='Matricule' value={auditor.matricule ?? '-'} />
                <InfoRow
                  icon={ShieldCheck}
                  label='Normes maîtrisées'
                  value={auditor.perimetreNormes.join(', ') || '-'}
                />
                <InfoRow
                  icon={CalendarClock}
                  label='Dernière formation audit interne'
                  value={auditor.dateDerniereFormationAuditInterne ?? '-'}
                />
                <InfoRow
                  icon={Award}
                  label='Certifications externes'
                  value={auditor.certificationsExternes ?? '-'}
                />
              </div>
            </div>
          </Card>

          <div className='grid gap-6 lg:grid-cols-2'>
            <Card>
              <CardHeader title='Périmètre de qualification' />
              <div className='space-y-4 p-6'>
                <div>
                  <p className='mb-2 text-sm font-medium text-gray-700'>Domaines</p>
                  <div className='flex flex-wrap gap-2'>
                    {auditor.perimetreDomaines.length > 0 ? (
                      auditor.perimetreDomaines.map((domaine) => (
                        <Badge key={domaine} variant='info'>
                          {domaine}
                        </Badge>
                      ))
                    ) : (
                      <span className='text-sm text-gray-500'>Aucun domaine renseigné</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className='mb-2 text-sm font-medium text-gray-700'>Normes</p>
                  <div className='flex flex-wrap gap-2'>
                    {auditor.perimetreNormes.length > 0 ? (
                      auditor.perimetreNormes.map((norme) => (
                        <Badge key={norme} variant='success'>
                          {norme}
                        </Badge>
                      ))
                    ) : (
                      <span className='text-sm text-gray-500'>Aucune norme renseignée</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title='Compétences et suivi' />
              <div className='grid gap-4 p-6 md:grid-cols-2'>
                <MetricCard label='Déontologie' value={`${auditor.competenceDeontologie} / 4`} />
                <MetricCard label="Processus d'audit" value={`${auditor.competenceProcessus} / 4`} />
                <MetricCard label='Communication' value={`${auditor.competenceCommunication} / 4`} />
                <MetricCard label='Réglementation' value={`${auditor.competenceReglementation} / 4`} />
                <MetricCard label='Score moyen' value={`${auditor.scoreMoyen.toFixed(1)} / 4`} highlight />
                <MetricCard label='Prochaine revue' value={auditor.dateProchaineRevue ?? '-'} />
              </div>
            </Card>
          </div>

          <AuditorDetailModal
            auditor={auditor}
            isOpen={isEvaluateOpen}
            onClose={() => setIsEvaluateOpen(false)}
            onEvaluate={async (data) => {
              if (!auditor) return;
              try {
                await evaluateMutation.mutateAsync({ id: auditor.id, data });
                showToast.success('Évaluation enregistrée');
                setIsEvaluateOpen(false);
              } catch (error) {
                showToast.error(getApiErrorMessage(error));
              }
            }}
            isPending={evaluateMutation.isPending}
          />
        </>
      ) : null}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-4'>
      <div className='mb-2 flex items-center gap-2 text-sm text-gray-500'>
        <Icon className='h-4 w-4' />
        <span>{label}</span>
      </div>
      <p className='text-sm font-medium text-gray-900'>{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? 'border-brand-200 bg-brand-50'
          : 'border-gray-200 bg-white'
      }`}>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='mt-2 text-lg font-semibold text-gray-900'>{value}</p>
    </div>
  );
}
