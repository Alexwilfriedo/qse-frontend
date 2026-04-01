import { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import type { EntityTreeNode } from '../../types';
import type { OrgChartNodeData } from './OrgChartNode';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

interface LayoutCallbacks {
  onEdit: (node: EntityTreeNode) => void;
  onDelete: (node: EntityTreeNode) => void;
  onAddChild: (node: EntityTreeNode) => void;
  onAssignResponsables: (node: EntityTreeNode) => void;
}

function flattenTree(
  tree: EntityTreeNode[],
  callbacks: LayoutCallbacks,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function walk(node: EntityTreeNode) {
    const data: OrgChartNodeData = {
      entity: node,
      ...callbacks,
    };

    nodes.push({
      id: node.id,
      type: 'orgChart',
      position: { x: 0, y: 0 },
      data: data as unknown as Record<string, unknown>,
    });

    for (const child of node.children) {
      edges.push({
        id: `${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
        type: 'smoothstep',
        style: { stroke: '#9ca3af', strokeWidth: 1.5 },
      });
      walk(child);
    }
  }

  for (const root of tree) {
    walk(root);
  }

  return { nodes, edges };
}

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    nodesep: 40,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

export function useOrgChartLayout(
  tree: EntityTreeNode[] | undefined,
  callbacks: LayoutCallbacks,
) {
  return useMemo(() => {
    if (!tree || tree.length === 0) return { nodes: [], edges: [] };

    const { nodes, edges } = flattenTree(tree, callbacks);
    const layoutNodes = applyDagreLayout(nodes, edges);

    return { nodes: layoutNodes, edges };
  }, [tree, callbacks]);
}
