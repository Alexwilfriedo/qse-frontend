import { Skeleton } from '@/components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import type { AuditCampaign, CampaignStatut } from '../types';

interface Props {
  campaigns: AuditCampaign[] | undefined;
  isLoading: boolean;
}

const STATUT_COLORS: Record<CampaignStatut, string> = {
  PLANIFIEE: 'bg-gray-100 text-gray-700',
  SOUMISE: 'bg-amber-100 text-amber-700',
  CONFIRMEE: 'bg-blue-100 text-blue-700',
  EN_COURS: 'bg-indigo-100 text-indigo-700',
  TERMINEE: 'bg-green-100 text-green-700',
  ANNULEE: 'bg-red-100 text-red-700',
};

const STATUT_LABELS: Record<CampaignStatut, string> = {
  PLANIFIEE: 'Planifiee',
  SOUMISE: 'Soumise DG',
  CONFIRMEE: 'Confirmee',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminee',
  ANNULEE: 'Annulee',
};

export function CampaignTable({ campaigns, isLoading }: Props) {
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

  if (!campaigns?.length) {
    return (
      <div className='p-8 text-center text-gray-500'>
        Aucune campagne pour cette annee.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead className='bg-gray-50 text-left text-gray-600'>
            <tr>
            <th className='px-4 py-3 font-medium'>Programme</th>
            <th className='px-4 py-3 font-medium'>Période</th>
            <th className='px-4 py-3 font-medium'>Périmètre</th>
            <th className='px-4 py-3 font-medium'>Audits</th>
            <th className='px-4 py-3 font-medium'>Workflow</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {campaigns.map((c) => (
            <tr
              key={c.id}
              className='hover:bg-gray-50 cursor-pointer transition-colors'
              onClick={() => navigate(`/audits/campaigns/${c.id}`)}>
              <td className='px-4 py-3'>
                <div className='font-medium text-gray-900'>{c.titre}</div>
                <div className='text-xs text-gray-500'>
                  {c.referentielNormatif ?? 'Référentiel non renseigné'}
                </div>
              </td>
              <td className='px-4 py-3 text-gray-600'>
                {c.dateDebut} — {c.dateFin}
              </td>
              <td className='px-4 py-3 text-gray-600'>
                {c.scopeLabel ?? 'Non renseigné'}
              </td>
              <td className='px-4 py-3 text-gray-600'>{c.auditCount}</td>
              <td className='px-4 py-3'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_COLORS[c.statut]}`}>
                  {STATUT_LABELS[c.statut]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
