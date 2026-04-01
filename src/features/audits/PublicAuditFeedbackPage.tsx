import { Button, Card, PageHeader, Textarea } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { CheckCircle2, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  usePublicAuditFeedback,
  useSubmitPublicAuditFeedback,
} from './hooks/useAudits';

const SCORE_OPTIONS = [1, 2, 3, 4];

export function PublicAuditFeedbackPage() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = usePublicAuditFeedback(token);
  const submitMutation = useSubmitPublicAuditFeedback();
  const [forms, setForms] = useState<
    Record<
      string,
      {
        deontologie: number;
        processus: number;
        communication: number;
        reglementation: number;
        commentaire: string;
      }
    >
  >({});

  const canSubmit = useMemo(
    () =>
      data?.auditors.every((auditor) => {
        const form = forms[auditor.auditorId];
        return (
          !!form &&
          form.deontologie >= 1 &&
          form.processus >= 1 &&
          form.communication >= 1 &&
          form.reglementation >= 1
        );
      }) ?? false,
    [data?.auditors, forms],
  );

  if (isLoading) {
    return (
      <div className='mx-auto max-w-5xl p-6'>
        <PageHeader title='Chargement...' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='mx-auto max-w-4xl p-6'>
        <Card>
          <div className='p-8 text-center'>
            <h1 className='text-xl font-semibold text-gray-900'>
              Lien d&apos;évaluation indisponible
            </h1>
            <p className='mt-3 text-sm text-gray-600'>
              Ce lien est invalide, expiré ou a déjà été utilisé.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (data.completed) {
    return (
      <div className='mx-auto max-w-4xl p-6'>
        <Card>
          <div className='p-8 text-center'>
            <CheckCircle2 className='mx-auto h-10 w-10 text-emerald-600' />
            <h1 className='mt-4 text-xl font-semibold text-gray-900'>
              Évaluation déjà soumise
            </h1>
            <p className='mt-3 text-sm text-gray-600'>
              Merci, votre retour a déjà été enregistré pour cet audit.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const handleScoreChange = (
    auditorId: string,
    field: 'deontologie' | 'processus' | 'communication' | 'reglementation',
    value: number,
  ) => {
    setForms((prev) => ({
      ...prev,
      [auditorId]: {
        deontologie: prev[auditorId]?.deontologie ?? 0,
        processus: prev[auditorId]?.processus ?? 0,
        communication: prev[auditorId]?.communication ?? 0,
        reglementation: prev[auditorId]?.reglementation ?? 0,
        commentaire: prev[auditorId]?.commentaire ?? '',
        [field]: value,
      },
    }));
  };

  const handleCommentChange = (auditorId: string, commentaire: string) => {
    setForms((prev) => ({
      ...prev,
      [auditorId]: {
        deontologie: prev[auditorId]?.deontologie ?? 0,
        processus: prev[auditorId]?.processus ?? 0,
        communication: prev[auditorId]?.communication ?? 0,
        reglementation: prev[auditorId]?.reglementation ?? 0,
        commentaire,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!token) return;
    try {
      await submitMutation.mutateAsync({
        token,
        data: {
          feedbacks: data.auditors.map((auditor) => ({
            auditorId: auditor.auditorId,
            deontologie: forms[auditor.auditorId]?.deontologie ?? 0,
            processus: forms[auditor.auditorId]?.processus ?? 0,
            communication: forms[auditor.auditorId]?.communication ?? 0,
            reglementation: forms[auditor.auditorId]?.reglementation ?? 0,
            commentaire: forms[auditor.auditorId]?.commentaire || undefined,
          })),
        },
      });
      showToast.success('Votre évaluation a été enregistrée');
      window.location.reload();
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className='mx-auto max-w-5xl space-y-6 p-6'>
      <PageHeader
        title='Évaluation des auditeurs'
        description={`Audit : ${data.auditTitle}`}
      />

      <Card>
        <div className='p-6'>
          <p className='text-sm text-gray-600'>
            Merci {data.auditeeName ?? ''}. Merci d&apos;évaluer les auditeurs ayant participé à cet audit.
          </p>
        </div>
      </Card>

      {data.auditors.map((auditor) => (
        <Card key={auditor.auditorId}>
          <div className='space-y-5 p-6'>
            <div className='flex items-center gap-3'>
              <Star className='h-5 w-5 text-amber-500' />
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {auditor.auditorName}
                </h2>
                <p className='text-sm text-gray-500'>{auditor.auditorEmail ?? ''}</p>
              </div>
            </div>

            <ScoreRow
              label='Déontologie'
              value={forms[auditor.auditorId]?.deontologie ?? 0}
              onChange={(value) =>
                handleScoreChange(auditor.auditorId, 'deontologie', value)
              }
            />
            <ScoreRow
              label="Maîtrise du processus d'audit"
              value={forms[auditor.auditorId]?.processus ?? 0}
              onChange={(value) =>
                handleScoreChange(auditor.auditorId, 'processus', value)
              }
            />
            <ScoreRow
              label='Communication'
              value={forms[auditor.auditorId]?.communication ?? 0}
              onChange={(value) =>
                handleScoreChange(auditor.auditorId, 'communication', value)
              }
            />
            <ScoreRow
              label='Réglementation'
              value={forms[auditor.auditorId]?.reglementation ?? 0}
              onChange={(value) =>
                handleScoreChange(auditor.auditorId, 'reglementation', value)
              }
            />

            <Textarea
              label='Commentaire'
              value={forms[auditor.auditorId]?.commentaire ?? ''}
              onChange={(event) =>
                handleCommentChange(auditor.auditorId, event.target.value)
              }
              placeholder='Ajoutez un commentaire si nécessaire'
            />
          </div>
        </Card>
      ))}

      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitMutation.isPending}>
          {submitMutation.isPending ? 'Enregistrement...' : 'Soumettre mon évaluation'}
        </Button>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className='rounded-2xl border border-gray-200 p-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <p className='text-sm font-medium text-gray-800'>{label}</p>
        <div className='flex gap-2'>
          {SCORE_OPTIONS.map((score) => (
            <button
              key={score}
              type='button'
              onClick={() => onChange(score)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                value === score
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}>
              {score}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
