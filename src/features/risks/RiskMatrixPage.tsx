import { Button, PageHeader } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CriticalityMatrix from './components/CriticalityMatrix';
import RiskStatsCards from './components/RiskStatsCards';
import {
  useRiskComparisonMatrix,
  useRiskStatistics,
} from './hooks/useRisks';

type MatrixTab = 'brute' | 'residual';

export default function RiskMatrixPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MatrixTab>('brute');
  const { data: comparisonMatrix, isLoading: matrixLoading } =
    useRiskComparisonMatrix();
  const { data: stats, isLoading: statsLoading } = useRiskStatistics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matrice de Criticité"
        description="Évaluation et hiérarchisation des risques QSE"
        actions={
          <Button variant="secondary" onClick={() => navigate('/risks')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Liste des risques
          </Button>
        }
      />

      <RiskStatsCards data={stats} isLoading={statsLoading} />

      <div className='rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900'>
        <div className='flex flex-wrap gap-2 border-b border-gray-200 px-2 pb-3 pt-1 dark:border-gray-800'>
          {[
            { key: 'brute' as const, label: 'Matrice brute' },
            { key: 'residual' as const, label: 'Matrice résiduelle' },
          ].map((tab) => (
            <button
              key={tab.key}
              type='button'
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className='pt-4'>
          {activeTab === 'brute' && (
            <CriticalityMatrix
              data={comparisonMatrix?.bruteMatrix}
              isLoading={matrixLoading}
              title='Matrice des risques bruts'
            />
          )}

          {activeTab === 'residual' && (
            <CriticalityMatrix
              data={comparisonMatrix?.residualMatrix}
              isLoading={matrixLoading}
              title='Matrice des risques résiduels'
              clickable={false}
              footerHint='Matrice mise à jour après réévaluation des risques'
            />
          )}
        </div>
      </div>
    </div>
  );
}
