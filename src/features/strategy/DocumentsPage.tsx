import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { CreateDocumentModal } from './components/CreateDocumentModal';
import { DocumentTable } from './components/DocumentTable';
import { useDocuments } from './hooks/useStrategy';
import { DOCUMENT_TYPE_LABELS, StrategicDocumentType } from './types';

export function DocumentsPage() {
  const [typeFilter, setTypeFilter] = useState<
    StrategicDocumentType | undefined
  >();
  const [showCreate, setShowCreate] = useState(false);
  const { data: documents, isLoading } = useDocuments(typeFilter);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Documents stratégiques
        </h1>
        <Button onClick={() => setShowCreate(true)}>Nouveau document</Button>
      </div>

      <div className='flex gap-2 flex-wrap'>
        <Button
          variant={typeFilter === undefined ? 'primary' : 'secondary'}
          size='sm'
          onClick={() => setTypeFilter(undefined)}>
          Tous
        </Button>
        {Object.values(StrategicDocumentType).map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? 'primary' : 'secondary'}
            size='sm'
            onClick={() => setTypeFilter(t)}>
            {DOCUMENT_TYPE_LABELS[t]}
          </Button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <SkeletonTable rows={5} columns={5} />
        ) : (
          <DocumentTable documents={documents ?? []} />
        )}
      </Card>

      <CreateDocumentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
