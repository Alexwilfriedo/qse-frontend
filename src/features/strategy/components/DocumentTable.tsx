import { Badge } from '../../../components/ui/Badge';
import type { StrategicDocument } from '../types';
import {
  DOCUMENT_TYPE_LABELS,
  REVISION_STATUT_LABELS,
  REVISION_STATUT_COLORS,
} from '../types';

interface DocumentTableProps {
  documents: StrategicDocument[];
  onSelect?: (doc: StrategicDocument) => void;
}

export function DocumentTable({ documents, onSelect }: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className='py-8 text-center text-gray-500'>
        Aucun document stratégique trouvé.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Titre
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Type
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Version
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Statut
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Révision
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className='hover:bg-gray-50 cursor-pointer'
              onClick={() => onSelect?.(doc)}>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-900'>{doc.titre}</span>
                  {doc.revisionEnRetard && (
                    <Badge variant='error'>En retard</Badge>
                  )}
                  {!doc.revisionEnRetard && doc.revisionProche && (
                    <Badge variant='warning'>Bientôt</Badge>
                  )}
                </div>
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>
                {DOCUMENT_TYPE_LABELS[doc.type]}
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>v{doc.version}</td>
              <td className='px-4 py-3'>
                <Badge variant={REVISION_STATUT_COLORS[doc.statut] as 'success' | 'warning' | 'default'}>
                  {REVISION_STATUT_LABELS[doc.statut]}
                </Badge>
              </td>
              <td className='px-4 py-3 text-sm text-gray-600'>{doc.dateRevision}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
