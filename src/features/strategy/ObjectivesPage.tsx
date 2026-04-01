import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { CreateObjectiveModal } from './components/CreateObjectiveModal';
import { ObjectiveTable } from './components/ObjectiveTable';
import { useObjectives } from './hooks/useStrategy';
import { OBJECTIVE_STATUT_LABELS, ObjectiveStatut } from './types';

export function ObjectivesPage() {
  const [statutFilter, setStatutFilter] = useState<
    ObjectiveStatut | undefined
  >();
  const [showCreate, setShowCreate] = useState(false);
  const { data: objectives, isLoading } = useObjectives(statutFilter);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Objectifs strategiques'
        description='Suivi des objectifs et KPI du SMI'
        actions={
          <Button onClick={() => setShowCreate(true)}>Nouvel objectif</Button>
        }
      />

      <div className='flex gap-2 flex-wrap'>
        <Button
          variant={statutFilter === undefined ? 'primary' : 'secondary'}
          size='sm'
          onClick={() => setStatutFilter(undefined)}>
          Tous
        </Button>
        {Object.values(ObjectiveStatut).map((s) => (
          <Button
            key={s}
            variant={statutFilter === s ? 'primary' : 'secondary'}
            size='sm'
            onClick={() => setStatutFilter(s)}>
            {OBJECTIVE_STATUT_LABELS[s]}
          </Button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={5} columns={5} />
        ) : (
          <ObjectiveTable objectives={objectives ?? []} />
        )}
      </Card>

      <CreateObjectiveModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
