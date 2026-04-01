import { Badge, Button, Card, CardHeader, Skeleton } from '@/components/ui';
import { CheckCircle, ClipboardList, XCircle } from 'lucide-react';
import { useState } from 'react';
import {
    useDocumentQuiz,
    useMyQuizAttempts,
    useSubmitQuizAttempt,
} from '../hooks/useQuiz';

interface QuizPanelProps {
  documentId: string;
}

/**
 * Panel de quiz QCM pour vérifier la compréhension d'un document (M2.4).
 * Affiche le quiz, permet de répondre et montre les résultats des tentatives.
 */
export function QuizPanel({ documentId }: QuizPanelProps) {
  const { data: quiz, isLoading: quizLoading } = useDocumentQuiz(documentId);
  const { data: attempts = [], isLoading: attemptsLoading } =
    useMyQuizAttempts(documentId);
  const submitAttempt = useSubmitQuizAttempt();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showQuiz, setShowQuiz] = useState(false);

  if (quizLoading || attemptsLoading) {
    return (
      <Card>
        <div className='p-6 space-y-3'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-4 w-60' />
          <Skeleton className='h-20 w-full' />
        </div>
      </Card>
    );
  }

  if (!quiz || !quiz.active) return null;

  const hasPassed = attempts.some((a) => a.passed);
  const attemptsLeft = quiz.maxAttempts - attempts.length;
  const canAttempt = !hasPassed && attemptsLeft > 0;

  const allAnswered =
    quiz.questions.length > 0 &&
    Object.keys(answers).length === quiz.questions.length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    const orderedAnswers = quiz.questions.map(
      (_: unknown, i: number) => answers[i],
    );
    submitAttempt.mutate(
      { documentId, request: { answers: orderedAnswers } },
      {
        onSuccess: () => {
          setAnswers({});
          setShowQuiz(false);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader
        title='Quiz de compréhension'
        description={`Score requis : ${quiz.passingScore}% — ${quiz.maxAttempts} tentative(s) max.`}
      />
      <div className='p-6 pt-0 space-y-4'>
        {/* Résultat global */}
        {hasPassed && (
          <div className='flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <CheckCircle className='w-5 h-5 text-green-500' />
            <span className='text-sm font-medium text-green-700 dark:text-green-400'>
              Quiz réussi
            </span>
          </div>
        )}

        {!hasPassed && attempts.length > 0 && attemptsLeft > 0 && (
          <div className='flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg'>
            <XCircle className='w-5 h-5 text-amber-500' />
            <span className='text-sm font-medium text-amber-700 dark:text-amber-400'>
              Dernière tentative échouée — {attemptsLeft} tentative(s)
              restante(s)
            </span>
          </div>
        )}

        {!hasPassed && attemptsLeft <= 0 && (
          <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <XCircle className='w-5 h-5 text-red-500' />
            <span className='text-sm font-medium text-red-700 dark:text-red-400'>
              Tentatives épuisées — quiz non réussi
            </span>
          </div>
        )}

        {/* Historique tentatives */}
        {attempts.length > 0 && (
          <div className='space-y-2'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Historique
            </p>
            {attempts.map((a) => (
              <div
                key={a.id}
                className='flex items-center justify-between text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2'>
                <span className='text-gray-700 dark:text-gray-300'>
                  Tentative #{a.attemptNumber}
                </span>
                <div className='flex items-center gap-2'>
                  <span className='font-mono'>{a.score}%</span>
                  <Badge variant={a.passed ? 'success' : 'error'}>
                    {a.passed ? 'Réussi' : 'Échoué'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton / Formulaire quiz */}
        {canAttempt && !showQuiz && (
          <Button onClick={() => setShowQuiz(true)}>
            <ClipboardList className='w-4 h-4 mr-2' />
            {attempts.length === 0 ? 'Passer le quiz' : 'Nouvelle tentative'}
          </Button>
        )}

        {showQuiz && (
          <div className='space-y-5 border-t border-gray-200 dark:border-gray-700 pt-4'>
            {quiz.questions.map(
              (
                q: { id: string; question: string; options: string[] },
                qIndex: number,
              ) => (
                <div key={q.id} className='space-y-2'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className='space-y-1 pl-4'>
                    {q.options.map((option: string, oIndex: number) => (
                      <label
                        key={oIndex}
                        className='flex items-center gap-2 text-sm cursor-pointer py-1'>
                        <input
                          type='radio'
                          name={`q-${qIndex}`}
                          checked={answers[qIndex] === oIndex}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [qIndex]: oIndex,
                            }))
                          }
                          className='text-brand-500 focus:ring-brand-500'
                        />
                        <span className='text-gray-700 dark:text-gray-300'>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ),
            )}

            <div className='flex gap-3 pt-2'>
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || submitAttempt.isPending}>
                {submitAttempt.isPending ? 'Envoi...' : 'Soumettre'}
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  setShowQuiz(false);
                  setAnswers({});
                }}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
