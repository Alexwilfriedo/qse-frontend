import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type NodeTypes,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo } from 'react';
import type { EntityTreeNode } from '../../types';
import { OrgChartNode } from './OrgChartNode';
import { useOrgChartLayout } from './useOrgChartLayout';

const nodeTypes: NodeTypes = {
  orgChart: OrgChartNode,
};

interface OrgChartCanvasProps {
  tree: EntityTreeNode[];
  onEdit: (node: EntityTreeNode) => void;
  onDelete: (node: EntityTreeNode) => void;
  onAddChild: (node: EntityTreeNode) => void;
  onAssignResponsables: (node: EntityTreeNode) => void;
  onReparent: (childId: string, newParentId: string) => void;
}

export function OrgChartCanvas({
  tree,
  onEdit,
  onDelete,
  onAddChild,
  onAssignResponsables,
  onReparent,
}: OrgChartCanvasProps) {
  const callbacks = useMemo(
    () => ({ onEdit, onDelete, onAddChild, onAssignResponsables }),
    [onEdit, onDelete, onAddChild, onAssignResponsables],
  );

  const { nodes: layoutNodes, edges: layoutEdges } = useOrgChartLayout(
    tree,
    callbacks,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      if (connection.source === connection.target) return;
      // source (bas du nœud) = nouveau parent, target (haut du nœud) = enfant déplacé
      onReparent(connection.target, connection.source);
    },
    [onReparent],
  );

  return (
    <div className='h-[600px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{ stroke: '#f97316', strokeWidth: 2 }}>
        <Background gap={20} size={1} color='#e5e7eb' />
        <Controls
          showInteractive={false}
          className='!bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700 !shadow-theme-sm'
        />
        <MiniMap
          nodeColor='#f97316'
          maskColor='rgba(0,0,0,0.08)'
          className='!bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700'
        />
      </ReactFlow>
    </div>
  );
}
