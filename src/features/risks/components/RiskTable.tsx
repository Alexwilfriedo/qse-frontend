import { Badge, SkeletonTable } from '@/components/ui';
import type { Risk } from '../types';

const DOMAINE_BADGE: Record<
  string,
  { variant: 'info' | 'warning' | 'success'; label: string }
> = {
  QUALITE: { variant: 'info', label: 'Qualité' },
  SECURITE: { variant: 'warning', label: 'Sécurité' },
  ENVIRONNEMENT: { variant: 'success', label: 'Environnement' },
};

const RISK_TYPE_LABEL: Record<string, string> = {
  DANGER: 'Danger',
  ASPECT_ENVIRONNEMENTAL: 'Aspect Env.',
  VULNERABILITE_PROCESSUS: 'Vuln. Processus',
};

const RISK_CATEGORY_LABEL: Record<string, string> = {
  STRATEGIQUE: 'Strategique',
  OPERATIONNEL: 'Operationnel',
  FINANCIER: 'Financier',
  JURIDIQUE: 'Juridique',
  TECHNOLOGIQUE: 'Technologique',
  PHYSIQUE: 'Physique',
  PSYCHOSOCIAUX: 'Psychosociaux',
  CATASTROPHES_NATURELLES: 'Catastrophes naturelles',
  CHIMIQUES: 'Chimiques',
  BIOLOGIQUE: 'Biologique',
};

function criticityStyle(risk: Risk): React.CSSProperties {
  return { backgroundColor: risk.criticalityColor ?? '#9CA3AF', color: '#fff' };
}

interface Props {
  risks: Risk[] | undefined;
  isLoading: boolean;
  onSelect: (risk: Risk) => void;
}

export default function RiskTable({ risks, isLoading, onSelect }: Props) {
  if (isLoading) return <SkeletonTable rows={5} columns={7} />;

  if (!risks?.length) {
    return (
      <div className='rounded border border-gray-200 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700'>
        Aucun risque identifié. Cliquez sur "Identifier un risque" pour
        commencer.
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Code
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Nom du risque
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Domaine
            </th>
            <th className='px-4 py-2 text-left text-xs font-medium uppercase text-gray-500'>
              Catégorie du risque
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium uppercase text-gray-500'>
              F
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium uppercase text-gray-500'>
              G
            </th>
            <th className='px-4 py-2 text-center text-xs font-medium uppercase text-gray-500'>
              Criticité
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {risks.map((risk) => {
            const badge = DOMAINE_BADGE[risk.domaine];
            return (
              <tr
                key={risk.id}
                className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                onClick={() => onSelect(risk)}>
                <td className='px-4 py-2 font-mono text-sm'>{risk.code}</td>
                <td className='px-4 py-2 text-sm font-medium'>{risk.title}</td>
                <td className='px-4 py-2'>
                  {badge && (
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  )}
                </td>
                <td className='px-4 py-2 text-sm text-gray-600'>
                  {RISK_CATEGORY_LABEL[risk.riskCategory ?? ''] ??
                    RISK_TYPE_LABEL[risk.riskType] ??
                    risk.riskType}
                </td>
                <td className='px-4 py-2 text-center text-sm'>
                  {risk.frequency}
                </td>
                <td className='px-4 py-2 text-center text-sm'>
                  {risk.severity}
                </td>
                <td className='px-4 py-2 text-center'>
                  <span
                    className='inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold'
                    style={criticityStyle(risk)}>
                    {risk.criticityScore}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
