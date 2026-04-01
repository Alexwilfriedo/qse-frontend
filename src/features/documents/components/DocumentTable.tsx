import { Badge, Button, DataTable, DomainBadge } from '@/components/ui';
import { Edit2, Trash2 } from 'lucide-react';
import type { Document, DocumentDomaine } from '../types';

interface DocumentTableProps {
  documents: Document[] | undefined;
  isLoading: boolean;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
}

const statutBadgeVariant: Record<
  string,
  'success' | 'warning' | 'error' | 'info'
> = {
  BROUILLON: 'info',
  EN_VERIFICATION: 'warning',
  EN_CONSULTATION: 'warning',
  APPROUVE: 'success',
  PUBLIE: 'success',
  REJETE: 'error',
  ARCHIVE: 'info',
};

const statutLabels: Record<string, string> = {
  BROUILLON: 'Brouillon',
  EN_VERIFICATION: 'En vérification',
  EN_CONSULTATION: 'En consultation',
  APPROUVE: 'Approuvé',
  PUBLIE: 'Publié',
  REJETE: 'Rejeté',
  ARCHIVE: 'Archivé',
};

const typeLabels: Record<string, string> = {
  PROCEDURE: 'Procédure',
  INSTRUCTION: 'Instruction',
  FORMULAIRE: 'Formulaire',
  ENREGISTREMENT: 'Enregistrement',
  POLITIQUE: 'Politique',
  MANUEL: 'Manuel',
  CONSIGNE: 'Consigne',
  MATRICE: 'Matrice',
  DOCUMENT_EXTERNE: 'Document externe',
};

function mapDomaine(
  domaine: DocumentDomaine,
): 'qualite' | 'securite' | 'environnement' {
  const map: Record<DocumentDomaine, 'qualite' | 'securite' | 'environnement'> =
    {
      QUALITE: 'qualite',
      SECURITE: 'securite',
      ENVIRONNEMENT: 'environnement',
    };
  return map[domaine];
}

export function DocumentTable({
  documents,
  isLoading,
  onEdit,
  onDelete,
}: DocumentTableProps) {
  const columns = [
    {
      key: 'titre',
      header: 'Titre',
      render: (doc: Document) => (
        <div className='font-medium text-gray-900 dark:text-white'>
          {doc.titre}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (doc: Document) => (
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {typeLabels[doc.type] || doc.type}
        </span>
      ),
    },
    {
      key: 'domaine',
      header: 'Domaine',
      render: (doc: Document) => (
        <DomainBadge domain={mapDomaine(doc.domaine)} />
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (doc: Document) => (
        <Badge variant={statutBadgeVariant[doc.statut] || 'info'}>
          {statutLabels[doc.statut] || doc.statut}
        </Badge>
      ),
    },
    {
      key: 'version',
      header: 'Version',
      render: (doc: Document) => (
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {doc.version}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Créé le',
      render: (doc: Document) => (
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (doc: Document) => (
        <div className='flex gap-1 justify-end'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(doc)}
            title='Modifier'>
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(doc)}
            title='Supprimer'>
            <Trash2 className='w-4 h-4 text-error-500' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={documents}
      isLoading={isLoading}
      keyExtractor={(doc) => doc.id}
      emptyMessage='Aucun document trouvé'
      skeletonRows={5}
    />
  );
}
