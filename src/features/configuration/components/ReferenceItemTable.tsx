import {
  Badge,
  Button,
  Card,
  CardHeader,
  SkeletonTable,
} from '@/components/ui';
import { showToast } from '@/lib/toast';
import { Edit2, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type {
  ReferenceCategory,
  ReferenceItem,
} from '../configurationApi';
import {
  useDeleteReferenceItem,
  useReferenceItems,
  useToggleReferenceItem,
} from '../hooks';
import ReferenceItemFormModal from './ReferenceItemFormModal';

interface Props {
  category: ReferenceCategory;
  categoryLabel: string;
}

export default function ReferenceItemTable({ category, categoryLabel }: Props) {
  const { data: items, isLoading } = useReferenceItems(category);
  const toggleMutation = useToggleReferenceItem(category);
  const deleteMutation = useDeleteReferenceItem(category);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ReferenceItem | null>(null);

  const handleDelete = async (item: ReferenceItem) => {
    if (!confirm(`Supprimer "${item.label}" ?`)) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      showToast.success('Valeur supprimée');
    } catch {
      showToast.error('Erreur lors de la suppression');
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={`${categoryLabel} (${items?.length ?? 0})`}
          action={
            <Button
              size='sm'
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}>
              <Plus className='w-4 h-4 mr-1' />
              Ajouter
            </Button>
          }
        />

        {isLoading ? (
          <SkeletonTable rows={3} columns={6} />
        ) : !items?.length ? (
          <div className='px-4 py-6 text-center text-sm text-gray-500'>
            Aucune valeur configurée
          </div>
        ) : (
          <table className='min-w-full'>
            <thead className='bg-gray-50 dark:bg-gray-800'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Code
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Label
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Description
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Couleur
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>
                  Statut
                </th>
                <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                  <td className='px-4 py-2 font-mono text-sm'>{item.code}</td>
                  <td className='px-4 py-2 text-sm'>{item.label}</td>
                  <td className='px-4 py-2 text-sm text-gray-600 dark:text-gray-300'>
                    {item.description || '—'}
                  </td>
                  <td className='px-4 py-2'>
                    {item.color && (
                      <div className='flex items-center gap-2'>
                        <span
                          className='w-4 h-4 rounded-full border border-gray-300'
                          style={{ backgroundColor: item.color }}
                        />
                        <span className='font-mono text-xs text-gray-500'>
                          {item.color}
                        </span>
                      </div>
                    )}
                    {!item.color && (
                      <span className='text-sm text-gray-400'>—</span>
                    )}
                  </td>
                  <td className='px-4 py-2'>
                    <Badge variant={item.active ? 'success' : 'default'}>
                      {item.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className='px-4 py-2 text-right'>
                    <div className='flex justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          toggleMutation.mutate({
                            id: item.id,
                            active: item.active,
                          })
                        }
                        title={item.active ? 'Désactiver' : 'Activer'}>
                        {item.active ? (
                          <ToggleRight className='w-4 h-4 text-success-500' />
                        ) : (
                          <ToggleLeft className='w-4 h-4' />
                        )}
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setEditing(item);
                          setModalOpen(true);
                        }}>
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(item)}>
                        <Trash2 className='w-4 h-4 text-error-500' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <ReferenceItemFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        category={category}
        categoryLabel={categoryLabel}
        item={editing}
      />
    </>
  );
}
