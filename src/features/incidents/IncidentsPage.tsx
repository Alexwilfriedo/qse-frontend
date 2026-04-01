import { Button, Card, PageHeader, Pagination } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentFormModal, IncidentTable } from './components';
import { useCreateIncident, useIncidents } from './hooks';
import type {
  CreateIncidentRequest,
  Domaine,
  Incident,
  IncidentFilters,
  IncidentStatus,
  IncidentType,
} from './types';

const PAGE_SIZE = 20;

const DOMAINE_OPTIONS: { value: Domaine | ''; label: string }[] = [
  { value: '', label: 'Tous domaines' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
  { value: 'QUALITE', label: 'Qualité' },
];

const TYPE_OPTIONS: { value: IncidentType | ''; label: string }[] = [
  { value: '', label: 'Tous types' },
  { value: 'ACCIDENT_AVEC_ARRET', label: 'Accident avec Arrêt' },
  { value: 'ACCIDENT_SANS_ARRET', label: 'Accident sans Arrêt' },
  { value: 'INCIDENT', label: 'Incident' },
  { value: 'PRESQU_ACCIDENT', label: "Presqu'accident" },
  { value: 'NON_CONFORMITE', label: 'Non-conformité' },
  { value: 'OPPORTUNITE', label: 'Opportunité' },
];

const STATUS_OPTIONS: { value: IncidentStatus | ''; label: string }[] = [
  { value: '', label: 'Tous statuts' },
  { value: 'DECLARE', label: 'Déclaré' },
  { value: 'EN_ANALYSE', label: 'En analyse' },
  { value: 'EN_TRAITEMENT', label: 'En traitement' },
  { value: 'CLOS', label: 'Clos' },
];

export default function IncidentsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<IncidentFilters>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useIncidents({
    ...filters,
    search: search || undefined,
  });
  const createMutation = useCreateIncident();

  const handleCreate = async (req: CreateIncidentRequest) => {
    try {
      const result = await createMutation.mutateAsync(req);
      showToast.success('Incident déclaré');
      setModalOpen(false);
      navigate(`/incidents/${result.id}`);
    } catch {
      showToast.error('Erreur lors de la déclaration');
    }
  };

  const handleSelect = (inc: Incident) => navigate(`/incidents/${inc.id}`);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Incidents & Événements'
        description='Déclaration, analyse et suivi des incidents QSE'
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className='mr-1 h-4 w-4' />
            Déclarer un incident
          </Button>
        }
      />

      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Rechercher par code, titre, lieu...'
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
          value={filters.incidentType ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              incidentType: (e.target.value || undefined) as
                | IncidentType
                | undefined,
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
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: (e.target.value || undefined) as
                | IncidentStatus
                | undefined,
              page: 0,
            }))
          }
          className='rounded border border-gray-300 px-3 py-2 text-sm'>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <IncidentTable
          incidents={data?.content}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
      </Card>

      {data && (
        <Pagination
          currentPage={data.number}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          pageSize={PAGE_SIZE}
        />
      )}

      <IncidentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
