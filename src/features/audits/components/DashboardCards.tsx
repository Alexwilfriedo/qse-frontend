import { Card } from '@/components/ui';
import { BarChart3, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import type { AuditDashboard } from '../types';

interface Props {
  dashboard: AuditDashboard;
}

export function DashboardCards({ dashboard }: Props) {
  const cards = [
    {
      label: 'Total audits',
      value: dashboard.total,
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Planifies',
      value: dashboard.planifies,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Clotures',
      value: dashboard.realises,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'En retard',
      value: dashboard.enRetard,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map((c) => (
        <Card key={c.label} className='p-4'>
          <div className='flex items-center gap-3'>
            <div className={`p-2 rounded-lg ${c.color}`}>
              <c.icon className='w-5 h-5' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>{c.label}</p>
              <p className='text-2xl font-semibold'>{c.value}</p>
            </div>
          </div>
        </Card>
      ))}

      {dashboard.prochainAudit && (
        <Card className='col-span-full p-4 border-l-4 border-l-brand-500'>
          <p className='text-sm text-gray-500'>Prochain audit</p>
          <p className='font-medium'>{dashboard.prochainAudit.titre}</p>
          <p className='text-sm text-gray-500'>
            {dashboard.prochainAudit.datePrevisionnelle} — {dashboard.prochainAudit.perimetre}
          </p>
        </Card>
      )}

      <Card className='p-4'>
        <p className='text-sm text-gray-500'>Taux de realisation</p>
        <p className='text-2xl font-semibold'>{dashboard.tauxRealisation.toFixed(1)}%</p>
        <div className='mt-2 h-2 bg-gray-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-brand-500 rounded-full transition-all'
            style={{ width: `${Math.min(dashboard.tauxRealisation, 100)}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
