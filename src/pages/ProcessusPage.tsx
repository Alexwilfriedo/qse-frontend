import { Badge, Button, Card, PageHeader, SkeletonCard } from '@/components/ui';
import {
  CreateProcessModal,
  MaturityMatrixView,
  ProcessMapCanvas,
} from '@/features/cartography/components';
import { useProcessMap } from '@/features/cartography/hooks';
import type { ProcessView } from '@/features/cartography/processTypes';
import { PROCESS_TYPES } from '@/features/cartography/processTypes';
import {
  BarChart3,
  GitBranch,
  Layers,
  List,
  Plus,
  Share2,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProcessCard({
  process,
  onClick,
}: {
  process: ProcessView;
  onClick: () => void;
}) {
  const typeInfo = PROCESS_TYPES.find((t) => t.value === process.type);

  return (
    <div
      onClick={onClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className='flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='font-medium text-gray-900 dark:text-gray-100 truncate'>
              {process.nom}
            </span>
            <span className='text-xs text-gray-500 font-mono'>
              {process.codification}
            </span>
          </div>
          {process.description && (
            <p className='text-sm text-gray-500 truncate mt-0.5'>
              {process.description}
            </p>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2 shrink-0'>
        {process.processusCle && (
          <Badge
            variant='default'
            className='text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'>
            Clé
          </Badge>
        )}
        <Badge variant='default' className={`text-xs ${typeInfo?.color ?? ''}`}>
          {typeInfo?.label ?? process.type}
        </Badge>
      </div>
    </div>
  );
}

function ProcessTypeSection({
  title,
  processes,
  color,
  onProcessClick,
}: {
  title: string;
  processes: ProcessView[];
  color: string;
  onProcessClick: (id: string) => void;
}) {
  if (processes.length === 0) return null;

  return (
    <div>
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${color}`}>
        <Layers className='w-4 h-4' />
        <h3 className='font-semibold text-sm uppercase tracking-wide'>
          {title}
        </h3>
        <span className='text-xs text-gray-500'>({processes.length})</span>
      </div>
      <div className='space-y-2'>
        {processes.map((p) => (
          <ProcessCard
            key={p.id}
            process={p}
            onClick={() => onProcessClick(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

type ViewMode = 'graph' | 'list' | 'maturity';

export default function ProcessusPage() {
  const { data: map, isLoading } = useProcessMap();
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();
  const handleProcessClick = useCallback(
    (id: string) => navigate(`/cartographie/processus/${id}`),
    [navigate],
  );

  const isEmpty =
    !isLoading &&
    map &&
    map.management.length === 0 &&
    map.realisation.length === 0 &&
    map.support.length === 0;

  const totalProcesses = map
    ? map.management.length + map.realisation.length + map.support.length
    : 0;

  return (
    <div className='flex flex-col gap-6 h-[calc(100vh-7rem)]'>
      <PageHeader
        title='Processus'
        description='Cartographie et gestion des processus'
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouveau processus
          </Button>
        }
      />

      {!isLoading && map && !isEmpty && (
        <div className='flex items-center gap-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-theme-xs w-fit'>
          <div className='p-2.5 rounded-xl bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'>
            <GitBranch className='w-5 h-5' />
          </div>
          <div>
            <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
              Processus
            </p>
            <p className='text-xl font-bold text-gray-900 dark:text-white'>
              {totalProcesses}
            </p>
            <p className='text-[11px] text-gray-400 dark:text-gray-500'>
              {map.management.length} mgmt · {map.realisation.length} réal. ·{' '}
              {map.support.length} support
            </p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {isEmpty && (
        <Card>
          <div className='p-12 text-center'>
            <GitBranch className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
              Aucun processus
            </h3>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Commencez par créer vos processus de management, réalisation et
              support.
            </p>
            <Button className='mt-4' onClick={() => setIsCreateOpen(true)}>
              <Plus className='w-4 h-4 mr-2' />
              Créer le premier processus
            </Button>
          </div>
        </Card>
      )}

      {map && !isEmpty && (
        <Card padding='none' className='flex-1 min-h-0 flex flex-col'>
          <div className='flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50'>
            <div className='flex items-center gap-2.5'>
              <Share2 className='w-4 h-4 text-gray-400' />
              <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                Cartographie des processus
              </span>
            </div>
            <div className='flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-white dark:bg-gray-800 shadow-theme-xs'>
              <button
                type='button'
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'graph'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}>
                <Share2 className='w-3.5 h-3.5' />
                Graphique
              </button>
              <button
                type='button'
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}>
                <List className='w-3.5 h-3.5' />
                Liste
              </button>
              <button
                type='button'
                onClick={() => setViewMode('maturity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'maturity'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}>
                <BarChart3 className='w-3.5 h-3.5' />
                Maturité
              </button>
            </div>
          </div>

          {viewMode === 'graph' && (
            <div className='flex-1 min-h-0 overflow-auto'>
              <ProcessMapCanvas map={map} onProcessClick={handleProcessClick} />
            </div>
          )}

          {viewMode === 'list' && (
            <div className='flex-1 min-h-0 overflow-y-auto'>
              <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <ProcessTypeSection
                  title='Management'
                  processes={map.management}
                  color='border-blue-500'
                  onProcessClick={handleProcessClick}
                />
                <ProcessTypeSection
                  title='Réalisation'
                  processes={map.realisation}
                  color='border-green-500'
                  onProcessClick={handleProcessClick}
                />
                <ProcessTypeSection
                  title='Support'
                  processes={map.support}
                  color='border-purple-500'
                  onProcessClick={handleProcessClick}
                />
              </div>
            </div>
          )}

          {viewMode === 'maturity' && <MaturityMatrixView />}
        </Card>
      )}

      <CreateProcessModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
