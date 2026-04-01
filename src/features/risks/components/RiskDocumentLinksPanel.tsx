import {
  Button,
  Card,
  CardHeader,
  Input,
  Modal,
  Select,
  SkeletonText,
} from '@/components/ui';
import { useDocuments } from '@/features/documents/hooks';
import { showToast } from '@/lib/toast';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useAddDocumentLink,
  useRemoveDocumentLink,
  useRiskDocumentLinks,
} from '../hooks/useRisks';
import type { RiskDocumentLink } from '../types';

interface Props {
  riskId: string;
}

export default function RiskDocumentLinksPanel({ riskId }: Props) {
  const { data: links, isLoading } = useRiskDocumentLinks(riskId);
  const addMutation = useAddDocumentLink(riskId);
  const removeMutation = useRemoveDocumentLink(riskId);
  const [addOpen, setAddOpen] = useState(false);

  const handleRemove = async (linkId: string) => {
    try {
      await removeMutation.mutateAsync(linkId);
      showToast.success('Lien supprimé');
    } catch {
      showToast.error('Erreur lors de la suppression');
    }
  };

  return (
    <Card>
      <CardHeader
        title='Dispositif de maitrise des risques'
        action={
          <Button
            variant='secondary'
            size='sm'
            onClick={() => setAddOpen(true)}>
            <Plus className='mr-1 h-3.5 w-3.5' />
            Lier un document
          </Button>
        }
      />
      <div className='p-4 pt-0'>
        {isLoading && <SkeletonText lines={3} />}

        {!isLoading && (!links || links.length === 0) && (
          <p className='py-4 text-center text-sm text-gray-500'>
            Aucun document lié. Liez des procédures ou instructions comme
            mesures de maîtrise.
          </p>
        )}

        {links && links.length > 0 && (
          <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
            {links.map((link) => (
              <DocumentLinkItem
                key={link.id}
                link={link}
                onRemove={handleRemove}
              />
            ))}
          </ul>
        )}
      </div>

      <AddDocumentLinkModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={async (documentId, description) => {
          try {
            await addMutation.mutateAsync({ documentId, description });
            showToast.success('Document lié');
            setAddOpen(false);
          } catch {
            showToast.error('Erreur ou document déjà lié');
          }
        }}
        isPending={addMutation.isPending}
      />
    </Card>
  );
}

function DocumentLinkItem({
  link,
  onRemove,
}: {
  link: RiskDocumentLink;
  onRemove: (id: string) => void;
}) {
  return (
    <li className='flex items-center justify-between py-2.5'>
      <div className='flex items-center gap-2'>
        <FileText className='h-4 w-4 text-gray-400' />
        <div>
          <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
            {link.description || 'Document lié'}
          </p>
          <p className='text-xs text-gray-500'>
            ID: {link.documentId.substring(0, 8)}… —{' '}
            {new Date(link.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(link.id)}
        className='rounded p-1 text-gray-400 hover:bg-red-50 hover:text-error-600'
        title='Supprimer le lien'>
        <Trash2 className='h-4 w-4' />
      </button>
    </li>
  );
}

function AddDocumentLinkModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documentId: string, description?: string) => void;
  isPending: boolean;
}) {
  const [documentId, setDocumentId] = useState('');
  const [description, setDescription] = useState('');
  const { data: docsPage } = useDocuments({ size: 200 });

  const documentOptions =
    docsPage?.content?.map((doc) => ({
      value: doc.id,
      label: `${doc.code} — ${doc.titre}`,
      description: doc.domaine,
    })) ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(documentId, description || undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Lier un document GED'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Select
          label='Document GED'
          required
          searchable
          placeholder='Rechercher un document...'
          options={documentOptions}
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
        />
        <Input
          label='Description du lien'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Ex: Procedure de consignation'
        />
        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isPending || !documentId}>
            {isPending ? 'Liaison...' : 'Lier le document'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
