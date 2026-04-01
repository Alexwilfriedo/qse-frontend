import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { DatePicker } from '../../../components/ui/DatePicker';
import { FileDropzone } from '../../../components/ui/FileDropzone';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { useAuthStore } from '../../auth/authStore';
import { useCreateDocument } from '../hooks/useStrategy';
import { DOCUMENT_TYPE_LABELS, StrategicDocumentType } from '../types';

interface CreateDocumentModalProps {
  open: boolean;
  onClose: () => void;
  allowedTypes?: StrategicDocumentType[];
}

export function CreateDocumentModal({
  open,
  onClose,
  allowedTypes,
}: CreateDocumentModalProps) {
  const createDoc = useCreateDocument();
  const currentUser = useAuthStore((s) => s.user);
  const typeOptions = allowedTypes ?? Object.values(StrategicDocumentType);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    type: typeOptions[0],
    titre: '',
    description: '',
    dateRevision: '',
    alerteJoursAvant: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDoc.mutate(
      {
        type: form.type,
        titre: form.titre,
        description: form.description || undefined,
        dateRevision: form.dateRevision,
        alerteJoursAvant: form.alerteJoursAvant,
        responsableId: currentUser?.id ?? '',
      },
      {
        onSuccess: () => {
          onClose();
          setFile(null);
          setForm({
            type: typeOptions[0],
            titre: '',
            description: '',
            dateRevision: '',
            alerteJoursAvant: 30,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={open} onClose={onClose} title='Nouveau document stratégique'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Select
          label='Type'
          options={typeOptions.map((t) => ({
            value: t,
            label: DOCUMENT_TYPE_LABELS[t],
          }))}
          value={form.type}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              type: e.target.value as StrategicDocumentType,
            }))
          }
        />
        <Input
          label='Titre'
          required
          value={form.titre}
          onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
        />
        <Input
          label='Description'
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <FileDropzone
          label='Fichier'
          hint='Importez le document source (PDF, Word, Excel…)'
          value={file}
          onChange={setFile}
        />
        <div className='grid grid-cols-2 gap-4'>
          <DatePicker
            label='Date de révision'
            required
            value={form.dateRevision}
            onChange={(v) => setForm((f) => ({ ...f, dateRevision: v }))}
          />
          <Input
            label='Alerte (jours avant)'
            type='number'
            value={String(form.alerteJoursAvant)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                alerteJoursAvant: parseInt(e.target.value) || 30,
              }))
            }
          />
        </div>
        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={createDoc.isPending}>
            {createDoc.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
