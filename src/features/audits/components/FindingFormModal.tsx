import {
  Button,
  DatePicker,
  FileDropzone,
  Label,
  Modal,
  Select,
  Textarea,
} from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type {
  CreateFindingRequest,
  FindingMiseEnOeuvreItem,
  FindingType,
} from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateFindingRequest) => void;
  isPending: boolean;
}

const CLASSIFICATION_OPTIONS = [
  { value: 'PF', label: 'Point fort (PF)' },
  { value: 'PP', label: 'Piste de progrès (PP)' },
  { value: 'PS', label: 'Point sensible (PS)' },
  { value: 'NCM', label: 'Non-conformité Majeure (NCM)' },
  { value: 'NCm', label: 'Non-conformité Mineure (NCm)' },
];

export function FindingFormModal({ isOpen, onClose, onSave, isPending }: Props) {
  const { data: users } = useUsers();
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FindingType>('PF');
  const [ecartDescription, setEcartDescription] = useState('');
  const [referenceNormative, setReferenceNormative] = useState('');
  const [miseEnOeuvreItems, setMiseEnOeuvreItems] = useState<
    (FindingMiseEnOeuvreItem & { id: string })[]
  >([
    {
      id: crypto.randomUUID(),
      recommandation: '',
      preuves: '',
      preuveFile: null,
      responsableActionId: '',
      delaiMiseEnOeuvre: '',
    },
  ]);

  const requiresEcart = type !== 'PF';
  const isValid = description.trim() !== '' && (!requiresEcart || ecartDescription.trim() !== '');

  const userOptions = useMemo(
    () =>
      [{ value: '', label: '— Sélectionner —' }].concat(
        (users ?? []).map((u) => ({
          value: u.id,
          label: `${u.firstName} ${u.lastName}`,
        })),
      ),
    [users],
  );

  const handleSubmit = () => {
    if (!isValid) return;

    const data: CreateFindingRequest = {
      type,
      description: description.trim(),
      referenceNormative: referenceNormative.trim() || undefined,
      ecartDescription: requiresEcart ? ecartDescription.trim() : undefined,
      miseEnOeuvreItems: requiresEcart
        ? miseEnOeuvreItems
            .map(
              ({
                recommandation,
                preuves,
                preuveFile,
                responsableActionId,
                delaiMiseEnOeuvre,
                id,
              }) => ({
                id,
                recommandation: recommandation?.trim() || undefined,
                preuves: preuveFile?.name || preuves?.trim() || undefined,
                preuveFile: preuveFile ?? undefined,
                responsableActionId: responsableActionId || undefined,
                delaiMiseEnOeuvre: delaiMiseEnOeuvre || undefined,
              }),
            )
            .filter(
              (item) =>
                item.recommandation ||
                item.preuves ||
                item.preuveFile ||
                item.responsableActionId ||
                item.delaiMiseEnOeuvre,
            )
        : undefined,
    };

    onSave(data);
  };

  const resetForm = () => {
    setDescription('');
    setType('PF');
    setEcartDescription('');
    setReferenceNormative('');
    setMiseEnOeuvreItems([
      {
        id: crypto.randomUUID(),
        recommandation: '',
        preuves: '',
        preuveFile: null,
        responsableActionId: '',
        delaiMiseEnOeuvre: '',
      },
    ]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Ajouter un constat'>
      <div className='space-y-4'>
        <div>
          <Label>Constat *</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description du constat...'
            rows={3}
          />
        </div>

        <div>
          <Label>Classification *</Label>
          <Select
            options={CLASSIFICATION_OPTIONS}
            value={type}
            onChange={(e) => setType(e.target.value as FindingType)}
          />
        </div>

        <div>
          <Label>Référence normative</Label>
          <Textarea
            value={referenceNormative}
            onChange={(e) => setReferenceNormative(e.target.value)}
            placeholder='Ex: ISO 9001 §8.5.1'
            rows={1}
          />
        </div>

        {requiresEcart && (
          <div>
            <Label>Description de l&apos;écart *</Label>
            <Textarea
              value={ecartDescription}
              onChange={(e) => setEcartDescription(e.target.value)}
              placeholder="Description de l'écart constaté..."
              rows={3}
            />
          </div>
        )}

        {requiresEcart && (
          <>
            <div className='space-y-3 rounded-xl border border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <Label>Mesures de mise en œuvre</Label>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    setMiseEnOeuvreItems((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        recommandation: '',
                        preuves: '',
                        preuveFile: null,
                        responsableActionId: '',
                        delaiMiseEnOeuvre: '',
                      },
                    ])
                  }>
                  <Plus className='mr-1 h-4 w-4' />
                  Ajouter
                </Button>
              </div>

              {miseEnOeuvreItems.map((item, index) => (
                <div
                  key={item.id}
                  className='space-y-3 rounded-xl border border-gray-200 p-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-gray-700'>
                      Élément {index + 1}
                    </p>
                    <Button
                      type='button'
                      variant='secondary'
                      disabled={miseEnOeuvreItems.length === 1}
                      onClick={() =>
                        setMiseEnOeuvreItems((prev) =>
                          prev.filter((current) => current.id !== item.id),
                        )
                      }>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>

                  <div>
                    <Label>Recommandations</Label>
                    <Textarea
                      value={item.recommandation ?? ''}
                      onChange={(e) =>
                        setMiseEnOeuvreItems((prev) =>
                          prev.map((current) =>
                            current.id === item.id
                              ? { ...current, recommandation: e.target.value }
                              : current,
                          ),
                        )
                      }
                      placeholder='Recommandations...'
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Preuves numériques</Label>
                    <FileDropzone
                      value={item.preuveFile ?? null}
                      onChange={(file) =>
                        setMiseEnOeuvreItems((prev) =>
                          prev.map((current) =>
                            current.id === item.id
                              ? {
                                  ...current,
                                  preuveFile: file,
                                  preuves: file?.name ?? '',
                                }
                              : current,
                          ),
                        )
                      }
                      accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg'
                      hint='Joindre une pièce justificative : photo, PDF, document scanné, etc.'
                    />
                  </div>

                  <div>
                    <Label>Responsable de la mise en œuvre</Label>
                    <Select
                      options={userOptions}
                      value={item.responsableActionId ?? ''}
                      onChange={(e) =>
                        setMiseEnOeuvreItems((prev) =>
                          prev.map((current) =>
                            current.id === item.id
                              ? { ...current, responsableActionId: e.target.value }
                              : current,
                          ),
                        )
                      }
                      searchable
                    />
                  </div>

                  <div>
                    <Label>Délai de mise en œuvre</Label>
                    <DatePicker
                      value={item.delaiMiseEnOeuvre ?? ''}
                      onChange={(value) =>
                        setMiseEnOeuvreItems((prev) =>
                          prev.map((current) =>
                            current.id === item.id
                              ? { ...current, delaiMiseEnOeuvre: value }
                              : current,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='secondary' onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? 'Enregistrement...' : 'Ajouter le constat'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
