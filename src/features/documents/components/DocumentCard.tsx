import {
  Badge,
  Card,
  DomainBadge,
  Skeleton,
  SkeletonText,
} from '@/components/ui';
import type { Document, DocumentDomaine } from '../types';

interface DocumentCardProps {
  document: Document | undefined;
  isLoading: boolean;
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

export function DocumentCard({ document, isLoading }: DocumentCardProps) {
  if (isLoading) {
    return (
      <Card>
        <div className='p-6 space-y-6'>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-6 w-24' />
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-6 w-16' />
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className='h-4 w-16 mb-2' />
                <Skeleton className='h-5 w-24' />
              </div>
            ))}
          </div>
          <div>
            <Skeleton className='h-4 w-16 mb-2' />
            <SkeletonText lines={5} />
          </div>
        </div>
      </Card>
    );
  }

  if (!document) return null;

  return (
    <Card>
      <div className='p-6 space-y-6'>
        {/* Badges */}
        <div className='flex flex-wrap items-center gap-3'>
          <DomainBadge domain={mapDomaine(document.domaine)} />
          <Badge variant={statutBadgeVariant[document.statut] || 'info'}>
            {statutLabels[document.statut] || document.statut}
          </Badge>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {typeLabels[document.type] || document.type}
          </span>
        </div>

        {/* Métadonnées */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200 dark:border-gray-700'>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
              Version
            </p>
            <p className='text-sm font-medium text-gray-900 dark:text-white mt-1'>
              {document.version}
            </p>
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
              Créé le
            </p>
            <p className='text-sm font-medium text-gray-900 dark:text-white mt-1'>
              {new Date(document.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
              Modifié le
            </p>
            <p className='text-sm font-medium text-gray-900 dark:text-white mt-1'>
              {document.updatedAt
                ? new Date(document.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
              ID
            </p>
            <p className='text-sm font-mono text-gray-500 dark:text-gray-400 mt-1 truncate'>
              {document.id}
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div>
          <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
            Contenu
          </h3>
          <div className='prose prose-sm dark:prose-invert max-w-none'>
            {document.contenu ? (
              <div
                className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'
                dangerouslySetInnerHTML={{ __html: document.contenu }}
              />
            ) : (
              <p className='text-gray-400 dark:text-gray-500 italic'>
                Aucun contenu
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
