import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { CreateDocumentModal } from './components/CreateDocumentModal';
import { DocumentTable } from './components/DocumentTable';
import { useDocuments } from './hooks/useStrategy';
import type { StrategicDocumentType } from './types';
import { DOCUMENT_TYPE_LABELS } from './types';

interface StrategicDocTypePageProps {
  sectionTitle: string;
  sectionDescription: string;
  documentTypes: StrategicDocumentType[];
}

/**
 * Page générique pour afficher les documents stratégiques d'une section.
 * Filtre par un ou plusieurs StrategicDocumentType et permet la création
 * avec le type pré-sélectionné.
 */
export function StrategicDocTypePage({
  sectionTitle,
  sectionDescription,
  documentTypes,
}: StrategicDocTypePageProps) {
  const [showCreate, setShowCreate] = useState(false);

  const { data: allDocuments, isLoading } = useDocuments();
  const documents = (allDocuments ?? []).filter((d) =>
    documentTypes.includes(d.type),
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {sectionTitle}
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {sectionDescription}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Nouveau document</Button>
      </div>

      {documentTypes.length > 1 && (
        <div className='flex gap-2 flex-wrap'>
          {documentTypes.map((t) => (
            <span
              key={t}
              className='inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300'>
              {DOCUMENT_TYPE_LABELS[t]}
            </span>
          ))}
        </div>
      )}

      <Card>
        {isLoading ? (
          <SkeletonTable rows={5} columns={4} />
        ) : (
          <DocumentTable documents={documents} />
        )}
      </Card>

      <CreateDocumentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        allowedTypes={documentTypes}
      />
    </div>
  );
}
