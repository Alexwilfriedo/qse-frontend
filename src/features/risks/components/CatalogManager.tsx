import { Badge, Button, Card, CardHeader, SkeletonTable } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { Edit2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import { useCreateCatalogItem, useRiskCatalog, useToggleCatalogItem, useUpdateCatalogItem } from '../hooks/useRiskConfig';
import type { CatalogType, CreateCatalogItemRequest, UpdateCatalogItemRequest } from '../types';
import CatalogItemFormModal from './CatalogItemFormModal';

const CATALOG_LABELS: Record<CatalogType, string> = {
  WORK_UNIT: 'Unités de Travail',
  DANGER_TYPE: 'Types de Dangers',
  ENVIRONMENTAL_ASPECT: 'Aspects Environnementaux',
  RISK_FAMILY: 'Familles de Risques',
};

interface Props {
  catalogType: CatalogType;
}

export default function CatalogManager({ catalogType }: Props) {
  const { data: items, isLoading } = useRiskCatalog(catalogType);
  const createMutation = useCreateCatalogItem();
  const updateMutation = useUpdateCatalogItem(catalogType);
  const toggleMutation = useToggleCatalogItem(catalogType);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{ label: string; description: string; code: string; sortOrder: number } | null>(null);

  const handleCreate = async (data: CreateCatalogItemRequest) => {
    try {
      await createMutation.mutateAsync(data);
      showToast.success('Élément ajouté');
      setModalOpen(false);
    } catch {
      showToast.error("Erreur lors de l'ajout");
    }
  };

  const handleUpdate = async (id: string, data: UpdateCatalogItemRequest) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      showToast.success('Élément mis à jour');
      setEditingId(null);
      setEditingData(null);
      setModalOpen(false);
    } catch {
      showToast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch {
      showToast.error('Erreur lors du changement de statut');
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={`${CATALOG_LABELS[catalogType]} (${items?.length ?? 0})`}
          action={
            <Button
              size="sm"
              onClick={() => {
                setEditingId(null);
                setEditingData(null);
                setModalOpen(true);
              }}>
              <Plus className="mr-1 h-4 w-4" />
              Ajouter
            </Button>
          }
        />

        {isLoading ? (
          <SkeletonTable rows={3} columns={5} />
        ) : !items?.length ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">Aucun élément configuré</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Label</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Statut</th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 font-mono text-sm">{item.code}</td>
                  <td className="px-4 py-2 text-sm">{item.label}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{item.description ?? '—'}</td>
                  <td className="px-4 py-2">
                    <Badge variant={item.active ? 'success' : 'default'}>
                      {item.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(item.id)} title={item.active ? 'Désactiver' : 'Activer'}>
                        {item.active ? <ToggleRight className="h-4 w-4 text-success-500" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingData({ label: item.label, description: item.description ?? '', code: item.code, sortOrder: item.sortOrder });
                          setModalOpen(true);
                        }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <CatalogItemFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditingData(null);
        }}
        catalogType={catalogType}
        catalogLabel={CATALOG_LABELS[catalogType]}
        editingId={editingId}
        editingData={editingData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </>
  );
}
