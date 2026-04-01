import { Button, Input, Modal } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import type { DocumentTypeConfig } from '../configurationApi';
import { useCreateDocumentType, useUpdateDocumentType } from '../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: DocumentTypeConfig | null;
}

export function DocumentTypeFormModal({ isOpen, onClose, type }: Props) {
  const [formData, setFormData] = useState({
    code: '',
    label: '',
    description: '',
    displayOrder: 0,
  });

  const createMutation = useCreateDocumentType();
  const updateMutation = useUpdateDocumentType();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (type) {
      setFormData({
        code: type.code,
        label: type.label,
        description: type.description || '',
        displayOrder: type.displayOrder,
      });
    } else {
      setFormData({ code: '', label: '', description: '', displayOrder: 0 });
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type) {
        await updateMutation.mutateAsync({
          id: type.id,
          data: {
            label: formData.label,
            description: formData.description || undefined,
            displayOrder: formData.displayOrder,
          },
        });
        showToast.success('Type mis à jour');
      } else {
        await createMutation.mutateAsync({
          code: formData.code,
          label: formData.label,
          description: formData.description || undefined,
          displayOrder: formData.displayOrder,
        });
        showToast.success('Type créé');
      }
      onClose();
    } catch {
      showToast.error('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type ? 'Modifier le type' : 'Nouveau type de document'}
      preserveState={!!type}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Code *
          </label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder='PROCEDURE'
            required
            disabled={!!type}
            className={type ? 'bg-gray-100 cursor-not-allowed' : ''}
          />
          {!type && (
            <p className='text-xs text-gray-500 mt-1'>
              Lettres majuscules et underscores uniquement
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Label *
          </label>
          <Input
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder='Procédure'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Description
          </label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder='Description du type...'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Ordre d'affichage
          </label>
          <Input
            type='number'
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            min={0}
          />
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : type ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
