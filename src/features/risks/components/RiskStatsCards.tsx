import { Card, SkeletonCard } from '@/components/ui';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { RiskStatistics } from '../types';

const LEVEL_ICONS: Record<string, React.ElementType> = {
  FAIBLE: ShieldCheck,
  MOYEN: Shield,
  ELEVE: ShieldAlert,
};

interface Props {
  data: RiskStatistics | undefined;
  isLoading: boolean;
}

export default function RiskStatsCards({ data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total risques"
        count={data.totalRisks}
        color="#6B7280"
        Icon={AlertTriangle}
      />
      {data.levels.map((lvl) => {
        const Icon = LEVEL_ICONS[lvl.level] ?? Shield;
        return (
          <StatCard
            key={lvl.level}
            label={lvl.label}
            count={lvl.count}
            color={lvl.color}
            Icon={Icon}
          />
        );
      })}
    </div>
  );
}

function StatCard({
  label,
  count,
  color,
  Icon,
}: {
  label: string;
  count: number;
  color: string;
  Icon: React.ElementType;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3 p-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: color + '20' }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}
