import { Button, Card, CardHeader, Input } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import type { FiveWhyRequest, Incident } from '../types';

interface Props {
  incident: Incident;
  onSubmit: (data: FiveWhyRequest) => Promise<void>;
  isPending: boolean;
}

export default function FiveWhyPanel({ incident, onSubmit, isPending }: Props) {
  const [editing, setEditing] = useState(false);
  const [why1Question, setWhy1Question] = useState(incident.why1Question ?? '');
  const [why1Answer, setWhy1Answer] = useState(incident.why1 ?? '');
  const [why2Question, setWhy2Question] = useState(incident.why2Question ?? '');
  const [why2Answer, setWhy2Answer] = useState(incident.why2 ?? '');
  const [why3Question, setWhy3Question] = useState(incident.why3Question ?? '');
  const [why3Answer, setWhy3Answer] = useState(incident.why3 ?? '');
  const [why4Question, setWhy4Question] = useState(incident.why4Question ?? '');
  const [why4Answer, setWhy4Answer] = useState(incident.why4 ?? '');
  const [why5Question, setWhy5Question] = useState(incident.why5Question ?? '');
  const [why5Answer, setWhy5Answer] = useState(incident.why5 ?? '');
  const [rootCause, setRootCause] = useState(incident.rootCause ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        why1Question,
        why1Answer,
        why2Question: why2Question || undefined,
        why2Answer: why2Answer || undefined,
        why3Question: why3Question || undefined,
        why3Answer: why3Answer || undefined,
        why4Question: why4Question || undefined,
        why4Answer: why4Answer || undefined,
        why5Question: why5Question || undefined,
        why5Answer: why5Answer || undefined,
        rootCause,
      });
      showToast.success('Analyse 5 Pourquoi enregistrée');
      setEditing(false);
    } catch {
      showToast.error("Erreur lors de l'enregistrement");
    }
  };

  if (incident.hasAnalysis && !editing) {
    return (
      <Card>
        <CardHeader
          title='Analyse 5 Pourquoi'
          action={
            !incident.closedAt && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setEditing(true)}>
                Modifier
              </Button>
            )
          }
        />
          <div className='space-y-3 p-4'>
            {[
            {
              label: 'Pourquoi 1',
              question: incident.why1Question,
              answer: incident.why1,
            },
            {
              label: 'Pourquoi 2',
              question: incident.why2Question,
              answer: incident.why2,
            },
            {
              label: 'Pourquoi 3',
              question: incident.why3Question,
              answer: incident.why3,
            },
            {
              label: 'Pourquoi 4',
              question: incident.why4Question,
              answer: incident.why4,
            },
            {
              label: 'Pourquoi 5',
              question: incident.why5Question,
              answer: incident.why5,
            },
          ]
            .filter((w) => w.question || w.answer)
            .map((w) => (
              <div key={w.label} className='rounded-lg border border-gray-200 p-3 dark:border-gray-700'>
                <p className='text-xs font-medium uppercase text-gray-500'>
                  {w.label}
                </p>
                <p className='mt-2 text-xs font-medium uppercase text-gray-500'>
                  Question
                </p>
                <p className='text-sm text-gray-800 dark:text-gray-200'>
                  {w.question ?? '—'}
                </p>
                <p className='mt-2 text-xs font-medium uppercase text-gray-500'>
                  Réponse
                </p>
                <p className='text-sm text-gray-800 dark:text-gray-200'>
                  {w.answer ?? '—'}
                </p>
              </div>
            ))}
          <div className='rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-800 dark:bg-brand-900/20'>
            <p className='text-xs font-medium uppercase text-brand-600 dark:text-brand-400'>
              Cause racine
            </p>
            <p className='text-sm font-medium text-gray-900 dark:text-white'>
              {incident.rootCause}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title='Analyse 5 Pourquoi'
        action={<ClipboardCheck className='h-5 w-5 text-gray-400' />}
      />
      <form onSubmit={handleSubmit} className='space-y-3 p-4'>
        {[
          {
            label: 'Pourquoi 1',
            question: why1Question,
            setQuestion: setWhy1Question,
            answer: why1Answer,
            setAnswer: setWhy1Answer,
            required: true,
          },
          {
            label: 'Pourquoi 2',
            question: why2Question,
            setQuestion: setWhy2Question,
            answer: why2Answer,
            setAnswer: setWhy2Answer,
            required: false,
          },
          {
            label: 'Pourquoi 3',
            question: why3Question,
            setQuestion: setWhy3Question,
            answer: why3Answer,
            setAnswer: setWhy3Answer,
            required: false,
          },
          {
            label: 'Pourquoi 4',
            question: why4Question,
            setQuestion: setWhy4Question,
            answer: why4Answer,
            setAnswer: setWhy4Answer,
            required: false,
          },
          {
            label: 'Pourquoi 5',
            question: why5Question,
            setQuestion: setWhy5Question,
            answer: why5Answer,
            setAnswer: setWhy5Answer,
            required: false,
          },
        ].map((item) => (
          <div
            key={item.label}
            className='grid gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700'>
            <p className='text-sm font-semibold text-gray-900 dark:text-white'>
              {item.label}
            </p>
            <Input
              label='Question'
              placeholder='Question posée'
              value={item.question}
              onChange={(e) => item.setQuestion(e.target.value)}
              required={item.required}
            />
            <Input
              label='Réponse'
              placeholder='Réponse apportée'
              value={item.answer}
              onChange={(e) => item.setAnswer(e.target.value)}
              required={item.required}
            />
          </div>
        ))}
        <Input
          label='Cause racine'
          placeholder='Cause racine identifiée'
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          required
        />
        <div className='flex justify-end gap-2 pt-2'>
          {editing && (
            <Button
              variant='secondary'
              type='button'
              onClick={() => setEditing(false)}>
              Annuler
            </Button>
          )}
          <Button
            type='submit'
            disabled={
              isPending || !why1Question || !why1Answer || !rootCause
            }>
            {isPending ? 'Enregistrement...' : "Enregistrer l'analyse"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
