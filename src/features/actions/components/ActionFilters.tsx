import { Button, DatePicker, Input, Select } from '@/components/ui';
import { useAuthStore } from '@/features/auth/authStore';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { ACTION_TYPE_OPTIONS } from '../actionOptions';
import type {
  ActionPriorite,
  ActionsFilter,
  ActionStatut,
  ActionType,
  Domaine,
} from '../types';

interface ActionFiltersProps {
  filters: ActionsFilter;
  onChange: (filters: Partial<ActionsFilter>) => void;
}

const STATUTS: { value: ActionStatut; label: string }[] = [
  { value: 'OUVERTE', label: 'Ouverte' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'VALIDEE', label: 'Validée' },
  { value: 'REFUSEE', label: 'Refusée' },
];

const DOMAINES: { value: Domaine; label: string }[] = [
  { value: 'QUALITE', label: 'Qualité' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
];

const TYPES: { value: ActionType; label: string }[] = ACTION_TYPE_OPTIONS;

const PRIORITES: { value: ActionPriorite; label: string }[] = [
  { value: 'BASSE', label: 'Basse' },
  { value: 'MOYENNE', label: 'Moyenne' },
  { value: 'HAUTE', label: 'Haute' },
  { value: 'CRITIQUE', label: 'Critique' },
];

const SORTS = [
  { value: 'echeance,asc', label: 'Échéance (proche)' },
  { value: 'echeance,desc', label: 'Échéance (loin)' },
  { value: 'createdAt,desc', label: 'Plus récent' },
  { value: 'createdAt,asc', label: 'Plus ancien' },
  { value: 'priorite,desc', label: 'Priorité (haute)' },
];

export function ActionFilters({ filters, onChange }: ActionFiltersProps) {
  const user = useAuthStore((state) => state.user);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  const handleMesActionsChange = (checked: boolean) => {
    onChange({ responsableId: checked ? user?.id : undefined });
  };

  const handleSearch = () => {
    onChange({ search: searchInput || undefined });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    onChange({
      statut: undefined,
      domaine: undefined,
      type: undefined,
      priorite: undefined,
      responsableId: undefined,
      enRetard: undefined,
      echeanceDebut: undefined,
      echeanceFin: undefined,
      search: undefined,
      sort: undefined,
    });
  };

  const hasActiveFilters =
    filters.statut ||
    filters.domaine ||
    filters.type ||
    filters.priorite ||
    filters.responsableId ||
    filters.enRetard ||
    filters.echeanceDebut ||
    filters.echeanceFin ||
    filters.search;

  const getActiveFilterBadges = () => {
    const badges: { key: string; label: string; onRemove: () => void }[] = [];

    if (filters.statut) {
      const label =
        STATUTS.find((s) => s.value === filters.statut)?.label ||
        filters.statut;
      badges.push({
        key: 'statut',
        label: `Statut: ${label}`,
        onRemove: () => onChange({ statut: undefined }),
      });
    }
    if (filters.domaine) {
      const label =
        DOMAINES.find((d) => d.value === filters.domaine)?.label ||
        filters.domaine;
      badges.push({
        key: 'domaine',
        label: `Domaine: ${label}`,
        onRemove: () => onChange({ domaine: undefined }),
      });
    }
    if (filters.type) {
      const label =
        TYPES.find((t) => t.value === filters.type)?.label || filters.type;
      badges.push({
        key: 'type',
        label: `Type: ${label}`,
        onRemove: () => onChange({ type: undefined }),
      });
    }
    if (filters.priorite) {
      const label =
        PRIORITES.find((p) => p.value === filters.priorite)?.label ||
        filters.priorite;
      badges.push({
        key: 'priorite',
        label: `Priorité: ${label}`,
        onRemove: () => onChange({ priorite: undefined }),
      });
    }
    if (filters.responsableId) {
      badges.push({
        key: 'responsable',
        label: 'Mes actions',
        onRemove: () => onChange({ responsableId: undefined }),
      });
    }
    if (filters.enRetard) {
      badges.push({
        key: 'enRetard',
        label: 'En retard',
        onRemove: () => onChange({ enRetard: undefined }),
      });
    }
    if (filters.echeanceDebut || filters.echeanceFin) {
      const label = `Échéance: ${filters.echeanceDebut || '...'} → ${filters.echeanceFin || '...'}`;
      badges.push({
        key: 'echeance',
        label,
        onRemove: () =>
          onChange({ echeanceDebut: undefined, echeanceFin: undefined }),
      });
    }
    if (filters.search) {
      badges.push({
        key: 'search',
        label: `"${filters.search}"`,
        onRemove: () => {
          setSearchInput('');
          onChange({ search: undefined });
        },
      });
    }
    return badges;
  };

  return (
    <div className='space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {getActiveFilterBadges().map((badge) => (
            <span
              key={badge.key}
              className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300 rounded-full'>
              {badge.label}
              <button
                onClick={badge.onRemove}
                className='hover:bg-brand-200 dark:hover:bg-brand-800 rounded-full p-0.5'>
                <X className='h-3 w-3' />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className='flex flex-wrap gap-4 items-center'>
        <div className='flex-1 min-w-[200px] relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Rechercher une action...'
            className='pl-10'
          />
        </div>

        <Select
          value={filters.statut ?? ''}
          onChange={(e) =>
            onChange({ statut: (e.target.value as ActionStatut) || undefined })
          }
          options={[{ value: '', label: 'Tous les statuts' }, ...STATUTS]}
          fullWidth={false}
        />

        <Select
          value={filters.domaine ?? ''}
          onChange={(e) =>
            onChange({ domaine: (e.target.value as Domaine) || undefined })
          }
          options={[{ value: '', label: 'Tous les domaines' }, ...DOMAINES]}
          fullWidth={false}
        />

        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowAdvanced(!showAdvanced)}>
          <SlidersHorizontal className='h-4 w-4 mr-1' />
          Filtres avancés
        </Button>

        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={handleResetFilters}>
            <X className='h-4 w-4 mr-1' />
            Réinitialiser
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className='flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Select
            value={filters.type ?? ''}
            onChange={(e) =>
              onChange({ type: (e.target.value as ActionType) || undefined })
            }
            options={[{ value: '', label: 'Tous les types' }, ...TYPES]}
            fullWidth={false}
          />

          <Select
            value={filters.priorite ?? ''}
            onChange={(e) =>
              onChange({
                priorite: (e.target.value as ActionPriorite) || undefined,
              })
            }
            options={[{ value: '', label: 'Toutes priorités' }, ...PRIORITES]}
            fullWidth={false}
          />

          <Select
            value={filters.sort ?? ''}
            onChange={(e) => onChange({ sort: e.target.value || undefined })}
            options={[{ value: '', label: 'Trier par...' }, ...SORTS]}
            fullWidth={false}
          />

          <div className='flex items-center gap-2'>
            <DatePicker
              label='Échéance du'
              value={filters.echeanceDebut ?? ''}
              onChange={(v) => onChange({ echeanceDebut: v || undefined })}
              clearable
            />
            <DatePicker
              label='au'
              value={filters.echeanceFin ?? ''}
              onChange={(v) => onChange({ echeanceFin: v || undefined })}
              clearable
            />
          </div>

          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={
                !!filters.responsableId && filters.responsableId === user?.id
              }
              onChange={(e) => handleMesActionsChange(e.target.checked)}
              className='rounded border-gray-300'
            />
            Mes actions
          </label>

          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={filters.enRetard ?? false}
              onChange={(e) =>
                onChange({ enRetard: e.target.checked || undefined })
              }
              className='rounded border-gray-300'
            />
            En retard uniquement
          </label>
        </div>
      )}
    </div>
  );
}
