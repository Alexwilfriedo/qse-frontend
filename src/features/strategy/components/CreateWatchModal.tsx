import { useState } from 'react';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
} from '../../../components/ui';
import { useAuthStore } from '../../auth/authStore';
import { useCreateWatch } from '../hooks/useStrategy';
import { REGULATORY_CATEGORY_LABELS, RegulatoryCategory } from '../types';

const CATEGORY_OPTIONS = Object.values(RegulatoryCategory).map((c) => ({
  value: c,
  label: REGULATORY_CATEGORY_LABELS[c],
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateWatchModal({ open, onClose }: Props) {
  const createMut = useCreateWatch();
  const currentUser = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    titre: '',
    referenceTexte: '',
    description: '',
    categorie: RegulatoryCategory.NORME_ISO as RegulatoryCategory,
    dateEntreeVigueur: '',
    dateRevue: '',
    alerteJoursAvant: 30,
  });

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const reset = () =>
    setForm({
      titre: '',
      referenceTexte: '',
      description: '',
      categorie: RegulatoryCategory.NORME_ISO,
      dateEntreeVigueur: '',
      dateRevue: '',
      alerteJoursAvant: 30,
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate(
      {
        titre: form.titre,
        referenceTexte: form.referenceTexte || undefined,
        description: form.description || undefined,
        categorie: form.categorie,
        dateEntreeVigueur: form.dateEntreeVigueur || undefined,
        dateRevue: form.dateRevue,
        alerteJoursAvant: form.alerteJoursAvant,
        responsableId: currentUser?.id ?? '',
      },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title='Nouvelle veille reglementaire'
      size='lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Titre'
          placeholder='Titre du texte reglementaire'
          value={form.titre}
          onChange={(e) => update('titre', e.target.value)}
          required
        />
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Reference texte'
            placeholder='Ex: Loi n 2021-1104'
            value={form.referenceTexte}
            onChange={(e) => update('referenceTexte', e.target.value)}
          />
          <Select
            label='Categorie'
            required
            options={CATEGORY_OPTIONS}
            value={form.categorie}
            onChange={(e) => update('categorie', e.target.value)}
          />
        </div>
        <Input
          label='Description'
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
        <div className='grid grid-cols-2 gap-4'>
          <DatePicker
            label='Date entree en vigueur'
            value={form.dateEntreeVigueur}
            onChange={(v) => update('dateEntreeVigueur', v)}
            clearable
          />
          <DatePicker
            label='Date de revue'
            value={form.dateRevue}
            onChange={(v) => update('dateRevue', v)}
            required
          />
        </div>
        <Input
          label='Alerte (jours avant)'
          type='number'
          value={String(form.alerteJoursAvant)}
          onChange={(e) =>
            update('alerteJoursAvant', parseInt(e.target.value) || 30)
          }
        />
        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={createMut.isPending || !form.titre || !form.dateRevue}>
            {createMut.isPending ? 'Creation...' : 'Creer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
