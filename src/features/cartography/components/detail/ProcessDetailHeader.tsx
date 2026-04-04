import { Badge, Button } from '@/components/ui';
import type { ProcessView } from '../../processTypes';
import { PROCESS_STATUTS, PROCESS_TYPES } from '../../processTypes';
import { ArrowLeft, ClipboardCheck, Edit2, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPE_ACCENT: Record<string, string> = {
  MANAGEMENT: 'from-blue-500 to-blue-600',
  REALISATION: 'from-green-500 to-green-600',
  SUPPORT: 'from-purple-500 to-purple-600',
};

interface Props {
  process: ProcessView;
  onEvaluateMaturity?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function ProcessDetailHeader({
  process,
  onEvaluateMaturity,
  onDelete,
  isDeleting = false,
}: Props) {
  const typeInfo = PROCESS_TYPES.find((t) => t.value === process.type);
  const statutInfo = PROCESS_STATUTS.find((s) => s.value === process.statut);
  const accent = TYPE_ACCENT[process.type] ?? 'from-gray-500 to-gray-600';

  return (
    <div className='rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-theme-sm'>
      {/* Accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />

      <div className='p-6'>
        {/* Back nav */}
        <Link
          to='/cartographie/processus'
          className='inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors'>
          <ArrowLeft className='w-4 h-4' />
          Retour à la liste
        </Link>

        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
          <div className='space-y-3'>
            {/* Title */}
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white leading-tight'>
                Fiche d'Identité Processus (FIP)
              </h1>
              <p className='text-lg text-gray-600 dark:text-gray-300 mt-0.5'>
                de{' '}
                <span className='font-semibold text-gray-900 dark:text-white'>
                  {process.nom}
                </span>
              </p>
            </div>

            {/* Badges */}
            <div className='flex items-center gap-2 flex-wrap'>
              <Badge
                variant='default'
                className={`text-xs ${typeInfo?.color ?? ''}`}>
                {typeInfo?.label ?? process.type}
              </Badge>
              <Badge
                variant='default'
                className={`text-xs ${statutInfo?.color ?? ''}`}>
                {statutInfo?.label ?? process.statut}
              </Badge>
              {process.processusCle && (
                <Badge
                  variant='default'
                  className='text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'>
                  <Star className='w-3 h-3 mr-1 fill-current' />
                  Processus clé
                </Badge>
              )}
              <span className='text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded'>
                {process.codification}
              </span>
              <span className='text-xs font-mono text-gray-400'>
                v{process.versionNumber}
              </span>
            </div>

            {/* Description */}
            {process.description && (
              <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed'>
                {process.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2 shrink-0'>
            {onDelete && (
              <Button
                variant='destructive'
                onClick={onDelete}
                isLoading={isDeleting}>
                <Trash2 className='w-4 h-4 mr-2' />
                Supprimer
              </Button>
            )}
            {onEvaluateMaturity && (
              <Button variant='secondary' onClick={onEvaluateMaturity}>
                <ClipboardCheck className='w-4 h-4 mr-2' />
                Évaluer la maturité
              </Button>
            )}
            <Link to={`/cartographie/processus/${process.id}/edit`}>
              <Button>
                <Edit2 className='w-4 h-4 mr-2' />
                Modifier la FIP
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
