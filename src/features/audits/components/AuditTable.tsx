import { Skeleton } from '@/components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import type { AuditSummary, AuditStatut, AuditType } from '../types';

interface Props {
  audits: AuditSummary[] | undefined;
  isLoading: boolean;
}

const STATUT_COLORS: Record<AuditStatut, string> = {
  PLANIFIE: 'bg-gray-100 text-gray-700',
  CONVOQUE: 'bg-amber-100 text-amber-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  RAPPORT_SOUMIS: 'bg-indigo-100 text-indigo-700',
  RAPPORT_VALIDE: 'bg-purple-100 text-purple-700',
  SIGNE: 'bg-teal-100 text-teal-700',
  CLOTURE: 'bg-green-100 text-green-700',
  ANNULE: 'bg-red-100 text-red-700',
};

const STATUT_LABELS: Record<AuditStatut, string> = {
  PLANIFIE: 'Planifie',
  CONVOQUE: 'Convoque',
  EN_COURS: 'En cours',
  RAPPORT_SOUMIS: 'Rapport soumis',
  RAPPORT_VALIDE: 'Rapport valide',
  SIGNE: 'Signe',
  CLOTURE: 'Cloture',
  ANNULE: 'Annule',
};

const TYPE_LABELS: Record<AuditType, string> = {
  INTERNE: 'Interne',
  EXTERNE: 'Externe',
  CERTIFICATION: 'Certification',
  SURVEILLANCE: 'Surveillance',
};

export function AuditTable({ audits, isLoading }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className='p-4 space-y-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (!audits?.length) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Aucun audit dans cette campagne.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead className='bg-gray-50 text-left text-gray-600'>
          <tr>
            <th className='px-4 py-3 font-medium'>Titre</th>
            <th className='px-4 py-3 font-medium'>Type</th>
            <th className='px-4 py-3 font-medium'>Perimetre</th>
            <th className='px-4 py-3 font-medium'>Date prev.</th>
            <th className='px-4 py-3 font-medium'>Statut</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {audits.map((a) => (
            <tr
              key={a.id}
              className='hover:bg-gray-50 cursor-pointer transition-colors'
              onClick={() => navigate(`/audits/${a.id}`)}
            >
              <td className='px-4 py-3 font-medium'>{a.titre}</td>
              <td className='px-4 py-3 text-gray-600'>{TYPE_LABELS[a.type]}</td>
              <td className='px-4 py-3 text-gray-600'>{a.perimetre}</td>
              <td className='px-4 py-3 text-gray-600'>{a.datePrevisionnelle}</td>
              <td className='px-4 py-3'>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[a.statut]}`}>
                  {STATUT_LABELS[a.statut]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
