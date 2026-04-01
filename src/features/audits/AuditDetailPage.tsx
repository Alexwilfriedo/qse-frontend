import {
  Badge,
  Button,
  Card,
  CardHeader,
  DatePicker,
  Input,
  Modal,
  PageHeader,
  Textarea,
  TimePicker,
} from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { auditsApi } from './auditsApi';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  Pen,
  Plus,
  X as XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FindingFormModal } from './components/FindingFormModal';
import { FindingsTable } from './components/FindingsTable';
import { RejectReportModal } from './components/RejectReportModal';
import { ReportPreviewModal } from './components/ReportPreviewModal';
import { ReportSummaryCard } from './components/ReportSummaryCard';
import {
  useAudit,
  useAuditors,
  useConvoquerAudit,
  useCreateFinding,
  useFindings,
  useRejectReport,
  useTransitionAudit,
} from './hooks/useAudits';
import type {
  AuditStatut,
  AuditType,
  ConvoquerAuditRequest,
  CreateFindingRequest,
} from './types';

const STATUT_LABELS: Record<AuditStatut, string> = {
  PLANIFIE: 'Planifié',
  CONVOQUE: 'Convoqué',
  EN_COURS: 'En cours',
  RAPPORT_SOUMIS: 'Rapport soumis',
  RAPPORT_VALIDE: 'Rapport validé',
  SIGNE: 'Signé',
  CLOTURE: 'Clôturé',
  ANNULE: 'Annulé',
};

const STATUT_COLORS: Record<AuditStatut, string> = {
  PLANIFIE: 'bg-gray-100 text-gray-700',
  CONVOQUE: 'bg-amber-100 text-amber-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  RAPPORT_SOUMIS: 'bg-indigo-100 text-indigo-700',
  RAPPORT_VALIDE: 'bg-purple-100 text-purple-700',
  SIGNE: 'bg-teal-100 text-teal-700',
  CLOTURE: 'bg-green-100 text-green-700',
  ANNULE: 'bg-red-100 text-red-700',
};

const TYPE_LABELS: Record<AuditType, string> = {
  INTERNE: 'Interne',
  EXTERNE: 'Externe',
  CERTIFICATION: 'Certification',
  SURVEILLANCE: 'Surveillance',
};

