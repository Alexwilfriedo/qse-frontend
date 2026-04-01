import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useStakeholders } from './hooks/useStrategy';
import {
  CARACTERE_EXIGENCE_LABELS,
  Stakeholder,
  STAKEHOLDER_CLASSIFICATION_LABELS,
  STAKEHOLDER_TYPE_LABELS,
} from './types';

/**
 * Page Matrice des Besoins et Attentes (PRD M6-05).
 * Tableau corrélant chaque partie intéressée à ses exigences
 * et la réponse de l'entreprise.
 */
export function MatriceBesoinsAttentesPage() {
  const { data: stakeholders, isLoading } = useStakeholders();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Matrice des Besoins et Attentes'
        description='Tableau corrélant chaque partie intéressée à ses exigences'
      />

      <Card>
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Parties Intéressées
          </h3>
          <p className='text-sm text-gray-500'>
            {stakeholders?.length ?? 0} parties intéressées référencées
          </p>
        </div>

        {isLoading ? (
          <SkeletonTable rows={8} columns={5} />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-800'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Partie Intéressée
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Classification
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Besoins & Attentes
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Caractère Exigence
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
                {stakeholders?.map((s: Stakeholder) => (
                  <tr
                    key={s.id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <td className='px-4 py-4'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        {s.nom}
                      </div>
                    </td>
                    <td className='px-4 py-4'>
                      <Badge
                        variant={
                          s.classification === 'INTERNE' ? 'info' : 'default'
                        }>
                        {STAKEHOLDER_CLASSIFICATION_LABELS[s.classification]}
                      </Badge>
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-700 dark:text-gray-300'>
                      {STAKEHOLDER_TYPE_LABELS[s.stakeholderType]}
                    </td>
                    <td className='px-4 py-4 max-w-md'>
                      <p className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                        {s.besoinAttente}
                      </p>
                    </td>
                    <td className='px-4 py-4'>
                      <Badge
                        variant={getExigenceBadgeVariant(s.caractereExigence)}>
                        {CARACTERE_EXIGENCE_LABELS[s.caractereExigence]}
                      </Badge>
                    </td>
                    <td className='px-4 py-4'>
                      {s.revisionEnRetard ? (
                        <Badge variant='error'>En retard</Badge>
                      ) : s.revisionProche ? (
                        <Badge variant='warning'>À réviser</Badge>
                      ) : (
                        <Badge variant='success'>À jour</Badge>
                      )}
                    </td>
                  </tr>
                ))}
                {(!stakeholders || stakeholders.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-4 py-8 text-center text-gray-500'>
                      Aucune partie intéressée référencée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function getExigenceBadgeVariant(
  caractere: string,
): 'error' | 'warning' | 'info' | 'default' {
  switch (caractere) {
    case 'LEGALE':
      return 'error';
    case 'REGLEMENTAIRE':
      return 'warning';
    case 'CONTRACTUELLE':
      return 'info';
    default:
      return 'default';
  }
}
