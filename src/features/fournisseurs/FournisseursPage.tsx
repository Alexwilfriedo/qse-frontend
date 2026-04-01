import {
  Button,
  Card,
  CardHeader,
  Input,
  PageHeader,
  Pagination,
  Select,
} from '@/components/ui';
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CreateFournisseurModal,
  DeleteFournisseurModal,
  EditFournisseurModal,
  FournisseurTable,
} from './components';
import { useFournisseurs } from './hooks';
import type {
  CategorieFournisseur,
  CriticiteFournisseur,
  Fournisseur,
  FournisseurFilters,
  StatutFournisseur,
} from './types';
import {
  CATEGORIE_FOURNISSEUR_OPTIONS,
  CRITICITE_FOURNISSEUR_OPTIONS,
  STATUT_FOURNISSEUR_OPTIONS,
} from './types';

const PAGE_SIZE = 20;

function parseFiltersFromUrl(sp: URLSearchParams): FournisseurFilters {
  return {
    search: sp.get('search') || undefined,
    statut: (sp.get('statut') as StatutFournisseur) || undefined,
    categorie: (sp.get('categorie') as CategorieFournisseur) || undefined,
    criticite: (sp.get('criticite') as CriticiteFournisseur) || undefined,
    page: parseInt(sp.get('page') || '0', 10),
    size: PAGE_SIZE,
  };
}

export default function FournisseursPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FournisseurFilters>(() =>
    parseFiltersFromUrl(searchParams),
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editFournisseur, setEditFournisseur] = useState<Fournisseur | null>(
    null,
  );
  const [deleteFournisseur, setDeleteFournisseur] =
    useState<Fournisseur | null>(null);

  const syncFiltersToUrl = useCallback(
    (f: FournisseurFilters) => {
      const params = new URLSearchParams();
      if (f.search) params.set('search', f.search);
      if (f.statut) params.set('statut', f.statut);
      if (f.categorie) params.set('categorie', f.categorie);
      if (f.criticite) params.set('criticite', f.criticite);
      if (f.page && f.page > 0) params.set('page', String(f.page));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters, syncFiltersToUrl]);

  const { data, isLoading } = useFournisseurs(filters);

  const handleFilterChange = (
    key: keyof FournisseurFilters,
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
        title='Fournisseurs'
        description='Référentiel des fournisseurs et évaluations HSQSE'
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouveau fournisseur
          </Button>
        }
      />

      <Card>
        <CardHeader
          title='Liste des fournisseurs'
          action={
            <div className='flex items-center gap-3 flex-wrap'>
              <Select
                value={filters.statut || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'statut',
                    e.target.value as StatutFournisseur,
                  )
                }
                options={[
                  { value: '', label: 'Tous les statuts' },
                  ...STATUT_FOURNISSEUR_OPTIONS,
                ]}
                fullWidth={false}
              />
              <Select
                value={filters.categorie || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'categorie',
                    e.target.value as CategorieFournisseur,
                  )
                }
                options={[
                  { value: '', label: 'Toutes cat\u00e9gories' },
                  ...CATEGORIE_FOURNISSEUR_OPTIONS,
                ]}
                fullWidth={false}
              />
              <Select
                value={filters.criticite || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'criticite',
                    e.target.value as CriticiteFournisseur,
                  )
                }
                options={[
                  { value: '', label: 'Toutes criticit\u00e9s' },
                  ...CRITICITE_FOURNISSEUR_OPTIONS,
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

        <FournisseurTable
          fournisseurs={data?.content}
          isLoading={isLoading}
          onView={(f) => navigate(`/fournisseurs/${f.id}`)}
          onEdit={setEditFournisseur}
          onDelete={setDeleteFournisseur}
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

      <CreateFournisseurModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditFournisseurModal
        isOpen={!!editFournisseur}
        onClose={() => setEditFournisseur(null)}
        fournisseur={editFournisseur}
      />
      <DeleteFournisseurModal
        isOpen={!!deleteFournisseur}
        onClose={() => setDeleteFournisseur(null)}
        fournisseur={deleteFournisseur}
      />
    </div>
  );
}
