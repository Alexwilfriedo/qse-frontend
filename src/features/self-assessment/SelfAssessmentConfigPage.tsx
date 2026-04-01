import { PageHeader } from '@/components/ui';
import { useState } from 'react';
import { useGrids, useCreateGrid } from './hooks/useSelfAssessmentConfig';
import { GridEditor } from './components/GridEditor';
import type { GridStatus } from './types';

const STATUS_LABELS: Record<GridStatus, { label: string; color: string }> = {
  BROUILLON: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  PUBLIEE: { label: 'Publiée', color: 'bg-green-100 text-green-700' },
  ARCHIVEE: { label: 'Archivée', color: 'bg-orange-100 text-orange-700' },
};

export default function SelfAssessmentConfigPage() {
  const { data: grids, isLoading } = useGrids();
  const createGrid = useCreateGrid();
  const [selectedGridId, setSelectedGridId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGridTitre, setNewGridTitre] = useState('');
  const [newGridDescription, setNewGridDescription] = useState('');

  const handleCreate = () => {
    if (!newGridTitre.trim()) return;
    createGrid.mutate(
      { titre: newGridTitre, description: newGridDescription || undefined },
      {
        onSuccess: (grid) => {
          setSelectedGridId(grid.id);
          setShowCreateForm(false);
          setNewGridTitre('');
          setNewGridDescription('');
        },
      },
    );
  };

  if (selectedGridId) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedGridId(null)}
          className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
          ← Retour aux grilles
        </button>
        <GridEditor gridId={selectedGridId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auto-évaluation QSE"
        description="Configuration des grilles d'auto-évaluation : axes, questions et publication"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          + Nouvelle grille
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Nouvelle grille d'auto-évaluation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre *
              </label>
              <input
                type="text"
                value={newGridTitre}
                onChange={(e) => setNewGridTitre(e.target.value)}
                placeholder="Ex : Grille Auto-évaluation QSE v1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newGridDescription}
                onChange={(e) => setNewGridDescription(e.target.value)}
                placeholder="Description optionnelle de la grille"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={!newGridTitre.trim() || createGrid.isPending}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors">
                {createGrid.isPending ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500 py-12">Chargement...</div>
      ) : !grids?.length ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">Aucune grille d'auto-évaluation</p>
          <p className="text-sm mt-1">
            Créez votre première grille pour commencer la configuration.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grids.map((grid) => (
            <button
              key={grid.id}
              onClick={() => setSelectedGridId(grid.id)}
              className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {grid.titre}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[grid.statut].color}`}>
                  {STATUS_LABELS[grid.statut].label}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <p>Version {grid.version}</p>
                <p>{grid.axesCount} axe{grid.axesCount > 1 ? 's' : ''}</p>
                {grid.updatedAt && (
                  <p className="text-xs">
                    Modifié le{' '}
                    {new Date(grid.updatedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
