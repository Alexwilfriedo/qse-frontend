import { Badge } from '../../../components/ui/Badge';
import type { RegulatoryWatch } from '../types';
import {
  REGULATORY_CATEGORY_LABELS,
  COMPLIANCE_STATUT_LABELS,
  COMPLIANCE_STATUT_COLORS,
} from '../types';

interface RegulatoryWatchTableProps {
  watches: RegulatoryWatch[];
  onSelect?: (w: RegulatoryWatch) => void;
}

export function RegulatoryWatchTable({ watches, onSelect }: RegulatoryWatchTableProps) {
  if (watches.length === 0) {
    return (
      <div className='py-8 text-center text-gray-500'>
        Aucun élément de veille réglementaire trouvé.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Titre</th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Catégorie</th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Référence</th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Revue</th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Conformité</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {watches.map((w) => (
            <tr
              key={w.id}
              className='hover:bg-gray-50 cursor-pointer'
              onClick={() => onSelect?.(w)}>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-900'>{w.titre}</span>
                  {w.revueEnRetard && <Badge variant='error'>En retard</Badge>}
                  {!w.revueEnRetard && w.revueProche && <Badge variant='warning'>Bientôt</Badge>}
                </div>
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>
                {REGULATORY_CATEGORY_LABELS[w.categorie]}
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>
                {w.referenceTexte || '—'}
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>{w.dateRevue}</td>
              <td className='px-4 py-3'>
                <Badge variant={COMPLIANCE_STATUT_COLORS[w.statut] as 'success' | 'warning' | 'error'}>
                  {COMPLIANCE_STATUT_LABELS[w.statut]}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
