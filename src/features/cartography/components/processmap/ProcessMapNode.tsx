import { Badge } from '@/components/ui';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Star } from 'lucide-react';
import type { ProcessView } from '../../processTypes';
import { PROCESS_STATUTS, PROCESS_TYPES } from '../../processTypes';

export interface ProcessMapNodeData extends Record<string, unknown> {
  process: ProcessView;
  onProcessClick: (id: string) => void;
}

const TYPE_BORDER: Record<string, string> = {
  MANAGEMENT: 'border-t-blue-500',
  REALISATION: 'border-t-green-500',
  SUPPORT: 'border-t-purple-500',
};

export function ProcessMapNode({ data }: NodeProps) {
  const nodeData = data as unknown as ProcessMapNodeData;
  const { process, onProcessClick } = nodeData;
  const typeInfo = PROCESS_TYPES.find((t) => t.value === process.type);
  const statutInfo = PROCESS_STATUTS.find((s) => s.value === process.statut);
  const borderColor = TYPE_BORDER[process.type] ?? 'border-t-gray-400';

  return (
    <div
      onClick={() => onProcessClick(process.id)}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-theme-sm w-[220px] border-t-4 ${borderColor} cursor-pointer hover:shadow-theme-md transition-shadow`}>
      <Handle
        type='target'
        position={Position.Left}
        className='!w-2 !h-2 !bg-gray-400'
      />

      <div className='px-3 py-2.5'>
        <div className='flex items-center gap-1.5 mb-1.5'>
          <span className='font-semibold text-sm text-gray-900 dark:text-white truncate'>
            {process.nom}
          </span>
          {process.processusCle && (
            <Star className='w-3 h-3 text-amber-500 fill-amber-500 shrink-0' />
          )}
        </div>
        <div className='flex items-center gap-1 text-xs text-gray-500 font-mono mb-2'>
          {process.codification}
        </div>
        <div className='flex items-center gap-1.5 flex-wrap'>
          <Badge
            variant='default'
            className={`text-[10px] px-1.5 py-0 ${typeInfo?.color ?? ''}`}>
            {typeInfo?.label ?? process.type}
          </Badge>
          <Badge
            variant='default'
            className={`text-[10px] px-1.5 py-0 ${statutInfo?.color ?? ''}`}>
            {statutInfo?.label ?? process.statut}
          </Badge>
        </div>
      </div>

      <Handle
        type='source'
        position={Position.Right}
        className='!w-2 !h-2 !bg-gray-400'
      />
    </div>
  );
}
