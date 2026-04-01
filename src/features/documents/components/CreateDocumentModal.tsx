import { Button, Input, Modal, Select } from '@/components/ui';
import type {
  DocumentDomaineConfig,
  DocumentTypeConfig,
} from '@/features/configuration/configurationApi';
import {
  useDocumentDomaines,
  useDocumentTypes,
} from '@/features/configuration/hooks';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDocument } from '../hooks';
import type {
  CreateDocumentRequest,
  DocumentDomaine,
  DocumentType,
} from '../types';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FORM_DATA: Omit<CreateDocumentRequest, 'contenu'> = {
  code: '',
  titre: '',
  type: 'PROCEDURE',
  domaine: 'QUALITE',
};

export function CreateDocumentModal({
  isOpen,
  onClose,
}: CreateDocumentModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] =
    useState<Omit<CreateDocumentRequest, 'contenu'>>(DEFAULT_FORM_DATA);
  const createDocument = useCreateDocument();

  // Charger types et domaines dynamiques (actifs uniquement)
  const { data: types } = useDocumentTypes(true);
  const { data: domaines } = useDocumentDomaines(true);

  const typeOptions = useMemo(
    () =>
      types?.map((t: DocumentTypeConfig) => ({
        value: t.code,
        label: t.label,
      })) ?? [],
    [types],
  );

  const domaineOptions = useMemo(
    () =>
      domaines?.map((d: DocumentDomaineConfig) => ({
        value: d.code,
        label: d.label,
      })) ?? [],
    [domaines],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createDocument.mutateAsync({
        ...formData,
        contenu: '',
      });
      onClose();
      // Rediriger vers la page du document pour édition
      navigate(`/documents/${result.id}`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Nouveau document'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Code *
          </label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            placeholder='DOC-001'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Titre *
          </label>
          <Input
            value={formData.titre}
            onChange={(e) =>
              setFormData({ ...formData, titre: e.target.value })
            }
            placeholder='Titre du document'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Type *
          </label>
          <Select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as DocumentType })
            }
            options={typeOptions}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Domaine *
          </label>
          <Select
            value={formData.domaine}
            onChange={(e) =>
              setFormData({
                ...formData,
                domaine: e.target.value as DocumentDomaine,
              })
            }
            options={domaineOptions}
          />
        </div>

        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Vous pourrez ajouter le contenu après la création du document.
        </p>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={createDocument.isPending}>
            {createDocument.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
