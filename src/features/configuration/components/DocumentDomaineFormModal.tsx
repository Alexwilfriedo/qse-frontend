import { Button, Input, Modal } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import type { DocumentDomaineConfig } from '../configurationApi';
import { useCreateDocumentDomaine, useUpdateDocumentDomaine } from '../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  domaine: DocumentDomaineConfig | null;
}

export function DocumentDomaineFormModal({ isOpen, onClose, domaine }: Props) {
  const [formData, setFormData] = useState({
    code: '',
    label: '',
    description: '',
    color: '#667085',
    displayOrder: 0,
  });

  const createMutation = useCreateDocumentDomaine();
  const updateMutation = useUpdateDocumentDomaine();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (domaine) {
      setFormData({
        code: domaine.code,
        label: domaine.label,
        description: domaine.description || '',
        color: domaine.color,
        displayOrder: domaine.displayOrder,
      });
    } else {
      setFormData({ code: '', label: '', description: '', color: '#667085', displayOrder: 0 });
    }
  }, [domaine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (domaine) {
        await updateMutation.mutateAsync({
          id: domaine.id,
          data: {
            label: formData.label,
            description: formData.description || undefined,
            color: formData.color,
            displayOrder: formData.displayOrder,
          },
        });
        showToast.success('Domaine mis à jour');
      } else {
        await createMutation.mutateAsync({
          code: formData.code,
          label: formData.label,
          description: formData.description || undefined,
          color: formData.color,
          displayOrder: formData.displayOrder,
        });
        showToast.success('Domaine créé');
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
      title={domaine ? 'Modifier le domaine' : 'Nouveau domaine'}
      preserveState={!!domaine}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Code *
          </label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder='QUALITE'
            required
            disabled={!!domaine}
            className={domaine ? 'bg-gray-100 cursor-not-allowed' : ''}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Label *
          </label>
          <Input
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder='Qualité'
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
            placeholder='Description du domaine...'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Couleur
          </label>
          <div className='flex items-center gap-3'>
            <input
              type='color'
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className='w-10 h-10 rounded cursor-pointer border border-gray-300'
            />
            <Input
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder='#465FFF'
              pattern='^#[0-9A-Fa-f]{6}$'
              className='flex-1'
            />
          </div>
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
            {isLoading ? 'Enregistrement...' : domaine ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
