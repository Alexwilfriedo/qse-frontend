import { Card } from '@/components/ui';
import type { AuditFinding } from '../types';

interface Props {
  findings: AuditFinding[];
}

const COLUMNS = [
  { key: 'PF', label: 'Points forts', bgColor: 'bg-green-600', textColor: 'text-white' },
  { key: 'NCM', label: 'NC Majeure', bgColor: 'bg-red-600', textColor: 'text-white' },
  { key: 'NCm', label: 'NC Mineure', bgColor: 'bg-amber-500', textColor: 'text-white' },
  { key: 'PS', label: 'Points sensibles', bgColor: 'bg-orange-500', textColor: 'text-white' },
  { key: 'PP', label: 'Pistes de progrès', bgColor: 'bg-blue-600', textColor: 'text-white' },
] as const;

export function ReportSummaryCard({ findings }: Props) {
  const counts = findings.reduce(
    (acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Card className='p-4'>
      <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
        Synthèse des constats
      </p>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2 text-center font-medium ${col.bgColor} ${col.textColor}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {COLUMNS.map((col) => (
                <td key={col.key} className='px-4 py-3 text-center text-lg font-bold text-gray-800 border'>
                  {counts[col.key] ?? 0}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
