import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type NodeTypes,
} from '@xyflow/react';
import { useEffect, useMemo } from 'react';
import type { ProcessMapView } from '../../processTypes';
import { ProcessMapNode } from './ProcessMapNode';
import { useProcessMapLayout } from './useProcessMapLayout';

const nodeTypes: NodeTypes = {
  processMap: ProcessMapNode,
};

interface ProcessMapCanvasProps {
  map: ProcessMapView;
  onProcessClick: (id: string) => void;
}

export function ProcessMapCanvas({
  map,
  onProcessClick,
}: ProcessMapCanvasProps) {
  const callbacks = useMemo(() => ({ onProcessClick }), [onProcessClick]);

  const {
    nodes: layoutNodes,
    edges: layoutEdges,
    lanes,
  } = useProcessMapLayout(map, callbacks);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const LANE_COLORS: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    Management: {
      bg: 'rgba(59,130,246,0.05)',
      text: '#3b82f6',
      border: 'rgba(59,130,246,0.15)',
    },
    Réalisation: {
      bg: 'rgba(34,197,94,0.05)',
      text: '#22c55e',
      border: 'rgba(34,197,94,0.15)',
    },
    Support: {
      bg: 'rgba(168,85,247,0.05)',
      text: '#a855f7',
      border: 'rgba(168,85,247,0.15)',
    },
  };

  const contextBlockStyle =
    'rounded-xl px-3 py-4 text-center text-[11px] font-semibold leading-tight text-white shadow-theme-sm';

  return (
    <div className='flex items-stretch gap-4 h-full w-full'>
      {/* Gauche : Contexte + Besoins — pleine hauteur, partagée en 2 */}
      <div className='flex flex-col gap-3 shrink-0 h-full'>
        <div
          className={`w-[110px] flex-1 flex items-center bg-gray-900 ${contextBlockStyle}`}>
          Contexte de l'entreprise
        </div>
        <div
          className={`w-[110px] flex-1 flex items-center bg-gray-900 ${contextBlockStyle}`}>
          Besoins et attentes des parties intéressées
        </div>
      </div>

      {/* Centre : Canvas ReactFlow avec lanes CSS */}
      <div className='flex-1 h-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative'>
        {/* Lane backgrounds — 3 bandes CSS égales, toujours visibles */}
        <div className='absolute inset-0 flex flex-col pointer-events-none z-0'>
          {lanes.map((lane, i) => {
            const colors = LANE_COLORS[lane.label] ?? {
              bg: 'rgba(107,114,128,0.05)',
              text: '#6b7280',
              border: 'rgba(107,114,128,0.15)',
            };
            return (
              <div
                key={lane.label}
                className='flex-1 relative'
                style={{
                  background: colors.bg,
                  borderBottom:
                    i < lanes.length - 1
                      ? `1px dashed ${colors.border}`
                      : undefined,
                }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: colors.text,
                    opacity: 0.8,
                  }}>
                  {lane.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ReactFlow — fond transparent pour laisser voir les lanes */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable
          panOnDrag
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 0.75 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className='!bg-transparent relative z-10'>
          <Background gap={20} size={1} color='rgba(229,231,235,0.4)' />
          <Controls
            showInteractive={false}
            className='!bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700 !shadow-theme-sm'
          />
          <MiniMap
            nodeColor={(node) => {
              const d = node.data as Record<string, unknown>;
              const process = d.process as { type?: string } | undefined;
              if (process?.type === 'MANAGEMENT') return '#3b82f6';
              if (process?.type === 'REALISATION') return '#22c55e';
              if (process?.type === 'SUPPORT') return '#a855f7';
              return '#9ca3af';
            }}
            maskColor='rgba(0,0,0,0.08)'
            className='!bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-700'
          />
        </ReactFlow>
      </div>

      {/* Droite : Satisfaction — pleine hauteur */}
      <div className='shrink-0 h-full'>
        <div
          className={`w-[110px] h-full flex items-center bg-gray-900 ${contextBlockStyle}`}>
          Satisfaction des parties intéressées
        </div>
      </div>
    </div>
  );
}
