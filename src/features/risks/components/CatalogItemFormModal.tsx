import { Button, Input, Modal } from '@/components/ui';
import { useEffect, useState } from 'react';
import type {
  CatalogType,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
} from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  catalogType: CatalogType;
  catalogLabel: string;
  editingId: string | null;
  editingData: {
    label: string;
    description: string;
    code: string;
    sortOrder: number;
  } | null;
  onCreate: (data: CreateCatalogItemRequest) => void;
  onUpdate: (id: string, data: UpdateCatalogItemRequest) => void;
}

export default function CatalogItemFormModal({
  isOpen,
  onClose,
  catalogType,
  catalogLabel,
  editingId,
  editingData,
  onCreate,
  onUpdate,
}: Props) {
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (editingData) {
      setCode(editingData.code);
      setLabel(editingData.label);
      setDescription(editingData.description);
      setSortOrder(editingData.sortOrder);
    } else {
      setCode('');
      setLabel('');
      setDescription('');
      setSortOrder(0);
    }
  }, [editingData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, { label, description, sortOrder });
    } else {
      onCreate({ catalogType, code, label, description, sortOrder });
    }
  };

  const isEditing = !!editingId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing ? `Modifier — ${catalogLabel}` : `Ajouter — ${catalogLabel}`
      }>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Code'
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isEditing}
          placeholder='EX: UT_PROD'
        />
        <Input
          label='Label'
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder='Production'
        />
        <Input
          label='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label='Ordre'
          type='number'
          value={String(sortOrder)}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit'>{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
        </div>
      </form>
    </Modal>
  );
}
