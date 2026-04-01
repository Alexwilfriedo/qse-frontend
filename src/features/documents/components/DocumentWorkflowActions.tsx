import { Badge, Button } from '@/components/ui';
import {
  Archive,
  CheckCircle,
  Edit3,
  Send,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { Document, DocumentStatut } from '../types';

interface DocumentWorkflowActionsProps {
  document: Document;
  onSubmit: () => void;
  onVerify: (requireConsultation: boolean) => void;
  onValidateConsultation: () => void;
  onPublish: () => void;
  onReject: () => void;
  onResumeEditing: () => void;
  onArchive: () => void;
  isPending: boolean;
}

const WORKFLOW_STEPS: { statut: DocumentStatut; label: string; order: number }[] = [
  { statut: 'BROUILLON', label: 'Brouillon', order: 1 },
  { statut: 'EN_VERIFICATION', label: 'Vérification', order: 2 },
  { statut: 'EN_CONSULTATION', label: 'Consultation', order: 3 },
  { statut: 'APPROUVE', label: 'Approuvé', order: 4 },
  { statut: 'PUBLIE', label: 'Publié', order: 5 },
  { statut: 'ARCHIVE', label: 'Archivé', order: 6 },
];

function WorkflowProgress({ currentStatut }: { currentStatut: DocumentStatut }) {
  const currentOrder = WORKFLOW_STEPS.find((s) => s.statut === currentStatut)?.order ?? 0;
  const isRejected = currentStatut === 'REJETE';

  return (
    <div className='flex items-center gap-1 overflow-x-auto pb-1'>
      {WORKFLOW_STEPS.map((step) => {
        const isActive = step.statut === currentStatut;
        const isPast = step.order < currentOrder && !isRejected;

        return (
          <div key={step.statut} className='flex items-center gap-1'>
            <div
              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-500'
                  : isPast
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
              {step.label}
            </div>
            {step.order < 6 && (
              <div
                className={`w-4 h-0.5 ${
                  isPast ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
          </div>
        );
      })}
      {isRejected && (
        <Badge variant='error' className='ml-2'>
          Rejeté
        </Badge>
      )}
    </div>
  );
}

/**
 * Affiche les boutons d'action workflow adaptés au statut courant du document.
 * Inclut une barre de progression visuelle du workflow.
 */
export function DocumentWorkflowActions({
  document,
  onSubmit,
  onVerify,
  onValidateConsultation,
  onPublish,
  onReject,
  onResumeEditing,
  onArchive,
  isPending,
}: DocumentWorkflowActionsProps) {
  const { statut } = document;

  return (
    <div className='space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Workflow
        </h4>
      </div>

      <WorkflowProgress currentStatut={statut} />

      {document.motifRejet && statut === 'REJETE' && (
        <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md'>
          <p className='text-sm text-red-800 dark:text-red-300'>
            <strong>Motif de rejet :</strong> {document.motifRejet}
          </p>
        </div>
      )}

      <div className='flex flex-wrap gap-2'>
        {statut === 'BROUILLON' && (
          <Button size='sm' onClick={onSubmit} disabled={isPending}>
            <Send className='w-4 h-4 mr-1' />
            Soumettre à vérification
          </Button>
        )}

        {statut === 'EN_VERIFICATION' && (
          <>
            <Button size='sm' onClick={() => onVerify(false)} disabled={isPending}>
              <CheckCircle className='w-4 h-4 mr-1' />
              Approuver
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => onVerify(true)}
              disabled={isPending}>
              <ShieldCheck className='w-4 h-4 mr-1' />
              Consultation ISO
            </Button>
            <Button size='sm' variant='destructive' onClick={onReject} disabled={isPending}>
              <XCircle className='w-4 h-4 mr-1' />
              Rejeter
            </Button>
          </>
        )}

        {statut === 'EN_CONSULTATION' && (
          <>
            <Button size='sm' onClick={onValidateConsultation} disabled={isPending}>
              <CheckCircle className='w-4 h-4 mr-1' />
              Valider la consultation
            </Button>
            <Button size='sm' variant='destructive' onClick={onReject} disabled={isPending}>
              <XCircle className='w-4 h-4 mr-1' />
              Rejeter
            </Button>
          </>
        )}

        {statut === 'APPROUVE' && (
          <Button size='sm' onClick={onPublish} disabled={isPending}>
            <CheckCircle className='w-4 h-4 mr-1' />
            Publier
          </Button>
        )}

        {statut === 'PUBLIE' && (
          <Button size='sm' variant='secondary' onClick={onArchive} disabled={isPending}>
            <Archive className='w-4 h-4 mr-1' />
            Archiver
          </Button>
        )}

        {statut === 'REJETE' && (
          <Button size='sm' onClick={onResumeEditing} disabled={isPending}>
            <Edit3 className='w-4 h-4 mr-1' />
            Reprendre l'édition
          </Button>
        )}
      </div>
    </div>
  );
}
