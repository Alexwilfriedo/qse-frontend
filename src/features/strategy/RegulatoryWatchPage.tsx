import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { CreateWatchModal } from './components/CreateWatchModal';
import { RegulatoryWatchTable } from './components/RegulatoryWatchTable';
import { useWatches } from './hooks/useStrategy';
import { REGULATORY_CATEGORY_LABELS, RegulatoryCategory } from './types';

export function RegulatoryWatchPage() {
  const [catFilter, setCatFilter] = useState<RegulatoryCategory | undefined>();
  const [showCreate, setShowCreate] = useState(false);
  const { data: watches, isLoading } = useWatches(catFilter);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Veille reglementaire'
        description='Suivi de la conformite reglementaire'
        actions={
          <Button onClick={() => setShowCreate(true)}>Nouvelle veille</Button>
        }
      />

      <div className='flex gap-2 flex-wrap'>
        <Button
          variant={catFilter === undefined ? 'primary' : 'secondary'}
          size='sm'
          onClick={() => setCatFilter(undefined)}>
          Toutes
        </Button>
        {Object.values(RegulatoryCategory).map((c) => (
          <Button
            key={c}
            variant={catFilter === c ? 'primary' : 'secondary'}
            size='sm'
            onClick={() => setCatFilter(c)}>
            {REGULATORY_CATEGORY_LABELS[c]}
          </Button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={5} columns={5} />
        ) : (
          <RegulatoryWatchTable watches={watches ?? []} />
        )}
      </Card>

      <CreateWatchModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
