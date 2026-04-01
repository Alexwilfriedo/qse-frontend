import { Button, Card, PageHeader, Pagination } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { LayoutGrid, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RiskFormModal from './components/RiskFormModal';
import RiskTable from './components/RiskTable';
import { useCreateRisk, useRisks } from './hooks/useRisks';
import type {
  CreateRiskRequest,
  Domaine,
  Risk,
  RiskFilters,
  RiskType,
} from './types';

const PAGE_SIZE = 20;

function parsePositiveNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function buildInitialFilters(searchParams: URLSearchParams): RiskFilters {
  return {
    domaine: (searchParams.get('domaine') || undefined) as Domaine | undefined,
    riskType: (searchParams.get('riskType') || undefined) as RiskType | undefined,
    processusId: searchParams.get('processusId') || undefined,
    workUnitId: searchParams.get('workUnitId') || undefined,
    frequency: parsePositiveNumber(searchParams.get('frequency')),
    severity: parsePositiveNumber(searchParams.get('severity')),
    page: parsePositiveNumber(searchParams.get('page')) ?? 0,
    size: parsePositiveNumber(searchParams.get('size')) ?? PAGE_SIZE,
    sortBy: searchParams.get('sortBy') || undefined,
    sortDir: (searchParams.get('sortDir') || undefined) as
      | 'asc'
      | 'desc'
      | undefined,
  };
}

const DOMAINE_OPTIONS: { value: Domaine | ''; label: string }[] = [
  { value: '', label: 'Tous domaines' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
  { value: 'QUALITE', label: 'Qualité' },
];

const TYPE_OPTIONS: { value: RiskType | ''; label: string }[] = [
  { value: '', label: 'Tous types' },
  { value: 'DANGER', label: 'Danger (SST)' },
  { value: 'ASPECT_ENVIRONNEMENTAL', label: 'Aspect Env.' },
  { value: 'VULNERABILITE_PROCESSUS', label: 'Vuln. Processus' },
];

export default function RisksPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<RiskFilters>(() =>
    buildInitialFilters(searchParams),
  );
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useRisks({
    ...filters,
    search: search || undefined,
  });
  const createMutation = useCreateRisk();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.domaine) params.set('domaine', filters.domaine);
    if (filters.riskType) params.set('riskType', filters.riskType);
    if (filters.processusId) params.set('processusId', filters.processusId);
    if (filters.workUnitId) params.set('workUnitId', filters.workUnitId);
    if (filters.frequency !== undefined) {
      params.set('frequency', String(filters.frequency));
    }
    if (filters.severity !== undefined) {
      params.set('severity', String(filters.severity));
    }
    if (search) params.set('search', search);
    if (filters.page > 0) params.set('page', String(filters.page));
    if (filters.size !== PAGE_SIZE) params.set('size', String(filters.size));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortDir) params.set('sortDir', filters.sortDir);
    setSearchParams(params, { replace: true });
  }, [filters, search, setSearchParams]);

  const handlePageChange = (page: number) =>
    setFilters((prev) => ({ ...prev, page }));

  const handleCreate = async (req: CreateRiskRequest) => {
    try {
      await createMutation.mutateAsync(req);
      showToast.success('Risque créé');
      setModalOpen(false);
    } catch {
      showToast.error('Erreur lors de la création');
    }
  };

  const handleSelect = (risk: Risk) => {
    navigate(`/risks/${risk.id}`);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Gestion des Risques QSE'
        description='Identification, évaluation et traitement des risques'
        actions={
          <div className='flex gap-2'>
            <Button
              variant='secondary'
              onClick={() => navigate('/risks/matrix')}>
              <LayoutGrid className='mr-1 h-4 w-4' />
              Matrice
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className='mr-1 h-4 w-4' />
              Identifier un risque
            </Button>
          </div>
        }
      />

      {/* Filtres */}
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Rechercher par code, titre, causes...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setFilters((prev) => ({ ...prev, page: 0 }));
            }}
            className='w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm'
          />
        </div>
        <select
          value={filters.domaine ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              domaine: (e.target.value || undefined) as Domaine | undefined,
              page: 0,
            }))
          }
          className='rounded border border-gray-300 px-3 py-2 text-sm'>
          {DOMAINE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.riskType ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              riskType: (e.target.value || undefined) as RiskType | undefined,
              page: 0,
            }))
          }
          className='rounded border border-gray-300 px-3 py-2 text-sm'>
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <RiskTable
          risks={data?.content}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
      </Card>

      {data && (
        <Pagination
          currentPage={data.number}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          onPageChange={handlePageChange}
          pageSize={PAGE_SIZE}
        />
      )}

      <RiskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
