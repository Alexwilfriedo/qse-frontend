import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { CreateStakeholderModal } from './components/CreateStakeholderModal';
import { StakeholderTable } from './components/StakeholderTable';
import { useStakeholders } from './hooks/useStrategy';
import {
  STAKEHOLDER_CLASSIFICATION_LABELS,
  StakeholderClassification,
} from './types';

export function StakeholdersPage() {
  const [classFilter, setClassFilter] = useState<
    StakeholderClassification | undefined
  >();
  const [showCreate, setShowCreate] = useState(false);
  const { data: stakeholders, isLoading } = useStakeholders();

  const filtered = classFilter
    ? stakeholders?.filter((s) => s.classification === classFilter)
    : stakeholders;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Cartographie des Parties Intéressées'
        description='Inventaire des parties intéressées du SMI'
        actions={
          <Button onClick={() => setShowCreate(true)}>
            Nouvelle partie intéressée
          </Button>
        }
      />

      <div className='flex gap-2 flex-wrap'>
        <Button
          variant={classFilter === undefined ? 'primary' : 'secondary'}
          size='sm'
          onClick={() => setClassFilter(undefined)}>
          Toutes
        </Button>
        {Object.values(StakeholderClassification).map((c) => (
          <Button
            key={c}
            variant={classFilter === c ? 'primary' : 'secondary'}
            size='sm'
            onClick={() => setClassFilter(c)}>
            {STAKEHOLDER_CLASSIFICATION_LABELS[c]}
          </Button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={5} columns={5} />
        ) : (
          <StakeholderTable stakeholders={filtered ?? []} />
        )}
      </Card>

      <CreateStakeholderModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
