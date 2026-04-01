import { useState } from 'react';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
} from '../../../components/ui';
import { useAuthStore } from '../../auth/authStore';
import { useCreateObjective } from '../hooks/useStrategy';

const DOMAINE_OPTIONS = [
  { value: 'QUALITE', label: 'Qualite' },
  { value: 'SECURITE', label: 'Securite' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateObjectiveModal({ open, onClose }: Props) {
  const createObj = useCreateObjective();
  const currentUser = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    kpiNom: '',
    kpiUnite: '',
    cible: 0,
    echeance: '',
    domaine: 'QUALITE',
  });

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const reset = () =>
    setForm({
      titre: '',
      description: '',
      kpiNom: '',
      kpiUnite: '',
      cible: 0,
      echeance: '',
      domaine: 'QUALITE',
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createObj.mutate(
      {
        titre: form.titre,
        description: form.description || undefined,
        kpiNom: form.kpiNom,
        kpiUnite: form.kpiUnite || undefined,
        cible: form.cible,
        echeance: form.echeance,
        domaine: form.domaine,
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
      title='Nouvel objectif strategique'
      size='lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Titre'
          value={form.titre}
          onChange={(e) => update('titre', e.target.value)}
          required
        />
        <Input
          label='Description'
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Nom du KPI'
            placeholder='Taux de conformite'
            value={form.kpiNom}
            onChange={(e) => update('kpiNom', e.target.value)}
            required
          />
          <Input
            label='Unite'
            placeholder='%'
            value={form.kpiUnite}
            onChange={(e) => update('kpiUnite', e.target.value)}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Cible'
            type='number'
            value={String(form.cible)}
            onChange={(e) => update('cible', Number(e.target.value))}
            required
          />
          <DatePicker
            label='Echeance'
            value={form.echeance}
            onChange={(v) => update('echeance', v)}
            required
          />
        </div>
        <Select
          label='Domaine'
          required
          options={DOMAINE_OPTIONS}
          value={form.domaine}
          onChange={(e) => update('domaine', e.target.value)}
        />
        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={
              createObj.isPending ||
              !form.titre ||
              !form.kpiNom ||
              !form.echeance
            }>
            {createObj.isPending ? 'Creation...' : 'Creer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