export function AuditDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: audit, isLoading } = useAudit(id!);
  const { data: findings, isLoading: findingsLoading } = useFindings(id!);
  const { data: users } = useUsers();
  const { data: auditors } = useAuditors(true);

  const createFindingMutation = useCreateFinding();
  const convoquerMutation = useConvoquerAudit();
  const transitionMutation = useTransitionAudit();
  const rejectMutation = useRejectReport();

  const [isFindingFormOpen, setIsFindingFormOpen] = useState(false);
  const [isConvoquerOpen, setIsConvoquerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [convocationDate, setConvocationDate] = useState('');
  const [convocationHeureDebut, setConvocationHeureDebut] = useState('');
  const [convocationHeureFin, setConvocationHeureFin] = useState('');
  const [convocationLieu, setConvocationLieu] = useState('');
  const [convocationOrdreDuJour, setConvocationOrdreDuJour] = useState('');
  const [envoyerEmail, setEnvoyerEmail] = useState(true);

  const handleCreateFinding = (data: CreateFindingRequest) => {
    createFindingMutation.mutate(
      { auditId: id!, data },
      {
        onSuccess: () => {
          showToast.success('Constat ajouté avec succès');
          setIsFindingFormOpen(false);
        },
        onError: (err) => showToast.error(getApiErrorMessage(err)),
      },
    );
  };

  const handleTransition = (action: string) => {
    transitionMutation.mutate(
      { id: id!, action },
      {
        onSuccess: () => showToast.success('Statut mis à jour'),
        onError: (err) => showToast.error(getApiErrorMessage(err)),
      },
    );
  };

  const handleReject = (commentaire: string) => {
    rejectMutation.mutate(
      { id: id!, data: { commentaire } },
      {
        onSuccess: () => {
          showToast.success('Rapport renvoyé pour correction');
          setIsRejectOpen(false);
        },
        onError: (err) => showToast.error(getApiErrorMessage(err)),
      },
    );
  };

  const handleSubmitReport = () => {
    handleTransition('SOUMETTRE_RAPPORT');
    setIsPreviewOpen(false);
  };

  const handleExportPdf = async () => {
    try {
      const blob = await auditsApi.exportAuditReportPdf(id!);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_audit_${audit?.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  const handleOpenConvoquer = () => {
    setConvocationDate(audit?.datePrevisionnelle || '');
    setConvocationHeureDebut(audit?.heureOuverture || '');
    setConvocationHeureFin(audit?.heureFermeture || '');
    setConvocationLieu(audit?.perimetre || '');
    setConvocationOrdreDuJour('');
    setEnvoyerEmail(true);
    setIsConvoquerOpen(true);
  };

  const handleConvoquer = () => {
    const data: ConvoquerAuditRequest = {
      date: convocationDate,
      heureDebut: convocationHeureDebut,
      heureFin: convocationHeureFin || undefined,
      lieu: convocationLieu,
      ordreDuJour: convocationOrdreDuJour || undefined,
      envoyerEmail,
    };

    convoquerMutation.mutate(
      { id: id!, data },
      {
        onSuccess: () => {
          showToast.success('Audit convoqué avec succès');
          setIsConvoquerOpen(false);
        },
        onError: (err) => showToast.error(getApiErrorMessage(err)),
      },
    );
  };

  if (isLoading || !audit) {
    return <div className='p-8 text-center text-gray-500'>Chargement...</div>;
  }

  const getAuditorUserName = (auditorId: string | null | undefined) => {
    if (!auditorId) return '—';
    const auditor = auditors?.find((a) => a.userId === auditorId);
    if (auditor?.nomComplet) return auditor.nomComplet;
    const user = users?.find((u) => u.id === auditorId);
    return user ? `${user.firstName} ${user.lastName}` : '—';
  };

  const equipe = audit.equipe;
  const isEnCours = audit.statut === 'EN_COURS';
  const isPlanifie = audit.statut === 'PLANIFIE';
  const isConvoque = audit.statut === 'CONVOQUE';
  const isRapportSoumis = audit.statut === 'RAPPORT_SOUMIS';
  const isRapportValide = audit.statut === 'RAPPORT_VALIDE';
  const canAddFindings = isEnCours;
  const hasCommentaireRejet = audit.commentaireRejet && isEnCours;

  return (
    <div className='space-y-6'>
      <PageHeader
        title={audit.titre}
        description={`Audit ${TYPE_LABELS[audit.type]} — ${audit.datePrevisionnelle}`}
        actions={
          <div className='flex items-center gap-2'>
            <Button variant='secondary' onClick={() => navigate(-1)}>
              <ArrowLeft className='w-4 h-4 mr-1' />
              Retour
            </Button>

            {isPlanifie && (
              <Button onClick={handleOpenConvoquer}>
                <FileText className='w-4 h-4 mr-1' />
                Convoquer
              </Button>
            )}

            {isConvoque && (
              <Button onClick={() => handleTransition('DEMARRER')}>
                <Check className='w-4 h-4 mr-1' />
                Démarrer
              </Button>
            )}

            {isEnCours && (
              <>
                <Button variant='secondary' onClick={() => setIsPreviewOpen(true)}>
                  <Eye className='w-4 h-4 mr-1' />
                  Aperçu du rapport
                </Button>
              </>
            )}

            {isRapportSoumis && (
              <>
                <Button onClick={() => handleTransition('VALIDER_RAPPORT')}>
                  <Check className='w-4 h-4 mr-1' />
                  Valider
                </Button>
                <Button variant='secondary' onClick={() => setIsRejectOpen(true)}>
                  <Pen className='w-4 h-4 mr-1' />
                  Demander une correction
                </Button>
              </>
            )}

            {isRapportValide && (
              <Button onClick={() => handleTransition('SIGNER_RAPPORT')}>
                <ClipboardCheck className='w-4 h-4 mr-1' />
                Signer le rapport
              </Button>
            )}

            {audit.statut === 'SIGNE' && (
              <Button onClick={() => handleTransition('CLOTURER')}>
                <FileText className='w-4 h-4 mr-1' />
                Clôturer
              </Button>
            )}

            {audit.statut === 'CLOTURE' && (
              <Button onClick={handleExportPdf}>
                <Download className='w-4 h-4 mr-1' />
                Générer le PDF
              </Button>
            )}

            {audit.statut !== 'CLOTURE' && audit.statut !== 'ANNULE' && (
              <Button
                variant='secondary'
                onClick={() => handleTransition('ANNULER')}
                disabled={transitionMutation.isPending}
              >
                <XIcon className='w-4 h-4 mr-1' />
                Annuler
              </Button>
            )}
          </div>
        }
      />

      <div className='flex items-center gap-3'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[audit.statut]}`}
        >
          {STATUT_LABELS[audit.statut]}
        </span>
        {audit.specificite && <Badge variant='default'>{audit.specificite}</Badge>}
      </div>

      {/* Bandeau de rejet */}
      {hasCommentaireRejet && (
        <div className='flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4'>
          <AlertTriangle className='w-5 h-5 text-amber-600 mt-0.5 shrink-0' />
          <div>
            <p className='text-sm font-semibold text-amber-800'>
              Correction demandée par le responsable QSE
            </p>
            <p className='mt-1 text-sm text-amber-700'>{audit.commentaireRejet}</p>
          </div>
        </div>
      )}

      {/* Informations figées de la planification */}
      <Card className='p-5'>
        <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
          Informations de planification
        </p>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {audit.objectifSpecifique && (
            <div className='col-span-full'>
              <p className='text-xs font-semibold text-gray-500'>Objectifs de l&apos;audit</p>
              <p className='mt-1 text-sm text-gray-800'>{audit.objectifSpecifique}</p>
            </div>
          )}
          <div>
            <p className='text-xs font-semibold text-gray-500'>Type d&apos;audit</p>
            <p className='mt-1 text-sm text-gray-800'>{TYPE_LABELS[audit.type]}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500'>Périmètre d&apos;audit</p>
            <p className='mt-1 text-sm text-gray-800'>{audit.perimetre}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500'>Date de réalisation</p>
            <p className='mt-1 text-sm text-gray-800'>{audit.datePrevisionnelle}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500'>Équipe d&apos;audit</p>
            <p className='mt-1 text-sm text-gray-800'>
              <span className='font-medium'>Responsable : </span>
              {equipe ? getAuditorUserName(equipe.auditeurPrincipalId) : '—'}
            </p>
            {equipe?.auditeursIds && equipe.auditeursIds.length > 0 && (
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Membres : </span>
                {equipe.auditeursIds.map((uid) => getAuditorUserName(uid)).join(', ')}
              </p>
            )}
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500'>Référentiels normatifs</p>
            <p className='mt-1 text-sm text-gray-800'>{audit.referentielNormatif ?? '—'}</p>
          </div>
        </div>
      </Card>

      {/* Synthèse du rapport */}
      {findings && findings.length > 0 && <ReportSummaryCard findings={findings} />}

      {/* Performance du processus */}
      {audit.notePerformanceProcessus != null && (
        <Card className='p-4'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Taux de performance du processus
          </p>
          <p className='text-2xl font-bold text-gray-800'>
            {audit.notePerformanceProcessus}%
          </p>
        </Card>
      )}

      {/* Constats */}
      <Card>
        <CardHeader
          title={`Constats (${findings?.length ?? 0})`}
          action={
            canAddFindings ? (
              <Button
                variant='secondary'
                onClick={() => setIsFindingFormOpen(true)}
              >
                <Plus className='w-4 h-4 mr-1' />
                Ajouter constat
              </Button>
            ) : undefined
          }
        />
        <FindingsTable findings={findings} isLoading={findingsLoading} />
      </Card>

      {/* Modals */}
      <Modal
        isOpen={isConvoquerOpen}
        onClose={() => setIsConvoquerOpen(false)}
        title="Convoquer l'audit"
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <DatePicker
              label='Date'
              value={convocationDate}
              onChange={setConvocationDate}
              required
            />
            <TimePicker
              label='Heure début'
              value={convocationHeureDebut}
              onChange={setConvocationHeureDebut}
              required
            />
            <TimePicker
              label='Heure fin'
              value={convocationHeureFin}
              onChange={setConvocationHeureFin}
            />
          </div>

          <Input
            label='Lieu'
            value={convocationLieu}
            onChange={(event) => setConvocationLieu(event.target.value)}
            required
          />

          <Textarea
            label='Ordre du jour'
            value={convocationOrdreDuJour}
            onChange={(event) => setConvocationOrdreDuJour(event.target.value)}
            rows={4}
          />

          <label className='flex items-center gap-2 text-sm text-gray-700'>
            <input
              type='checkbox'
              checked={envoyerEmail}
              onChange={(event) => setEnvoyerEmail(event.target.checked)}
              className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
            />
            Envoyer la convocation par e-mail
          </label>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsConvoquerOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type='button'
              onClick={handleConvoquer}
              disabled={
                convoquerMutation.isPending ||
                !convocationDate ||
                !convocationHeureDebut ||
                !convocationLieu.trim()
              }
            >
              Convoquer
            </Button>
          </div>
        </div>
      </Modal>

      <FindingFormModal
        isOpen={isFindingFormOpen}
        onClose={() => setIsFindingFormOpen(false)}
        onSave={handleCreateFinding}
        isPending={createFindingMutation.isPending}
      />

      {isPreviewOpen && findings && (
        <ReportPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          audit={audit}
          findings={findings}
          onSubmitReport={handleSubmitReport}
          isPending={transitionMutation.isPending}
        />
      )}

      <RejectReportModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onReject={handleReject}
        isPending={rejectMutation.isPending}
      />
    </div>
  );
}
