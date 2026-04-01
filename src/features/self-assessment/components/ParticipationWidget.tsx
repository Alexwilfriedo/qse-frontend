import { Progress } from '@/components/ui';

interface ParticipationWidgetProps {
  tauxParticipation: number;
  reponsesRecues: number;
  totalReponses: number;
}

export function ParticipationWidget({
  tauxParticipation,
  reponsesRecues,
  totalReponses,
}: ParticipationWidgetProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">
          {tauxParticipation}%
        </span>
        <span className="text-sm text-gray-500">
          {reponsesRecues} / {totalReponses} réponses
        </span>
      </div>
      <Progress value={tauxParticipation} />
      <p className="text-xs text-gray-400">
        Taux de réponses soumises ou validées
      </p>
    </div>
  );
}
