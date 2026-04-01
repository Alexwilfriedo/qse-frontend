import { Badge, Button } from '@/components/ui';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  GripVertical,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useEntityTypeOptions } from '../hooks';
import type { EntityTreeNode } from '../types';

interface EntityTreeItemProps {
  node: EntityTreeNode;
  level: number;
  onEdit: (node: EntityTreeNode) => void;
  onDelete: (node: EntityTreeNode) => void;
  onAddChild: (parentNode: EntityTreeNode) => void;
  onAssignResponsables: (node: EntityTreeNode) => void;
  onReparent?: (childId: string, newParentId: string) => void;
}

export function EntityTreeItem({
  node,
  level,
  onEdit,
  onDelete,
  onAddChild,
  onAssignResponsables,
  onReparent,
}: EntityTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [dragOver, setDragOver] = useState(false);
  const hasChildren = node.children.length > 0;
  const { getLabel } = useEntityTypeOptions();
  const typeLabel = getLabel(node.type);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/x-entity-id', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.types.includes('application/x-entity-id');
    if (draggedId) {
      e.dataTransfer.dropEffect = 'move';
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (rowRef.current && !rowRef.current.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const childId = e.dataTransfer.getData('application/x-entity-id');
    if (childId && childId !== node.id && onReparent) {
      onReparent(childId, node.id);
    }
  };

  return (
    <div>
      <div
        ref={rowRef}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg group transition-colors ${
          dragOver
            ? 'bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/40'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        style={{ paddingLeft: `${level * 24 + 12}px` }}>
        <span className='cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 shrink-0'>
          <GripVertical className='w-4 h-4' />
        </span>

        <button
          type='button'
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-5 h-5 flex items-center justify-center text-gray-400 shrink-0'
          disabled={!hasChildren}>
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className='w-4 h-4' />
            ) : (
              <ChevronRight className='w-4 h-4' />
            )
          ) : (
            <span className='w-4' />
          )}
        </button>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='font-medium text-gray-900 dark:text-gray-100 truncate'>
              {node.nom}
            </span>
            {node.nomCourt && (
              <span className='text-sm text-gray-500'>({node.nomCourt})</span>
            )}
            <Badge variant='default' className='text-xs'>
              {typeLabel}
            </Badge>
            {node.responsableIds.length > 0 && (
              <Badge variant='info' className='text-xs'>
                {node.responsableIds.length} resp.
              </Badge>
            )}
          </div>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onAddChild(node)}
            title='Ajouter un enfant'>
            <Plus className='w-3.5 h-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onAssignResponsables(node)}
            title='Responsables'>
            <Users className='w-3.5 h-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(node)}
            title='Modifier'>
            <Edit2 className='w-3.5 h-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(node)}
            title='Supprimer'>
            <Trash2 className='w-3.5 h-3.5 text-red-500' />
          </Button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <EntityTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onAssignResponsables={onAssignResponsables}
              onReparent={onReparent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
