import { Skeleton } from '@/components/ui/Skeleton';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { ClipboardCheck, Pencil } from 'lucide-react';
import type { Auditor, AuditorLevel } from '../types';

interface Props {
  auditors: Auditor[] | undefined;
  isLoading: boolean;
  onOpen: (auditor: Auditor) => void;
  onEdit: (auditor: Auditor) => void;
  onEvaluate: (auditor: Auditor) => void;
}

const LEVEL_COLORS: Record<AuditorLevel, string> = {
  JUNIOR: 'bg-gray-100 text-gray-700',
  CONFIRME: 'bg-blue-100 text-blue-700',
  LEAD: 'bg-purple-100 text-purple-700',
};

export function AuditorTable({
  auditors,
  isLoading,
  onOpen,
  onEdit,
  onEvaluate,
}: Props) {
  const { data: users } = useUsers();

  if (isLoading) {
    return (
      <div className='p-4 space-y-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (!auditors?.length) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Aucun auditeur enregistre.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead className='bg-gray-50 text-left text-gray-600'>
          <tr>
            <th className='px-4 py-3 font-medium'>Nom et prénoms</th>
            <th className='px-4 py-3 font-medium'>Email</th>
            <th className='px-4 py-3 font-medium'>Niveau</th>
            <th className='px-4 py-3 font-medium'>Score moyen</th>
            <th className='px-4 py-3 font-medium'>Normes maîtrisées</th>
            <th className='px-4 py-3 font-medium'>Prochaine revue</th>
            <th className='px-4 py-3 font-medium text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {auditors.map((a) => {
            const user = users?.find((item) => item.id === a.userId);
            const fullName = user
              ? `${user.firstName} ${user.lastName}`
              : (a.nomComplet ?? `Utilisateur ${a.userId.slice(0, 8)}`);

            return (
              <tr
                key={a.id}
                className='cursor-pointer transition-colors hover:bg-gray-50'
                onClick={() => onOpen(a)}>
                <td className='px-4 py-3 font-medium'>{fullName}</td>
                <td className='px-4 py-3 text-gray-600'>
                  {user?.email ?? '-'}
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLORS[a.level]}`}>
                    {a.level}
                  </span>
                </td>
                <td className='px-4 py-3 font-medium text-gray-700'>
                  {a.scoreMoyen.toFixed(1)} / 4
                </td>
                <td className='px-4 py-3 text-gray-600'>
                  {a.perimetreNormes.join(', ') || '-'}
                </td>
                <td className='px-4 py-3 text-gray-600'>
                  {a.dateProchaineRevue ?? '-'}
                </td>
                <td className='px-4 py-3'>
                  <div className='flex justify-end gap-2'>
                    <button
                      type='button'
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(a);
                      }}
                      className='inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50'>
                      <Pencil className='h-3.5 w-3.5' />
                      Modifier
                    </button>
                    <button
                      type='button'
                      onClick={(event) => {
                        event.stopPropagation();
                        onEvaluate(a);
                      }}
                      className='inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100'>
                      <ClipboardCheck className='h-3.5 w-3.5' />
                      Évaluer
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
