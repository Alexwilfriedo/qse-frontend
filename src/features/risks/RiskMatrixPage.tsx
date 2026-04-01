import { Button, PageHeader } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CriticalityMatrix from './components/CriticalityMatrix';
import RiskStatsCards from './components/RiskStatsCards';
import { useRiskMatrix, useRiskStatistics } from './hooks/useRisks';

export default function RiskMatrixPage() {
  const navigate = useNavigate();
  const { data: matrix, isLoading: matrixLoading } = useRiskMatrix();
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
      <CriticalityMatrix data={matrix} isLoading={matrixLoading} />
    </div>
  );
}
