import { Button } from '@/components/ui';
import {
  AlertTriangle,
  Box,
  ChevronRight,
  Compass,
  Edit2,
  FileText,
  Layers,
  Package,
  Target,
  Truck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProcessView } from '../../processTypes';

interface Props {
  process: ProcessView;
}

interface FlowStepProps {
  label: string;
  value: string | null;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function FlowStep({ label, value, icon: Icon, color }: FlowStepProps) {
  return (
    <div className='flex-1 min-w-0'>
      <div
        className={`rounded-lg border p-4 h-full ${
          value
            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            : 'bg-gray-50 dark:bg-gray-800/30 border-dashed border-gray-300 dark:border-gray-600'
        }`}>
        <div className='flex items-center gap-2 mb-2'>
          <div className={`p-1.5 rounded-md ${color}`}>
            <Icon className='w-3.5 h-3.5 text-white' />
          </div>
          <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
            {label}
          </span>
        </div>
        {value ? (
          <p className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed'>
            {value}
          </p>
        ) : (
          <p className='text-xs text-gray-400 italic'>Non renseigné</p>
        )}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className='hidden lg:flex items-center justify-center shrink-0 px-1'>
      <ChevronRight className='w-5 h-5 text-gray-300 dark:text-gray-600' />
    </div>
  );
}

export function ProcessFipCard({ process }: Props) {
  const hasFipContent =
    process.axesStrategiques ||
    process.finalites ||
    process.fournisseurs ||
    process.elementsEntree ||
    process.activites ||
    process.elementsSortie ||
    process.clients ||
    process.exigencesLegales;

  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-theme-sm'>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide'>
            Contenu FIP
          </h3>
          <Link to={`/cartographie/processus/${process.id}/edit`}>
            <Button variant='secondary' size='sm'>
              <Edit2 className='w-4 h-4 mr-1' />
              {hasFipContent ? 'Modifier' : 'Renseigner'}
            </Button>
          </Link>
        </div>

        {hasFipContent ? (
          <div className='space-y-6'>
            {/* Axes stratégiques — highlight block */}
            {process.axesStrategiques && (
              <div className='rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Compass className='w-4 h-4 text-indigo-600 dark:text-indigo-400' />
                  <span className='text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide'>
                    Axes stratégiques
                  </span>
                </div>
                <p className='text-sm text-indigo-900 dark:text-indigo-100 whitespace-pre-line leading-relaxed'>
                  {process.axesStrategiques}
                </p>
              </div>
            )}

            {/* Finalités — highlight block */}
            {process.finalites && (
              <div className='rounded-lg bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Target className='w-4 h-4 text-brand-600 dark:text-brand-400' />
                  <span className='text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wide'>
                    Finalité(s) du processus
                  </span>
                </div>
                <p className='text-sm text-brand-900 dark:text-brand-100 whitespace-pre-line leading-relaxed'>
                  {process.finalites}
                </p>
              </div>
            )}

            {/* Flow: Fournisseurs → Inputs → Activités → Outputs → Clients */}
            <div className='flex flex-col lg:flex-row lg:items-stretch gap-3 lg:gap-0'>
              <FlowStep
                label='Fournisseurs'
                value={process.fournisseurs}
                icon={Truck}
                color='bg-slate-500'
              />
              <FlowArrow />
              <FlowStep
                label="Éléments d'entrée"
                value={process.elementsEntree}
                icon={Package}
                color='bg-blue-500'
              />
              <FlowArrow />
              <FlowStep
                label='Activités'
                value={process.activites}
                icon={Layers}
                color='bg-brand-500'
              />
              <FlowArrow />
              <FlowStep
                label='Éléments de sortie'
                value={process.elementsSortie}
                icon={Box}
                color='bg-green-500'
              />
              <FlowArrow />
              <FlowStep
                label='Clients'
                value={process.clients}
                icon={Users}
                color='bg-violet-500'
              />
            </div>

            {/* Exigences légales — warning-style block */}
            {process.exigencesLegales && (
              <div className='rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <AlertTriangle className='w-4 h-4 text-amber-600 dark:text-amber-400' />
                  <span className='text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide'>
                    Exigences légales & réglementaires
                  </span>
                </div>
                <p className='text-sm text-amber-900 dark:text-amber-100 whitespace-pre-line leading-relaxed'>
                  {process.exigencesLegales}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className='py-12 text-center'>
            <FileText className='mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Aucune information FIP renseignée pour ce processus.
            </p>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
              Cliquez sur « Renseigner » pour compléter la fiche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
