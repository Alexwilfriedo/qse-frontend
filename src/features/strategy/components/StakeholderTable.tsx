import { Badge } from '../../../components/ui/Badge';
import type { Stakeholder } from '../types';
import {
  STAKEHOLDER_CLASSIFICATION_LABELS,
  STAKEHOLDER_TYPE_LABELS,
} from '../types';

interface StakeholderTableProps {
  stakeholders: Stakeholder[];
  onSelect?: (s: Stakeholder) => void;
}

export function StakeholderTable({
  stakeholders,
  onSelect,
}: StakeholderTableProps) {
  if (stakeholders.length === 0) {
    return (
      <div className='py-8 text-center text-gray-500'>
        Aucune partie intéressée trouvée.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Nom
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Classification
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Type
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Révision
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Statut
            </th>
          </tr>
        </thead>
        <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
          {stakeholders.map((s) => (
            <tr
              key={s.id}
              className='hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
              onClick={() => onSelect?.(s)}>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {s.nom}
                  </span>
                  {s.revisionEnRetard && (
                    <Badge variant='error'>En retard</Badge>
                  )}
                  {!s.revisionEnRetard && s.revisionProche && (
                    <Badge variant='warning'>Bientôt</Badge>
                  )}
                </div>
              </td>
              <td className='px-4 py-3'>
                <Badge
                  variant={s.classification === 'INTERNE' ? 'info' : 'default'}>
                  {STAKEHOLDER_CLASSIFICATION_LABELS[s.classification]}
                </Badge>
              </td>
              <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-300'>
                {STAKEHOLDER_TYPE_LABELS[s.stakeholderType]}
              </td>
              <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-300'>
                {s.dateRevision}
              </td>
              <td className='px-4 py-3'>
                <Badge variant={s.actif ? 'success' : 'default'}>
                  {s.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
