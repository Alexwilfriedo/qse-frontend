import {
  Button,
  Card,
  CardHeader,
  Input,
  PageHeader,
  Pagination,
  Select,
} from '@/components/ui';
import type { DocumentDomaineConfig } from '@/features/configuration/configurationApi';
import { useDocumentDomaines } from '@/features/configuration/hooks';
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CreateDocumentModal,
  DeleteDocumentModal,
  DocumentTable,
} from './components';
import { useDocuments } from './hooks';
import type {
  Document,
  DocumentDomaine,
  DocumentFilters,
  DocumentStatut,
} from './types';
import { DOCUMENT_STATUTS } from './types';

const PAGE_SIZE = 20;

function parseFiltersFromUrl(sp: URLSearchParams): DocumentFilters {
  return {
    domaine: (sp.get('domaine') as DocumentDomaine) || undefined,
    statut: (sp.get('statut') as DocumentStatut) || undefined,
    search: sp.get('search') || undefined,
    page: parseInt(sp.get('page') || '0', 10),
    size: PAGE_SIZE,
  };
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<DocumentFilters>(() =>
    parseFiltersFromUrl(searchParams),
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);

  const syncFiltersToUrl = useCallback(
    (f: DocumentFilters) => {
      const params = new URLSearchParams();
      if (f.domaine) params.set('domaine', f.domaine);
      if (f.statut) params.set('statut', f.statut);
      if (f.search) params.set('search', f.search);
      if (f.page && f.page > 0) params.set('page', String(f.page));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters, syncFiltersToUrl]);

  const { data, isLoading } = useDocuments(filters);

  // Charger les domaines dynamiques
  const { data: domaines } = useDocumentDomaines(true);
  const domaineOptions = useMemo(
    () => [
      { value: '', label: 'Tous les domaines' },
      ...(domaines?.map((d: DocumentDomaineConfig) => ({
        value: d.code,
        label: d.label,
      })) ?? []),
    ],
    [domaines],
  );

  const handleFilterChange = (
    key: keyof DocumentFilters,
    value: string | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Documents QSE'
        description='Procédures, formulaires et enregistrements'
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouveau document
          </Button>
        }
      />

      <Card>
        <CardHeader
          title='Liste des documents'
          action={
            <div className='flex items-center gap-3'>
              <Select
                value={filters.domaine || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'domaine',
                    e.target.value as DocumentDomaine,
                  )
                }
                options={domaineOptions}
                fullWidth={false}
              />

              <Select
                value={filters.statut || ''}
                onChange={(e) =>
                  handleFilterChange('statut', e.target.value as DocumentStatut)
                }
                options={[
                  { value: '', label: 'Tous les statuts' },
                  ...DOCUMENT_STATUTS,
                ]}
                fullWidth={false}
              />

              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Rechercher...'
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className='pl-9 min-w-[200px]'
                />
              </div>
            </div>
          }
        />

        <DocumentTable
          documents={data?.content}
          isLoading={isLoading}
          onEdit={(doc) => navigate(`/documents/${doc.id}/edit`)}
          onDelete={setDeleteDocument}
        />

        {data && (
          <Pagination
            currentPage={data.number}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onPageChange={handlePageChange}
            pageSize={PAGE_SIZE}
          />
        )}
      </Card>

      <CreateDocumentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <DeleteDocumentModal
        isOpen={!!deleteDocument}
        onClose={() => setDeleteDocument(null)}
        document={deleteDocument}
      />
    </div>
  );
}
