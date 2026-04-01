import { Badge, SkeletonTable } from '@/components/ui';
import type { Incident } from '../types';

const DOMAINE_BADGE: Record<
  string,
  { variant: 'info' | 'warning' | 'success'; label: string }
> = {
  QUALITE: { variant: 'info', label: 'Qualité' },
  SECURITE: { variant: 'warning', label: 'Sécurité' },
  ENVIRONNEMENT: { variant: 'success', label: 'Environnement' },
};

const TYPE_LABEL: Record<string, string> = {
  ACCIDENT_AVEC_ARRET: 'Accident avec Arrêt',
  ACCIDENT_SANS_ARRET: 'Accident sans Arrêt',
  PRESQU_ACCIDENT: "Presqu'accident",
  INCIDENT: 'Incident',
  NON_CONFORMITE: 'Non-conformité',
  OPPORTUNITE: 'Opportunité',
};

const STATUS_BADGE: Record<
  string,
  { variant: 'info' | 'warning' | 'success' | 'error'; label: string }
> = {
  DECLARE: { variant: 'info', label: 'Déclaré' },
  EN_ANALYSE: { variant: 'warning', label: 'En analyse' },
  EN_TRAITEMENT: { variant: 'warning', label: 'En traitement' },
  CLOS: { variant: 'success', label: 'Clos' },
};

interface Props {
  incidents: Incident[] | undefined;
  isLoading: boolean;
  onSelect: (incident: Incident) => void;
}

export default function IncidentTable({
  incidents,
  isLoading,
  onSelect,
}: Props) {
  if (isLoading) return <SkeletonTable rows={5} columns={7} />;

  if (!incidents?.length) {
    return (
      <div className='rounded border border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700'>
        Aucun incident déclaré. Cliquez sur &quot;Déclarer un incident&quot; pour
        commencer.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Code
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Titre
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Domaine
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Type
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Date et Heure
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Statut
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {incidents.map((inc) => {
            const domBadge = DOMAINE_BADGE[inc.domaine];
            const stBadge = STATUS_BADGE[inc.status];
            return (
              <tr
                key={inc.id}
                className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                onClick={() => onSelect(inc)}>
                <td className='px-4 py-2 font-mono text-sm'>{inc.code}</td>
                <td className='px-4 py-2 text-sm font-medium'>{inc.title}</td>
                <td className='px-4 py-2'>
                  {domBadge && (
                    <Badge variant={domBadge.variant}>{domBadge.label}</Badge>
                  )}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600'>
                  {TYPE_LABEL[inc.incidentType] ?? inc.incidentType}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600'>
                  {new Date(inc.incidentDate).toLocaleString('fr-FR')}
                </td>
                <td className='px-4 py-2'>
                  {stBadge && (
                    <Badge variant={stBadge.variant}>{stBadge.label}</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
