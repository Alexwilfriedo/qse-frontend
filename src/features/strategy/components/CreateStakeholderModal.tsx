import { useMemo, useState } from 'react';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Textarea,
} from '../../../components/ui';
import { useAuthStore } from '../../auth/authStore';
import { useProcessMap } from '../../cartography/hooks';
import { useCreateStakeholder } from '../hooks/useStrategy';
import {
  CARACTERE_EXIGENCE_LABELS,
  CaractereExigence,
  STAKEHOLDER_CLASSIFICATION_LABELS,
  STAKEHOLDER_TYPE_LABELS,
  StakeholderClassification,
  StakeholderType,
} from '../types';

const CLASSIFICATION_OPTIONS = Object.values(StakeholderClassification).map(
  (c) => ({ value: c, label: STAKEHOLDER_CLASSIFICATION_LABELS[c] }),
);

const TYPE_OPTIONS = Object.values(StakeholderType).map((t) => ({
  value: t,
  label: STAKEHOLDER_TYPE_LABELS[t],
}));

const EXIGENCE_OPTIONS = Object.values(CaractereExigence).map((e) => ({
  value: e,
  label: CARACTERE_EXIGENCE_LABELS[e],
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateStakeholderModal({ open, onClose }: Props) {
  const createMut = useCreateStakeholder();
  const currentUser = useAuthStore((s) => s.user);
  const { data: processMap } = useProcessMap();

  const processOptions = useMemo(() => {
    if (!processMap) return [];
    return [
      ...processMap.management,
      ...processMap.realisation,
      ...processMap.support,
    ].map((p) => ({ value: p.id, label: `${p.codification} — ${p.nom}` }));
  }, [processMap]);

  const [form, setForm] = useState({
    nom: '',
    classification: StakeholderClassification.EXTERNE,
    stakeholderType: StakeholderType.CLIENT,
    besoinAttente: '',
    caractereExigence: CaractereExigence.CONTRACTUELLE,
    processusId: '',
    dateCreation: '',
    dateRevision: '',
    alerteJoursAvant: 30,
  });

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const reset = () =>
    setForm({
      nom: '',
      classification: StakeholderClassification.EXTERNE,
      stakeholderType: StakeholderType.CLIENT,
      besoinAttente: '',
      caractereExigence: CaractereExigence.CONTRACTUELLE,
      processusId: '',
      dateCreation: '',
      dateRevision: '',
      alerteJoursAvant: 30,
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate(
      {
        nom: form.nom,
        classification: form.classification,
        stakeholderType: form.stakeholderType,
        besoinAttente: form.besoinAttente,
        caractereExigence: form.caractereExigence,
        processusId: form.processusId || undefined,
        dateCreation: form.dateCreation || undefined,
        dateRevision: form.dateRevision,
        alerteJoursAvant: Number(form.alerteJoursAvant) || 30,
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

  const isValid = form.nom && form.besoinAttente && form.dateRevision;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title='Nouvelle partie intéressée'
      size='lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Nom / Libellé'
          placeholder={"Ex : Ministère de l'Environnement"}
          value={form.nom}
          onChange={(e) => update('nom', e.target.value)}
          required
        />
        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Catégorie'
            required
            options={CLASSIFICATION_OPTIONS}
            value={form.classification}
            onChange={(e) => update('classification', e.target.value)}
          />
          <Select
            label='Type'
            required
            options={TYPE_OPTIONS}
            value={form.stakeholderType}
            onChange={(e) => update('stakeholderType', e.target.value)}
          />
        </div>
        <Textarea
          label='Besoin et Attente'
          placeholder={
            "Décrivez en une ou deux phrases le besoin et l'attente de cette partie intéressée…"
          }
          value={form.besoinAttente}
          onChange={(e) => update('besoinAttente', e.target.value)}
          required
          rows={3}
        />
        <div className='grid grid-cols-2 gap-4'>
          <Select
            label="Caractère de l'exigence"
            required
            options={EXIGENCE_OPTIONS}
            value={form.caractereExigence}
            onChange={(e) => update('caractereExigence', e.target.value)}
          />
          <Select
            label='Processus pilote'
            options={[{ value: '', label: '— Aucun —' }, ...processOptions]}
            value={form.processusId}
            onChange={(e) => update('processusId', e.target.value)}
          />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <DatePicker
            label='Date de création'
            value={form.dateCreation}
            onChange={(v) => update('dateCreation', v)}
          />
          <DatePicker
            label='Date de révision'
            value={form.dateRevision}
            onChange={(v) => update('dateRevision', v)}
            required
          />
          <Input
            label='Alerte (jours avant)'
            type='number'
            min={0}
            value={form.alerteJoursAvant}
            onChange={(e) => update('alerteJoursAvant', e.target.value)}
            onBlur={(e) => {
              const val = parseInt(e.target.value);
              update('alerteJoursAvant', isNaN(val) || val < 0 ? 30 : val);
            }}
          />
        </div>
        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={createMut.isPending || !isValid}>
            {createMut.isPending ? 'Création…' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
