import { Badge } from '@/components/ui';
import { useEntityTypeOptions } from '../../hooks';
import type { EntityTreeNode } from '../../types';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Edit2, Plus, Trash2, Users } from 'lucide-react';

export interface OrgChartNodeData extends Record<string, unknown> {
  entity: EntityTreeNode;
  onEdit: (node: EntityTreeNode) => void;
  onDelete: (node: EntityTreeNode) => void;
  onAddChild: (node: EntityTreeNode) => void;
  onAssignResponsables: (node: EntityTreeNode) => void;
}

const TYPE_COLORS: Record<string, string> = {
  DIRECTION: 'border-l-blue-500',
  SERVICE: 'border-l-brand-500',
  DEPARTEMENT: 'border-l-purple-500',
  SITE: 'border-l-green-500',
  UNITE: 'border-l-amber-500',
};

export function OrgChartNode({ data }: NodeProps) {
  const nodeData = data as unknown as OrgChartNodeData;
  const { entity, onEdit, onDelete, onAddChild, onAssignResponsables } = nodeData;
  const { getLabel } = useEntityTypeOptions();
  const typeLabel = getLabel(entity.type);
  const borderColor = TYPE_COLORS[entity.type] ?? 'border-l-gray-400';

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-theme-sm min-w-[180px] max-w-[260px] border-l-4 ${borderColor}`}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-400" />

      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {entity.nom}
          </span>
          {entity.nomCourt && (
            <span className="text-xs text-gray-400">({entity.nomCourt})</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="default" className="text-[10px] px-1.5 py-0">
            {typeLabel}
          </Badge>
          {entity.responsableIds.length > 0 && (
            <Badge variant="info" className="text-[10px] px-1.5 py-0">
              {entity.responsableIds.length} resp.
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-0.5 border-t border-gray-100 dark:border-gray-800 px-2 py-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAddChild(entity); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
          title="Ajouter un enfant"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAssignResponsables(entity); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
          title="Responsables"
        >
          <Users className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(entity); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
          title="Modifier"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(entity); }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-300 hover:text-red-500"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-400" />
    </div>
  );
}
