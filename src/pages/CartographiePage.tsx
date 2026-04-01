import { Card, PageHeader, SkeletonCard } from '@/components/ui';
import { useEntityTree, useProcessMap } from '@/features/cartography/hooks';
import { useDashboard } from '@/features/kpi/hooks/useKpiQueries';
import { BarChart3, GitBranch, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({
  to,
  icon: Icon,
  label,
  value,
  description,
  color,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  description: string;
  color: string;
}) {
  return (
    <Link to={to}>
      <Card className='hover:border-brand-500 hover:shadow-theme-sm transition-all h-full'>
        <div className='p-6'>
          <div className='flex items-center gap-3 mb-3'>
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className='w-5 h-5' />
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              {label}
            </h3>
          </div>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {value}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {description}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default function CartographiePage() {
  const { data: tree, isLoading: treeLoading } = useEntityTree();
  const { data: map, isLoading: mapLoading } = useProcessMap();
  const { data: indicators, isLoading: kpiLoading } = useDashboard();

  const isLoading = treeLoading || mapLoading || kpiLoading;

  const entityCount = tree
    ? tree.reduce((acc, node) => acc + countNodes(node), 0)
    : 0;
  const processCount = map
    ? map.management.length + map.realisation.length + map.support.length
    : 0;
  const kpiCount = indicators?.length ?? 0;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Cartographie & Pilotage'
        description="Vue d'ensemble de la structure organisationnelle, des processus et des indicateurs"
      />

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatCard
            to='/cartographie/organigramme'
            icon={Network}
            label='Organigramme'
            value={entityCount}
            description='entités organisationnelles'
            color='bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
          />
          <StatCard
            to='/cartographie/processus'
            icon={GitBranch}
            label='Processus'
            value={processCount}
            description={
              map
                ? `${map.management.length} mgmt · ${map.realisation.length} réal. · ${map.support.length} support`
                : 'processus définis'
            }
            color='bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
          />
          <StatCard
            to='/cartographie/processus'
            icon={BarChart3}
            label='Indicateurs KPI'
            value={kpiCount}
            description={
              indicators
                ? `${indicators.filter((i) => i.couleurSeuil === 'VERT').length} conformes · ${indicators.filter((i) => i.couleurSeuil === 'ROUGE').length} critiques`
                : 'indicateurs actifs'
            }
            color='bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
          />
        </div>
      )}
    </div>
  );
}

function countNodes(node: { children?: { children?: unknown[] }[] }): number {
  const children = (node.children ?? []) as (typeof node)[];
  return 1 + children.reduce((acc, child) => acc + countNodes(child), 0);
}
