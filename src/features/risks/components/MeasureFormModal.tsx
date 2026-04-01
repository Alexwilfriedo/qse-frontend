import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useEffect, useState } from 'react';
import type {
  CreateMeasureRequest,
  MeasureEffectiveness,
  MitigationStrategy,
  RiskMitigationMeasure,
  UpdateMeasureRequest,
} from '../types';

const STRATEGY_OPTIONS: { value: MitigationStrategy; label: string }[] = [
  { value: 'ELIMINATION', label: 'Élimination' },
  { value: 'REDUCTION', label: 'Réduction / Prévention' },
  { value: 'TRANSFERT', label: 'Transfert' },
  { value: 'ACCEPTATION', label: 'Acceptation' },
];

const EFFECTIVENESS_OPTIONS: { value: MeasureEffectiveness; label: string }[] =
  [
    { value: 'NON_EVALUEE', label: 'Non évaluée' },
    { value: 'INSUFFISANTE', label: 'Insuffisante' },
    { value: 'PARTIELLE', label: 'Partielle' },
    { value: 'EFFICACE', label: 'Efficace' },
  ];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMeasureRequest | UpdateMeasureRequest) => void;
  isPending: boolean;
  measure?: RiskMitigationMeasure;
}

export default function MeasureFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  measure,
}: Props) {
  const isEdit = !!measure;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strategy, setStrategy] = useState<MitigationStrategy>('REDUCTION');
  const [effectiveness, setEffectiveness] =
    useState<MeasureEffectiveness>('NON_EVALUEE');
  const [responsibleUserId, setResponsibleUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [resources, setResources] = useState('');
  const { data: users } = useUsers();

  const userOptions =
    users?.map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
      description: user.email,
    })) ?? [];

  useEffect(() => {
    if (measure) {
      setTitle(measure.title);
      setDescription(measure.description ?? '');
      setStrategy(measure.strategy);
      setEffectiveness(measure.effectiveness);
      setResponsibleUserId(measure.responsibleUserId ?? '');
      setDueDate(measure.dueDate ?? '');
      setResources(measure.resources ?? '');
    } else {
      setTitle('');
      setDescription('');
      setStrategy('REDUCTION');
      setEffectiveness('NON_EVALUEE');
      setResponsibleUserId('');
      setDueDate('');
      setResources('');
    }
  }, [measure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      const data: UpdateMeasureRequest = {
        title,
        description: description || undefined,
        strategy,
        effectiveness,
        responsibleUserId: responsibleUserId || undefined,
        dueDate: dueDate || undefined,
        resources: resources || undefined,
      };
      onSubmit(data);
    } else {
      const data: CreateMeasureRequest = {
        title,
        description: description || undefined,
        strategy,
        responsibleUserId: responsibleUserId || undefined,
        dueDate: dueDate || undefined,
        resources: resources || undefined,
      };
      onSubmit(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Modifier la mesure' : 'Nouvelle mesure de maîtrise'}
      preserveState={isEdit}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Intitule'
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Ex: Port des EPI obligatoire'
        />

        <Input
          label='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Details de la mesure...'
        />

        <Select
          label='Strategie'
          required
          options={STRATEGY_OPTIONS}
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as MitigationStrategy)}
        />

        <Select
          label='Responsable'
          placeholder='Sélectionner un utilisateur'
          clearable
          searchable
          options={userOptions}
          value={responsibleUserId}
          onChange={(e) => setResponsibleUserId(e.target.value)}
        />

        <div className='grid grid-cols-2 gap-4'>
          <DatePicker
            label='Echeance'
            value={dueDate}
            onChange={setDueDate}
            clearable
          />
          <Input
            label='Ressources'
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            placeholder='Ex: Budget, personnel, materiel...'
          />
        </div>

        {isEdit && (
          <Select
            label='Efficacite'
            options={EFFECTIVENESS_OPTIONS}
            value={effectiveness}
            onChange={(e) =>
              setEffectiveness(e.target.value as MeasureEffectiveness)
            }
          />
        )}

        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isPending || !title.trim()}>
            {isPending ? 'Enregistrement…' : isEdit ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
