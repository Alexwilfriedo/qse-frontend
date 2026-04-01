import { Link } from 'react-router-dom';
import { Card, CardHeader, SkeletonCard } from '../../components/ui';
import { Badge } from '../../components/ui/Badge';
import { useProcessMap } from '../cartography/hooks';

/**
 * Page Cartographie des Processus dans le module Contexte & Stratégie (PRD M6-18).
 * Affiche la cartographie Management / Réalisation / Support avec lien vers M1.
 */
export function ProcessCartographyPage() {
  const { data: map, isLoading } = useProcessMap();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Cartographie des Processus
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const categories = [
    {
      title: 'Processus de Management',
      processes: map?.management ?? [],
      color: 'bg-blue-50 border-blue-200',
      badgeVariant: 'info' as const,
    },
    {
      title: 'Processus de Réalisation',
      processes: map?.realisation ?? [],
      color: 'bg-green-50 border-green-200',
      badgeVariant: 'success' as const,
    },
    {
      title: 'Processus Support',
      processes: map?.support ?? [],
      color: 'bg-amber-50 border-amber-200',
      badgeVariant: 'warning' as const,
    },
  ];

  const totalProcesses =
    (map?.management.length ?? 0) +
    (map?.realisation.length ?? 0) +
    (map?.support.length ?? 0);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Cartographie des Processus
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Structure du système de management — ISO 9001/14001/45001, Chapitre
            4.4
          </p>
        </div>
        <Link
          to='/cartographie/processus'
          className='inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors'>
          Voir dans la Cartographie
          <svg
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
            />
          </svg>
        </Link>
      </div>

      <Card padding='none'>
        <CardHeader
          title="Vue d'ensemble"
          action={<Badge variant='info'>{totalProcesses} processus</Badge>}
        />
        <div className='px-6 pb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {categories.map((cat) => (
              <div
                key={cat.title}
                className={`rounded-lg border p-4 ${cat.color}`}>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-gray-700'>
                    {cat.title}
                  </h3>
                  <Badge variant={cat.badgeVariant}>
                    {cat.processes.length}
                  </Badge>
                </div>
                {cat.processes.length === 0 ? (
                  <p className='text-sm text-gray-400 italic'>
                    Aucun processus défini
                  </p>
                ) : (
                  <ul className='space-y-2'>
                    {cat.processes.map(
                      (p: { id: string; nom: string; piloteNom?: string }) => (
                        <li key={p.id}>
                          <Link
                            to={`/cartographie/processus/${p.id}`}
                            className='flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-white/60 transition-colors'>
                            <span className='font-medium text-gray-800'>
                              {p.nom}
                            </span>
                            {p.piloteNom && (
                              <span className='text-xs text-gray-500'>
                                {p.piloteNom}
                              </span>
                            )}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
