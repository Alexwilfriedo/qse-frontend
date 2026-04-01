import { useState } from 'react';
import {
  useAddAxis,
  useAddQuestion,
  useGrid,
  usePublishGrid,
  useRemoveAxis,
  useRemoveQuestion,
  useUpdateGrid,
} from '../hooks/useSelfAssessmentConfig';
import type {
  AssessmentAxis,
  AssessmentQuestion,
  GridStatus,
  QuestionType,
} from '../types';

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  OUI_NON: 'Oui / Non',
  ECHELLE_1_5: 'Échelle 1-5',
  TEXTE_LIBRE: 'Texte libre',
};

const STATUS_LABELS: Record<GridStatus, { label: string; color: string }> = {
  BROUILLON: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  PUBLIEE: { label: 'Publiée', color: 'bg-green-100 text-green-700' },
  ARCHIVEE: { label: 'Archivée', color: 'bg-orange-100 text-orange-700' },
};

interface GridEditorProps {
  gridId: string;
}

export function GridEditor({ gridId }: GridEditorProps) {
  const { data: grid, isLoading } = useGrid(gridId);
  const updateGrid = useUpdateGrid(gridId);
  const publishGrid = usePublishGrid(gridId);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  if (isLoading || !grid) {
    return <div className='text-center text-gray-500 py-12'>Chargement...</div>;
  }

  const isBrouillon = grid.statut === 'BROUILLON';

  const handleSaveTitle = () => {
    updateGrid.mutate(
      { titre, description: description || undefined },
      { onSuccess: () => setEditingTitle(false) },
    );
  };

  const handlePublish = () => {
    if (
      window.confirm(
        "Publier cette grille ? L'ancienne grille publiée sera automatiquement archivée.",
      )
    ) {
      publishGrid.mutate();
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          {editingTitle ? (
            <div className='space-y-2'>
              <input
                type='text'
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className='text-xl font-bold rounded-lg border border-gray-300 px-3 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className='w-full rounded-lg border border-gray-300 px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
              <div className='flex gap-2'>
                <button
                  onClick={handleSaveTitle}
                  className='rounded bg-brand-500 px-3 py-1 text-xs text-white hover:bg-brand-600'>
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditingTitle(false)}
                  className='rounded border px-3 py-1 text-xs text-gray-600 dark:text-gray-300'>
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {grid.titre}
                {isBrouillon && (
                  <button
                    onClick={() => {
                      setTitre(grid.titre);
                      setDescription(grid.description || '');
                      setEditingTitle(true);
                    }}
                    className='ml-2 text-sm text-brand-500 hover:text-brand-600'>
                    Modifier
                  </button>
                )}
              </h2>
              {grid.description && (
                <p className='text-sm text-gray-500 mt-1'>{grid.description}</p>
              )}
            </div>
          )}
        </div>

        <div className='flex items-center gap-3'>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_LABELS[grid.statut].color}`}>
            {STATUS_LABELS[grid.statut].label}
          </span>
          {isBrouillon && (
            <button
              onClick={handlePublish}
              disabled={publishGrid.isPending}
              className='rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors'>
              {publishGrid.isPending ? 'Publication...' : 'Publier'}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
        <StatCard label='Axes' value={grid.axes.length} />
        <StatCard
          label='Questions'
          value={grid.axes.reduce((sum, a) => sum + a.questions.length, 0)}
        />
        <StatCard label='Version' value={grid.version} />
      </div>

      {/* Axes */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Axes d'évaluation
          </h3>
          {isBrouillon && (
            <AddAxisButton gridId={gridId} axesCount={grid.axes.length} />
          )}
        </div>

        {grid.axes.length === 0 ? (
          <p className='text-sm text-gray-500 py-4 text-center'>
            Aucun axe configuré. Ajoutez un axe pour commencer.
          </p>
        ) : (
          grid.axes.map((axis) => (
            <AxisCard
              key={axis.id}
              axis={axis}
              gridId={gridId}
              editable={isBrouillon}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ========== Sub-components ==========

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
      <p className='text-2xl font-bold text-brand-600'>{value}</p>
      <p className='text-sm text-gray-500'>{label}</p>
    </div>
  );
}

function AddAxisButton({
  gridId,
  axesCount,
}: {
  gridId: string;
  axesCount: number;
}) {
  const addAxis = useAddAxis(gridId);
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = () => {
    if (!nom.trim()) return;
    addAxis.mutate(
      { nom, description: desc || undefined, sortOrder: axesCount + 1 },
      {
        onSuccess: () => {
          setOpen(false);
          setNom('');
          setDesc('');
        },
      },
    );
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className='rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-brand-400 hover:text-brand-600 dark:border-gray-600 dark:text-gray-400'>
        + Ajouter un axe
      </button>
    );
  }

  return (
    <div className='flex items-end gap-2'>
      <input
        type='text'
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom de l'axe"
        className='rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'
        autoFocus
      />
      <input
        type='text'
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder='Description (optionnel)'
        className='rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'
      />
      <button
        onClick={handleAdd}
        disabled={!nom.trim() || addAxis.isPending}
        className='rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-50'>
        Ajouter
      </button>
      <button
        onClick={() => setOpen(false)}
        className='rounded-lg border px-3 py-2 text-sm text-gray-600 dark:text-gray-300'>
        Annuler
      </button>
    </div>
  );
}

function AxisCard({
  axis,
  gridId,
  editable,
}: {
  axis: AssessmentAxis;
  gridId: string;
  editable: boolean;
}) {
  const removeAxis = useRemoveAxis(gridId);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  return (
    <div className='rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-700'>
        <div>
          <span className='text-xs font-medium text-brand-500 mr-2'>
            Axe {axis.sortOrder}
          </span>
          <span className='font-semibold text-gray-900 dark:text-white'>
            {axis.nom}
          </span>
          {axis.description && (
            <p className='text-xs text-gray-500 mt-0.5'>{axis.description}</p>
          )}
        </div>
        {editable && (
          <div className='flex gap-2'>
            <button
              onClick={() => setShowAddQuestion(true)}
              className='text-xs text-brand-500 hover:text-brand-600 font-medium'>
              + Question
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Supprimer l'axe "${axis.nom}" ?`)) {
                  removeAxis.mutate(axis.id);
                }
              }}
              className='text-xs text-red-500 hover:text-red-600'>
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className='divide-y divide-gray-50 dark:divide-gray-700'>
        {axis.questions.length === 0 ? (
          <p className='px-5 py-3 text-sm text-gray-400 italic'>
            Aucune question
          </p>
        ) : (
          axis.questions.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              gridId={gridId}
              axisId={axis.id}
              editable={editable}
            />
          ))
        )}

        {showAddQuestion && editable && (
          <AddQuestionForm
            gridId={gridId}
            axisId={axis.id}
            questionsCount={axis.questions.length}
            onClose={() => setShowAddQuestion(false)}
          />
        )}
      </div>
    </div>
  );
}

