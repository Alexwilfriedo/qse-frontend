import { Button, Card, CardHeader, PageHeader } from '@/components/ui';
import { useUserName } from '@/features/admin/hooks/useUsers';
import {
  DeleteWorkUnitModal,
  EditWorkUnitModal,
} from '@/features/cartography/components';
import { useWorkUnit } from '@/features/cartography/hooks';
import type { WorkUnitView } from '@/features/cartography/workUnitTypes';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UniteTravailDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workUnit, isLoading, error } = useWorkUnit(id);
  const chefUniteName = useUserName(workUnit?.chefUniteId);

  const [edit, setEdit] = useState<WorkUnitView | null>(null);
  const [del, setDel] = useState<WorkUnitView | null>(null);

  const actions = workUnit ? (
    <div className='flex items-center gap-2'>
      <Button variant='secondary' onClick={() => setEdit(workUnit)}>
        <Edit2 className='w-4 h-4 mr-2' />
        Modifier
      </Button>
      <Button variant='destructive' onClick={() => setDel(workUnit)}>
        <Trash2 className='w-4 h-4 mr-2' />
        Supprimer
      </Button>
      <Button
        variant='secondary'
        onClick={() => navigate('/cartographie/unites-travail')}>
        <ArrowLeft className='w-4 h-4 mr-2' />
        Retour
      </Button>
    </div>
  ) : (
    <Button
      variant='secondary'
      onClick={() => navigate('/cartographie/unites-travail')}>
      <ArrowLeft className='w-4 h-4 mr-2' />
      Retour
    </Button>
  );

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Unité de travail'
        description={workUnit ? workUnit.code : id ? `Détail — ${id}` : 'Détail'}
        actions={actions}
      />

      <Card>
        <CardHeader title='Informations générales' />
        {isLoading && (
          <div className='p-6 space-y-3'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3'
              />
            ))}
          </div>
        )}
        {!isLoading && error && (
          <div className='p-6 text-sm text-gray-500 dark:text-gray-400'>
            Unité de travail introuvable.
          </div>
        )}
        {!isLoading && workUnit && (
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Nom</div>
              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                {workUnit.name}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Code</div>
              <div className='text-sm font-mono text-gray-900 dark:text-white'>
                {workUnit.code}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Site</div>
              <div className='text-sm text-gray-900 dark:text-white'>
                {workUnit.location}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Chef d&apos;unité
              </div>
              <div className='text-sm text-gray-900 dark:text-white'>
                {chefUniteName}
              </div>
            </div>
          </div>
        )}
      </Card>

      <EditWorkUnitModal
        isOpen={!!edit}
        onClose={() => setEdit(null)}
        workUnit={edit}
      />
      <DeleteWorkUnitModal
        isOpen={!!del}
        onClose={() => setDel(null)}
        workUnit={del}
      />
    </div>
  );
}
