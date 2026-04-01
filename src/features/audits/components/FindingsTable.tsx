import { Skeleton } from '@/components/ui/Skeleton';
import type { AuditFinding, FindingType } from '../types';

interface Props {
  findings: AuditFinding[] | undefined;
  isLoading: boolean;
}

const TYPE_LABELS: Record<FindingType, string> = {
  PF: 'Point fort',
  PP: 'Piste de progrès',
  PS: 'Point sensible',
  NCM: 'NC Majeure',
  NCm: 'NC Mineure',
};

const TYPE_COLORS: Record<FindingType, string> = {
  PF: 'bg-green-100 text-green-800',
  PP: 'bg-blue-100 text-blue-800',
  PS: 'bg-orange-100 text-orange-800',
  NCM: 'bg-red-100 text-red-800',
  NCm: 'bg-amber-100 text-amber-800',
};

export function FindingsTable({ findings, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className='p-4 space-y-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (!findings?.length) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Aucun constat enregistré pour cet audit.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead className='bg-gray-50 text-left text-gray-600'>
          <tr>
            <th className='px-4 py-3 font-medium w-12'>#</th>
            <th className='px-4 py-3 font-medium'>Constat</th>
            <th className='px-4 py-3 font-medium'>Classification</th>
            <th className='px-4 py-3 font-medium'>Écart</th>
            <th className='px-4 py-3 font-medium'>Recommandation</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {findings.map((f, index) => (
            <tr key={f.id} className='hover:bg-gray-50'>
              <td className='px-4 py-3 text-gray-500'>{index + 1}</td>
              <td className='px-4 py-3'>
                <p className='text-gray-800 line-clamp-2'>{f.description}</p>
              </td>
              <td className='px-4 py-3'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[f.type]}`}
                >
                  {TYPE_LABELS[f.type]}
                </span>
              </td>
              <td className='px-4 py-3 text-gray-600'>
                {f.ecartDescription ? (
                  <p className='line-clamp-2'>{f.ecartDescription}</p>
                ) : (
                  <span className='text-gray-400'>—</span>
                )}
              </td>
              <td className='px-4 py-3 text-gray-600'>
                {f.recommandation ? (
                  <p className='line-clamp-2'>{f.recommandation}</p>
                ) : (
                  <span className='text-gray-400'>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
