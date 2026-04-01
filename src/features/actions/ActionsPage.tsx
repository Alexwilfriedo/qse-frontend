import {
  Button,
  Card,
  CardHeader,
  PageHeader,
  Pagination,
} from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { actionsApi } from './actionsApi';
import { ActionFilters } from './components/ActionFilters';
import { ActionTable } from './components/ActionTable';
import { CreateActionModal } from './components/CreateActionModal';
import { useActions } from './hooks/useActions';
import type { ActionsFilter, CreateActionRequest } from './types';

const PAGE_SIZE = 20;

function parseFiltersFromUrl(searchParams: URLSearchParams): ActionsFilter {
  return {
    statut:
      (searchParams.get('statut') as ActionsFilter['statut']) || undefined,
    domaine:
      (searchParams.get('domaine') as ActionsFilter['domaine']) || undefined,
    type: (searchParams.get('type') as ActionsFilter['type']) || undefined,
    priorite:
      (searchParams.get('priorite') as ActionsFilter['priorite']) || undefined,
    responsableId: searchParams.get('responsableId') || undefined,
    enRetard: searchParams.get('enRetard') === 'true' || undefined,
    echeanceDebut: searchParams.get('echeanceDebut') || undefined,
    echeanceFin: searchParams.get('echeanceFin') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    page: parseInt(searchParams.get('page') || '0', 10),
    size: PAGE_SIZE,
  };
}

export function ActionsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ActionsFilter>(() =>
    parseFiltersFromUrl(searchParams),
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading } = useActions(filters);

  const syncFiltersToUrl = useCallback(
    (newFilters: ActionsFilter) => {
      const params = new URLSearchParams();
      if (newFilters.statut) params.set('statut', newFilters.statut);
      if (newFilters.domaine) params.set('domaine', newFilters.domaine);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.priorite) params.set('priorite', newFilters.priorite);
      if (newFilters.responsableId)
        params.set('responsableId', newFilters.responsableId);
      if (newFilters.enRetard) params.set('enRetard', 'true');
      if (newFilters.echeanceDebut)
        params.set('echeanceDebut', newFilters.echeanceDebut);
      if (newFilters.echeanceFin)
        params.set('echeanceFin', newFilters.echeanceFin);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.sort) params.set('sort', newFilters.sort);
      if (newFilters.page && newFilters.page > 0)
        params.set('page', String(newFilters.page));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters, syncFiltersToUrl]);

  const createMutation = useMutation({
    mutationFn: (data: CreateActionRequest) => actionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      showToast.success('Action créée avec succès');
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const handleFilterChange = (newFilters: Partial<ActionsFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Actions d'amélioration"
        description='Suivi des actions correctives, préventives et curatives'
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouvelle action
          </Button>
        }
      />

      <Card>
        <CardHeader title='Liste des actions' />

        <ActionFilters filters={filters} onChange={handleFilterChange} />

        <ActionTable actions={data?.content} isLoading={isLoading} />

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

      <CreateActionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(data: CreateActionRequest) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
