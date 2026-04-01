import {
  Button,
  Card,
  PageHeader,
  RichTextEditor,
  Select,
} from '@/components/ui';
import type {
  DocumentDomaineConfig,
  DocumentTypeConfig,
} from '@/features/configuration/configurationApi';
import {
  useDocumentDomaines,
  useDocumentTypes,
} from '@/features/configuration/hooks';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocument, useUpdateDocument } from './hooks';
import type {
  DocumentDomaine,
  DocumentType,
  UpdateDocumentRequest,
} from './types';

export default function DocumentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: document, isLoading, error } = useDocument(id);
  const updateDocument = useUpdateDocument();

  // Charger types et domaines dynamiques
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

  const [formData, setFormData] = useState<UpdateDocumentRequest>({
    titre: '',
    contenu: '',
    type: 'PROCEDURE',
    domaine: 'QUALITE',
  });

  useEffect(() => {
    if (document) {
      setFormData({
        titre: document.titre,
        contenu: document.contenu || '',
        type: document.type,
        domaine: document.domaine,
        version: document.entityVersion,
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateDocument.mutateAsync({ id, data: formData });
      navigate(`/documents/${id}`);
    } catch {
      // Error handled by mutation
    }
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Document non trouvé'
          description="Le document demandé n'existe pas ou a été supprimé"
          actions={
            <Button variant='secondary' onClick={() => navigate('/documents')}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour à la liste
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Chargement...' description='Édition du document' />
        <Card>
          <div className='p-6 animate-pulse'>
            <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4' />
            <div className='h-64 bg-gray-200 dark:bg-gray-700 rounded' />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`Modifier: ${document?.titre}`}
        description='Édition du contenu du document'
        actions={
          <Button
            variant='secondary'
            onClick={() => navigate(`/documents/${id}`)}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Annuler
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Type
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as DocumentType,
                    })
                  }
                  options={typeOptions}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Domaine
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
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Contenu du document
              </label>
              <RichTextEditor
                value={formData.contenu || ''}
                onChange={(value: string) =>
                  setFormData({ ...formData, contenu: value })
                }
                placeholder='Rédigez le contenu du document...'
              />
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
              <Button
                type='button'
                variant='secondary'
                onClick={() => navigate(`/documents/${id}`)}>
                Annuler
              </Button>
              <Button type='submit' disabled={updateDocument.isPending}>
                <Save className='w-4 h-4 mr-2' />
                {updateDocument.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
