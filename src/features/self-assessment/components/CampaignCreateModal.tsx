import { useState } from 'react';
import { Modal } from '@/components/ui';
import { useCreateCampaign } from '../hooks/useSelfAssessmentCampaigns';
import { useGrids } from '../hooks/useSelfAssessmentConfig';
import { processesApi } from '@/features/cartography/processesApi';
import { useQuery } from '@tanstack/react-query';
import type { ProcessView } from '@/features/cartography/processTypes';

interface Props {
  onClose: () => void;
}

export function CampaignCreateModal({ onClose }: Props) {
  const { data: grids } = useGrids();
  const { data: processMap } = useQuery({
    queryKey: ['processes', 'map'],
    queryFn: processesApi.getMap,
  });
  const createMutation = useCreateCampaign();

  const [titre, setTitre] = useState('');
  const [gridId, setGridId] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [selectedProcessIds, setSelectedProcessIds] = useState<string[]>([]);

  const publishedGrids = grids?.filter((g) => g.statut === 'PUBLIEE') ?? [];

  const allProcesses: ProcessView[] = processMap
    ? [...processMap.management, ...processMap.realisation, ...processMap.support]
    : [];

  const toggleProcess = (id: string) => {
    setSelectedProcessIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedProcessIds.length === allProcesses.length) {
      setSelectedProcessIds([]);
    } else {
      setSelectedProcessIds(allProcesses.map((p) => p.id));
    }
  };

  const canSubmit =
    titre.trim() && gridId && dateEcheance && selectedProcessIds.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createMutation.mutate(
      { titre, gridId, dateEcheance, processIds: selectedProcessIds },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal isOpen onClose={onClose} title='Nouvelle campagne'>
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Titre
          </label>
          <input
            type='text'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder='Ex: Auto-évaluation S1 2026'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Grille
          </label>
          <select
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            value={gridId}
            onChange={(e) => setGridId(e.target.value)}
          >
            <option value=''>Sélectionner une grille publiée</option>
            {publishedGrids.map((g) => (
              <option key={g.id} value={g.id}>
                {g.titre} (v{g.version})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Date d&apos;échéance
          </label>
          <input
            type='date'
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            value={dateEcheance}
            onChange={(e) => setDateEcheance(e.target.value)}
          />
        </div>

        <div>
          <div className='mb-2 flex items-center justify-between'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Processus ({selectedProcessIds.length}/{allProcesses.length})
            </label>
            <button
              type='button'
              className='text-xs text-brand-500 hover:text-brand-600'
              onClick={selectAll}
            >
              {selectedProcessIds.length === allProcesses.length
                ? 'Tout désélectionner'
                : 'Tout sélectionner'}
            </button>
          </div>
          <div className='max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-700'>
            {allProcesses.map((p) => (
              <label
                key={p.id}
                className='flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800'
              >
                <input
                  type='checkbox'
                  checked={selectedProcessIds.includes(p.id)}
                  onChange={() => toggleProcess(p.id)}
                  className='h-4 w-4 rounded border-gray-300 text-brand-500'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  {p.codification} — {p.nom}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <button
            type='button'
            className='rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type='button'
            className='rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50'
            disabled={!canSubmit || createMutation.isPending}
            onClick={handleSubmit}
          >
            {createMutation.isPending ? 'Création...' : 'Lancer la campagne'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
