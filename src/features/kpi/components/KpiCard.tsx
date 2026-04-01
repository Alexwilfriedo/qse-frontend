import { Badge } from '@/components/ui';
import { ArrowDown, ArrowRight, ArrowUp, Target } from 'lucide-react';
import type { IndicatorDashboardView } from '../kpiTypes';

const SEUIL_COLORS: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  VERT: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    label: 'Conforme',
  },
  ORANGE: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    label: 'Attention',
  },
  ROUGE: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    label: 'Critique',
  },
};

const TENDANCE_ICONS: Record<string, { icon: typeof ArrowUp; label: string }> =
  {
    HAUSSE: { icon: ArrowUp, label: 'En hausse' },
    BAISSE: { icon: ArrowDown, label: 'En baisse' },
    STABLE: { icon: ArrowRight, label: 'Stable' },
  };

const FREQUENCE_LABELS: Record<string, string> = {
  MENSUELLE: 'Mensuel',
  TRIMESTRIELLE: 'Trimestriel',
  SEMESTRIELLE: 'Semestriel',
  ANNUELLE: 'Annuel',
};

interface KpiCardProps {
  indicator: IndicatorDashboardView;
  onClick?: () => void;
}

export default function KpiCard({ indicator, onClick }: KpiCardProps) {
  const seuil = indicator.couleurSeuil
    ? SEUIL_COLORS[indicator.couleurSeuil]
    : null;
  const tendance = indicator.tendance
    ? TENDANCE_ICONS[indicator.tendance]
    : null;
  const TendanceIcon = tendance?.icon;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
      } ${seuil ? seuil.bg : 'bg-white dark:bg-gray-900'}`}>
      <div className='flex items-start justify-between mb-3'>
        <div className='min-w-0 flex-1'>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate'>
            {indicator.code}
          </p>
          <h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5 truncate'>
            {indicator.nom}
          </h4>
        </div>
        {seuil && (
          <Badge className={`ml-2 shrink-0 ${seuil.text}`}>{seuil.label}</Badge>
        )}
      </div>

      <div className='flex items-end justify-between'>
        <div>
          <p
            className={`text-2xl font-bold ${seuil ? seuil.text : 'text-gray-900 dark:text-gray-100'}`}>
            {indicator.derniereValeur != null
              ? `${indicator.derniereValeur}${indicator.unite ? ` ${indicator.unite}` : ''}`
              : '—'}
          </p>
          {indicator.periodeLabel && (
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              {indicator.periodeLabel}
            </p>
          )}
        </div>

        <div className='flex flex-col items-end gap-1'>
          {indicator.objectif != null && (
            <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
              <Target className='w-3 h-3' />
              <span>
                Obj: {indicator.objectif}
                {indicator.unite ? ` ${indicator.unite}` : ''}
              </span>
            </div>
          )}
          <div className='flex items-center gap-1'>
            {TendanceIcon && (
              <TendanceIcon
                className={`w-4 h-4 ${seuil ? seuil.text : 'text-gray-400'}`}
              />
            )}
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {FREQUENCE_LABELS[indicator.frequenceMesure] ??
                indicator.frequenceMesure}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