function QuestionRow({
  question,
  gridId,
  axisId,
  editable,
}: {
  question: AssessmentQuestion;
  gridId: string;
  axisId: string;
  editable: boolean;
}) {
  const removeQuestion = useRemoveQuestion(gridId, axisId);

  return (
    <div className='flex items-center justify-between px-5 py-2.5'>
      <div className='flex items-center gap-3'>
        <span className='text-xs text-gray-400 w-6 text-right'>
          {question.sortOrder}.
        </span>
        <span className='text-sm text-gray-800 dark:text-gray-200'>
          {question.libelle}
        </span>
        {question.obligatoire && (
          <span className='text-xs text-red-400'>*</span>
        )}
      </div>
      <div className='flex items-center gap-3'>
        <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
          {QUESTION_TYPE_LABELS[question.type]}
        </span>
        {editable && (
          <button
            onClick={() => removeQuestion.mutate(question.id)}
            className='text-xs text-red-400 hover:text-red-600'>
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function AddQuestionForm({
  gridId,
  axisId,
  questionsCount,
  onClose,
}: {
  gridId: string;
  axisId: string;
  questionsCount: number;
  onClose: () => void;
}) {
  const addQuestion = useAddQuestion(gridId, axisId);
  const [libelle, setLibelle] = useState('');
  const [type, setType] = useState<QuestionType>('OUI_NON');
  const [obligatoire, setObligatoire] = useState(true);

  const handleSubmit = () => {
    if (!libelle.trim()) return;
    addQuestion.mutate(
      { libelle, type, obligatoire, sortOrder: questionsCount + 1 },
      {
        onSuccess: () => {
          setLibelle('');
        },
      },
    );
  };

  return (
    <div className='px-5 py-3 bg-gray-50 dark:bg-gray-900/30 space-y-3'>
      <div className='flex gap-2 items-end'>
        <div className='flex-1'>
          <input
            type='text'
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            placeholder='Libellé de la question'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            autoFocus
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
          className='rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'>
          <option value='OUI_NON'>Oui / Non</option>
          <option value='ECHELLE_1_5'>Échelle 1-5</option>
          <option value='TEXTE_LIBRE'>Texte libre</option>
        </select>
        <label className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400'>
          <input
            type='checkbox'
            checked={obligatoire}
            onChange={(e) => setObligatoire(e.target.checked)}
            className='rounded'
          />
          Obligatoire
        </label>
      </div>
      <div className='flex gap-2 justify-end'>
        <button
          onClick={onClose}
          className='rounded border px-3 py-1 text-xs text-gray-600 dark:text-gray-300'>
          Fermer
        </button>
        <button
          onClick={handleSubmit}
          disabled={!libelle.trim() || addQuestion.isPending}
          className='rounded bg-brand-500 px-3 py-1 text-xs text-white hover:bg-brand-600 disabled:opacity-50'>
          Ajouter
        </button>
      </div>
    </div>
  );
}
