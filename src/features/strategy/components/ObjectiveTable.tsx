import { Badge } from '../../../components/ui/Badge';
import type { StrategicObjective } from '../types';
import { OBJECTIVE_STATUT_COLORS, OBJECTIVE_STATUT_LABELS } from '../types';

interface ObjectiveTableProps {
  objectives: StrategicObjective[];
  onSelect?: (obj: StrategicObjective) => void;
}

export function ObjectiveTable({ objectives, onSelect }: ObjectiveTableProps) {
  if (objectives.length === 0) {
    return (
      <div className='py-8 text-center text-gray-500'>
        Aucun objectif stratégique trouvé.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Objectif
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              KPI
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Avancement
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Échéance
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Statut
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {objectives.map((obj) => (
            <tr
              key={obj.id}
              className='hover:bg-gray-50 cursor-pointer'
              onClick={() => onSelect?.(obj)}>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-900'>{obj.titre}</span>
                  {obj.enEcart && <Badge variant='error'>En écart</Badge>}
                </div>
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>
                {obj.kpiNom}
                {obj.kpiUnite && ` (${obj.kpiUnite})`}
              </td>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-24 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-brand-500 rounded-full transition-all'
                      style={{ width: `${Math.min(obj.tauxAvancement, 100)}%` }}
                    />
                  </div>
                  <span className='text-xs text-gray-500'>
                    {obj.valeurActuelle}/{obj.cible}
                  </span>
                </div>
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>
                {obj.echeance}
              </td>
              <td className='px-4 py-3'>
                <Badge
                  variant={
                    OBJECTIVE_STATUT_COLORS[obj.statut] as
                      | 'success'
                      | 'error'
                      | 'info'
                      | 'default'
                  }>
                  {OBJECTIVE_STATUT_LABELS[obj.statut]}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
