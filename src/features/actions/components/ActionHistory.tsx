import { useActionHistory } from '../hooks/useActions';
import type { ActionHistoryEntry } from '../types';

interface ActionHistoryProps {
  actionId: string;
}

const EVENT_TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  ACTION_CREATED: { icon: '✨', label: 'Création', color: 'text-green-600' },
  ACTION_UPDATED: { icon: '✏️', label: 'Modification', color: 'text-blue-600' },
  ACTION_PROGRESS_UPDATED: { icon: '📊', label: 'Avancement', color: 'text-purple-600' },
  ACTION_COMPLETED: { icon: '🏁', label: 'Terminée', color: 'text-blue-700' },
  ACTION_VALIDATED: { icon: '✅', label: 'Validée', color: 'text-green-700' },
  ACTION_REJECTED: { icon: '❌', label: 'Refusée', color: 'text-red-600' },
  ACTION_REOPENED: { icon: '🔄', label: 'Réouverte', color: 'text-orange-600' },
  ACTION_REASSIGNED: { icon: '👤', label: 'Réassignée', color: 'text-indigo-600' },
  ACTION_ECHEANCE_MODIFIED: { icon: '📅', label: 'Échéance modifiée', color: 'text-amber-600' },
  ACTION_DELETED: { icon: '🗑️', label: 'Supprimée', color: 'text-gray-600' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function HistoryEntry({ entry }: { entry: ActionHistoryEntry }) {
  const config = EVENT_TYPE_CONFIG[entry.eventType] ?? {
    icon: '📝',
    label: entry.eventType,
    color: 'text-gray-600',
  };

  return (
    <div className="flex gap-4 pb-6 relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      {/* Icon */}
      <div className="relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full text-sm">
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium ${config.color}`}>{config.label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(entry.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          par <span className="font-medium">{entry.createdByNom}</span>
        </p>

        {entry.comment && (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded p-2 italic">
            "{entry.comment}"
          </p>
        )}

        {entry.oldValue && entry.newValue && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>
              <span className="text-red-500 line-through">{entry.oldValue}</span>
            </div>
            <div>
              <span className="text-green-500">→ {entry.newValue}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActionHistory({ actionId }: ActionHistoryProps) {
  const { data, isLoading, error } = useActionHistory(actionId);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Chargement de l'historique...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erreur lors du chargement de l'historique
      </div>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Aucun historique disponible
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Historique
      </h3>
      <div className="space-y-0">
        {data.entries.map((entry) => (
          <HistoryEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
