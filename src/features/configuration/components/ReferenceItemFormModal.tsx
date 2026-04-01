import { Button, Modal } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import type { ReferenceCategory, ReferenceItem } from '../configurationApi';
import { useCreateReferenceItem, useUpdateReferenceItem } from '../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: ReferenceCategory;
  categoryLabel: string;
  item: ReferenceItem | null;
}

export default function ReferenceItemFormModal({
  isOpen,
  onClose,
  category,
  categoryLabel,
  item,
}: Props) {
  const isEdit = !!item;

  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#667085');
  const [displayOrder, setDisplayOrder] = useState(0);

  const createMutation = useCreateReferenceItem(category);
  const updateMutation = useUpdateReferenceItem(category);

  useEffect(() => {
    if (item) {
      setCode(item.code);
      setLabel(item.label);
      setDescription(item.description ?? '');
      setColor(item.color ?? '#667085');
      setDisplayOrder(item.displayOrder);
    } else {
      setCode('');
      setLabel('');
      setDescription('');
      setColor('#667085');
      setDisplayOrder(0);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: item!.id,
          data: {
            label,
            description: description || undefined,
            color,
            displayOrder,
          },
        });
        showToast.success('Valeur modifiée');
      } else {
        await createMutation.mutateAsync({
          code,
          label,
          description: description || undefined,
          color,
          displayOrder,
        });
        showToast.success('Valeur créée');
      }
      onClose();
    } catch {
      showToast.error(
        isEdit
          ? 'Erreur lors de la modification'
          : 'Erreur lors de la création',
      );
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit ? `Modifier — ${categoryLabel}` : `Nouveau — ${categoryLabel}`
      }>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {!isEdit && (
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Code *
            </label>
            <input
              type='text'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              placeholder='Ex: 1, VEILLE_REGLEMENTAIRE, INNOVATION'
              required
              pattern='[A-Za-z0-9 _-]+'
              title='Lettres, chiffres, espaces, tirets et underscores autorisés'
            />
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Label *
          </label>
          <input
            type='text'
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Couleur
            </label>
            <div className='flex items-center gap-2'>
              <input
                type='color'
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className='h-9 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer'
              />
              <input
                type='text'
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                maxLength={7}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Ordre d'affichage
            </label>
            <input
              type='number'
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              min={0}
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
