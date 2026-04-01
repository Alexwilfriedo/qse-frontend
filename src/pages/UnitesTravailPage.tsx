import { Button, Card, CardHeader, PageHeader } from '@/components/ui';
import {
  CreateWorkUnitModal,
  DeleteWorkUnitModal,
  EditWorkUnitModal,
  WorkUnitTable,
} from '@/features/cartography/components';
import { useWorkUnits } from '@/features/cartography/hooks';
import type { WorkUnitView } from '@/features/cartography/workUnitTypes';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnitesTravailPage() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editWorkUnit, setEditWorkUnit] = useState<WorkUnitView | null>(null);
  const [deleteWorkUnit, setDeleteWorkUnit] = useState<WorkUnitView | null>(null);

  const { data: workUnits, isLoading } = useWorkUnits();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Unités de travail'
        description="Référentiel des unités de travail (UT)"
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouvelle unité
          </Button>
        }
      />

      <Card>
        <CardHeader title='Liste des unités de travail' />
        <WorkUnitTable
          workUnits={workUnits}
          isLoading={isLoading}
          onView={(u) => navigate(`/cartographie/unites-travail/${u.id}`)}
          onEdit={setEditWorkUnit}
          onDelete={setDeleteWorkUnit}
        />
      </Card>

      <CreateWorkUnitModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditWorkUnitModal
        isOpen={!!editWorkUnit}
        onClose={() => setEditWorkUnit(null)}
        workUnit={editWorkUnit}
      />
      <DeleteWorkUnitModal
        isOpen={!!deleteWorkUnit}
        onClose={() => setDeleteWorkUnit(null)}
        workUnit={deleteWorkUnit}
      />
    </div>
  );
}
