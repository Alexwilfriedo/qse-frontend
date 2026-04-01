import { SkeletonCard } from '@/components/ui';
import {
  AlertTriangle,
  Box,
  CheckCircle,
  HardHat,
  PackageCheck,
  Percent,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import type { SstEpiReport } from '../sstTypes';

interface SstEpiCardsProps {
  report: SstEpiReport | undefined;
  isLoading: boolean;
}

interface EpiStatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  borderColor: string;
  textColor: string;
}

function EpiStatCard({
  label,
  value,
  description,
  icon,
  borderColor,
  textColor,
}: EpiStatCardProps) {
  return (
    <div
      className={`rounded-xl border-l-4 ${borderColor} border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-shadow hover:shadow-md`}>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400 truncate'>
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${textColor}`}>{value}</p>
          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            {description}
          </p>
        </div>
        <div className='ml-3 shrink-0'>{icon}</div>
      </div>
    </div>
  );
}

export function SstEpiCards({ report, isLoading }: SstEpiCardsProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`row1-${i}`} />
          ))}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`row2-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!report) return null;

  const rebutTotal = report.rebutTete + report.rebutMains + report.rebutPieds;
  const tauxDisponibilite =
    report.totalStock > 0
      ? (report.epiEnService / report.totalStock) * 100
      : 0;
  const tauxFormatted = tauxDisponibilite.toFixed(1);
  const tauxIsGood = tauxDisponibilite >= 90;

  return (
    <div className='space-y-4'>
      {/* Row 1: Stock overview */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <EpiStatCard
          label='Nombre Total d&#39;EPI en Stock'
          value={report.totalStock}
          description='Parc EPI complet'
          icon={<Box className='w-5 h-5 text-blue-600' />}
          borderColor='border-l-blue-500'
          textColor='text-blue-700 dark:text-blue-400'
        />
        <EpiStatCard
          label='EPI En service'
          value={report.epiEnService}
          description='Actuellement distribués'
          icon={<HardHat className='w-5 h-5 text-green-600' />}
          borderColor='border-l-green-500'
          textColor='text-green-700 dark:text-green-400'
        />
        <EpiStatCard
          label='EPI Hors Service'
          value={rebutTotal}
          description='Total mis au rebut (HS)'
          icon={<AlertTriangle className='w-5 h-5 text-red-600' />}
          borderColor='border-l-red-500'
          textColor='text-red-700 dark:text-red-400'
        />
        <EpiStatCard
          label='EPI En stockage'
          value={report.epiEnStockage}
          description='Disponibles en réserve'
          icon={<PackageCheck className='w-5 h-5 text-amber-600' />}
          borderColor='border-l-amber-500'
          textColor='text-amber-700 dark:text-amber-400'
        />
      </div>

      {/* Row 2: Rates & maintenance */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <EpiStatCard
          label='Taux de Disponibilité'
          value={`${tauxFormatted}%`}
          description={`Cible > 90% — ${report.epiEnService}/${report.totalStock}`}
          icon={<Percent className='w-5 h-5 text-indigo-600' />}
          borderColor={tauxIsGood ? 'border-l-green-500' : 'border-l-red-500'}
          textColor={
            tauxIsGood
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }
        />
        <EpiStatCard
          label='EPI En service'
          value={report.epiEnService}
          description='Unités opérationnelles'
          icon={<CheckCircle className='w-5 h-5 text-green-600' />}
          borderColor='border-l-green-500'
          textColor='text-green-700 dark:text-green-400'
        />
        <EpiStatCard
          label='EPI En Réparation'
          value={report.epiEnReparation}
          description='En maintenance / réparation'
          icon={<Wrench className='w-5 h-5 text-orange-600' />}
          borderColor='border-l-orange-500'
          textColor='text-orange-700 dark:text-orange-400'
        />
        <EpiStatCard
          label='EPI Sans contrôle'
          value={report.epiSansControle}
          description='Créés sans vérification initiale'
          icon={<ShieldAlert className='w-5 h-5 text-rose-600' />}
          borderColor='border-l-rose-500'
          textColor='text-rose-700 dark:text-rose-400'
        />
      </div>
    </div>
  );
}
