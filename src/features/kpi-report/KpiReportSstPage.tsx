import { Button, Card, CardHeader, PageHeader } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateSstEpiModal } from './components/CreateSstEpiModal';
import { CreateSstMonthlyModal } from './components/CreateSstMonthlyModal';
import { SstAccidentCards } from './components/SstAccidentCards';
import { SstAccidentCharts } from './components/SstAccidentCharts';
import { SstEpiCards } from './components/SstEpiCards';
import { SstEpiCharts } from './components/SstEpiCharts';
import {
  useCreateSstEpiReport,
  useCreateSstMonthlyReport,
  useSstEpiReports,
  useSstMonthlyReports,
} from './hooks/useSst';
import type { CreateSstEpiReportRequest, CreateSstMonthlyReportRequest } from './sstTypes';

type Tab = 'accidentologie' | 'epi';

export default function KpiReportSstPage() {
  const [activeTab, setActiveTab] = useState<Tab>('accidentologie');
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [isEpiModalOpen, setIsEpiModalOpen] = useState(false);

  const { data: monthlyReports = [], isLoading: monthlyLoading } = useSstMonthlyReports();
  const { data: epiReports = [], isLoading: epiLoading } = useSstEpiReports();

  const createMonthly = useCreateSstMonthlyReport();
  const createEpi = useCreateSstEpiReport();

  const latestMonthly = monthlyReports[0] ?? undefined;
  const latestEpi = epiReports[0] ?? undefined;

  const handleCreateMonthly = (data: CreateSstMonthlyReportRequest) => {
    createMonthly.mutate(data, {
      onSuccess: () => {
        showToast.success('Rapport mensuel SST enregistré');
        setIsMonthlyModalOpen(false);
      },
      onError: (error) => showToast.error(getApiErrorMessage(error)),
    });
  };

  const handleCreateEpi = (data: CreateSstEpiReportRequest) => {
    createEpi.mutate(data, {
      onSuccess: () => {
        showToast.success('Rapport EPI enregistré');
        setIsEpiModalOpen(false);
      },
      onError: (error) => showToast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Tableau de bord SST — ISO 45001'
        description='Santé & Sécurité au Travail'
        actions={
          <Button
            leftIcon={<Plus className='w-4 h-4' />}
            onClick={() =>
              activeTab === 'accidentologie'
                ? setIsMonthlyModalOpen(true)
                : setIsEpiModalOpen(true)
            }
            className='whitespace-nowrap'>
            {activeTab === 'accidentologie' ? 'Nouvelle saisie mensuelle' : 'Nouveau rapport EPI'}
          </Button>
        }
      />

      {/* Tabs */}
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <nav className='-mb-px flex gap-6'>
          <button
            onClick={() => setActiveTab('accidentologie')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'accidentologie'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}>
            TB Accidentologie
          </button>
          <button
            onClick={() => setActiveTab('epi')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'epi'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}>
            Gestion & Performance des EPI
          </button>
        </nav>
      </div>

      {/* Tab Accidentologie */}
      {activeTab === 'accidentologie' && (
        <div className='space-y-6'>
          <SstAccidentCards report={latestMonthly} isLoading={monthlyLoading} />
          <SstAccidentCharts reports={monthlyReports} />
          <Card>
            <CardHeader
              title='Rapports mensuels'
              description={`${monthlyReports.length} rapport(s) enregistré(s)`}
            />
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-800'>
                  <tr>
                    {['Période', 'Acc. Trajet', 'Fatalités', 'Avec arrêt', 'Sans arrêt', 'Presqu\'acc.', 'Jours arrêt', 'TF', 'TG'].map((h) => (
                      <th key={h} className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
                  {monthlyReports.map((r) => (
                    <tr key={r.id}>
                      <td className='px-4 py-3 font-medium'>{r.period}</td>
                      <td className='px-4 py-3'>{r.accidentsTrajet}</td>
                      <td className='px-4 py-3'>{r.fatalites}</td>
                      <td className='px-4 py-3'>{r.accidentsAvecArret}</td>
                      <td className='px-4 py-3'>{r.accidentsSansArret}</td>
                      <td className='px-4 py-3'>{r.presquaccidents}</td>
                      <td className='px-4 py-3'>{r.joursArrets}</td>
                      <td className='px-4 py-3 font-mono text-sm'>{r.tauxFrequence?.toFixed(2) ?? '—'}</td>
                      <td className='px-4 py-3 font-mono text-sm'>{r.tauxGravite?.toFixed(2) ?? '—'}</td>
                    </tr>
                  ))}
                  {monthlyReports.length === 0 && !monthlyLoading && (
                    <tr>
                      <td colSpan={9} className='px-4 py-8 text-center text-gray-400'>
                        Aucun rapport mensuel enregistré
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab EPI */}
      {activeTab === 'epi' && (
        <div className='space-y-6'>
          <SstEpiCards report={latestEpi} isLoading={epiLoading} />
          <SstEpiCharts reports={epiReports} />
          <Card>
            <CardHeader
              title='Rapports EPI'
              description={`${epiReports.length} rapport(s) enregistré(s)`}
            />
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead className='bg-gray-50 dark:bg-gray-800'>
                  <tr>
                    {['Période', 'Total Stock', 'En service', 'Stockage', 'Réparation', 'Conformes', 'À 30j', 'Retard', 'PTI déf.'].map((h) => (
                      <th key={h} className='px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
                  {epiReports.map((r) => (
                    <tr key={r.id}>
                      <td className='px-4 py-3 font-medium'>{r.period}</td>
                      <td className='px-4 py-3 font-semibold'>{r.totalStock}</td>
                      <td className='px-4 py-3'>{r.epiEnService}</td>
                      <td className='px-4 py-3'>{r.epiEnStockage}</td>
                      <td className='px-4 py-3'>{r.epiEnReparation}</td>
                      <td className='px-4 py-3 text-green-600'>{r.controlesConformes}</td>
                      <td className='px-4 py-3 text-amber-600'>{r.controlesA30j}</td>
                      <td className='px-4 py-3 text-red-600'>{r.controlesRetard}</td>
                      <td className='px-4 py-3 text-red-700'>{r.ptiDefectueux}</td>
                    </tr>
                  ))}
                  {epiReports.length === 0 && !epiLoading && (
                    <tr>
                      <td colSpan={9} className='px-4 py-8 text-center text-gray-400'>
                        Aucun rapport EPI enregistré
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <CreateSstMonthlyModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        onSave={handleCreateMonthly}
        isLoading={createMonthly.isPending}
      />

      <CreateSstEpiModal
        isOpen={isEpiModalOpen}
        onClose={() => setIsEpiModalOpen(false)}
        onSave={handleCreateEpi}
        isLoading={createEpi.isPending}
      />
    </div>
  );
}
