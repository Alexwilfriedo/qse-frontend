import { Button, DataTable } from '@/components/ui';
import { useUserName } from '@/features/admin/hooks/useUsers';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import type { WorkUnitView } from '../workUnitTypes';

interface Props {
  workUnits: WorkUnitView[] | undefined;
  isLoading: boolean;
  onView: (unit: WorkUnitView) => void;
  onEdit: (unit: WorkUnitView) => void;
  onDelete: (unit: WorkUnitView) => void;
}

export function WorkUnitTable({
  workUnits,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const ChefUniteValue = ({ userId }: { userId: string | null }) => {
    const userName = useUserName(userId);
    return (
      <span className='text-sm text-gray-600 dark:text-gray-400'>{userName}</span>
    );
  };

  const columns = [
    {
      key: 'name',
      header: "Nom de l'UT",
      render: (u: WorkUnitView) => (
        <button
          onClick={() => onView(u)}
          className='font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 text-left'>
          {u.name}
        </button>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      render: (u: WorkUnitView) => (
        <span className='text-sm text-gray-600 dark:text-gray-400 font-mono'>
          {u.code}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Site',
      render: (u: WorkUnitView) => (
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {u.location}
        </span>
      ),
    },
    {
      key: 'chefUnite',
      header: "Chef d'unité",
      render: (u: WorkUnitView) => <ChefUniteValue userId={u.chefUniteId} />,
    },
    {
      key: 'actions',
      header: '',
      render: (u: WorkUnitView) => (
        <div className='flex gap-1 justify-end'>
          <Button variant='ghost' size='sm' onClick={() => onView(u)} title='Voir'>
            <Eye className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='sm' onClick={() => onEdit(u)} title='Modifier'>
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='sm' onClick={() => onDelete(u)} title='Supprimer'>
            <Trash2 className='w-4 h-4 text-error-500' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={workUnits}
      isLoading={isLoading}
      keyExtractor={(u) => u.id}
      emptyMessage='Aucune unité de travail'
      skeletonRows={5}
    />
  );
}
