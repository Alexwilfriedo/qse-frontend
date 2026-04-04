import dagre from '@dagrejs/dagre';
import { MarkerType, type Edge, type Node } from '@xyflow/react';
import { useMemo } from 'react';
import type { ProcessMapView } from '../../processTypes';
import type { ProcessMapNodeData } from './ProcessMapNode';

const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;
const LANE_GAP = 60;
const LANE_HEADER_HEIGHT = 50;

interface LayoutCallbacks {
  onProcessClick: (id: string) => void;
}

interface SwimLane {
  label: string;
  color: string;
  y: number;
  height: number;
}

function buildNodesAndEdges(
  map: ProcessMapView,
  callbacks: LayoutCallbacks,
): { nodes: Node[]; edges: Edge[]; lanes: SwimLane[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const allProcesses = [
    ...map.management.map((p) => ({ ...p, _lane: 'MANAGEMENT' as const })),
    ...map.realisation.map((p) => ({ ...p, _lane: 'REALISATION' as const })),
    ...map.support.map((p) => ({ ...p, _lane: 'SUPPORT' as const })),
  ];

  for (const process of allProcesses) {
    const data: ProcessMapNodeData = {
      process,
      onProcessClick: callbacks.onProcessClick,
    };

    nodes.push({
      id: process.id,
      type: 'processMap',
      position: { x: 0, y: 0 },
      data: data as unknown as Record<string, unknown>,
    });
  }

  for (const link of map.links) {
    const interactionColor = '#ea580c';
    edges.push({
      id: link.id,
      source: link.sourceProcessId,
      target: link.targetProcessId,
      type: 'smoothstep',
      animated: true,
      label:
        link.linkType === 'FOURNISSEUR'
          ? 'Fournisseur'
          : link.linkType === 'CLIENT'
            ? 'Client'
            : 'Interaction',
      labelStyle: {
        fontSize: link.linkType === 'INTERACTION' ? 11 : 10,
        fill: link.linkType === 'INTERACTION' ? interactionColor : '#6b7280',
        fontWeight: link.linkType === 'INTERACTION' ? 700 : 500,
      },
      style: {
        stroke: link.linkType === 'INTERACTION' ? interactionColor : '#9ca3af',
        strokeWidth: link.linkType === 'INTERACTION' ? 3 : 1.5,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: link.linkType === 'INTERACTION' ? interactionColor : '#9ca3af',
        width: link.linkType === 'INTERACTION' ? 24 : 18,
        height: link.linkType === 'INTERACTION' ? 24 : 18,
      },
    });
  }

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'LR',
    nodesep: 50,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const laneGroups: Record<string, Node[]> = {
    MANAGEMENT: [],
    REALISATION: [],
    SUPPORT: [],
  };

  const layoutNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    const process = allProcesses.find((p) => p.id === node.id);
    const lane = process?._lane ?? 'REALISATION';

    const laid = {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };

    laneGroups[lane].push(laid);
    return laid;
  });

  const laneConfig: { key: string; label: string; color: string }[] = [
    { key: 'MANAGEMENT', label: 'Management', color: 'rgba(59,130,246,0.06)' },
    { key: 'REALISATION', label: 'Réalisation', color: 'rgba(34,197,94,0.06)' },
    { key: 'SUPPORT', label: 'Support', color: 'rgba(168,85,247,0.06)' },
  ];

  let currentY = 0;
  const lanes: SwimLane[] = [];

  for (const cfg of laneConfig) {
    const laneNodes = laneGroups[cfg.key];
    if (laneNodes.length === 0) {
      const laneHeight = NODE_HEIGHT + LANE_GAP;
      lanes.push({
        label: cfg.label,
        color: cfg.color,
        y: currentY,
        height: laneHeight + LANE_HEADER_HEIGHT,
      });
      currentY += laneHeight + LANE_HEADER_HEIGHT + 20;
      continue;
    }

    const minY = Math.min(...laneNodes.map((n) => n.position.y));
    const maxY = Math.max(...laneNodes.map((n) => n.position.y + NODE_HEIGHT));
    const laneHeight = maxY - minY + LANE_GAP;

    const yOffset = currentY + LANE_HEADER_HEIGHT - minY + LANE_GAP / 2;
    for (const n of laneNodes) {
      const target = layoutNodes.find((ln) => ln.id === n.id);
      if (target) {
        target.position.y += yOffset;
      }
    }

    lanes.push({
      label: cfg.label,
      color: cfg.color,
      y: currentY,
      height: laneHeight + LANE_HEADER_HEIGHT + LANE_GAP,
    });

    currentY += laneHeight + LANE_HEADER_HEIGHT + LANE_GAP + 20;
  }

  const laneBoundsMap: Record<string, { y: number; height: number }> = {};
  for (let i = 0; i < laneConfig.length; i++) {
    laneBoundsMap[laneConfig[i].key] = {
      y: lanes[i].y,
      height: lanes[i].height,
    };
  }

  for (const node of layoutNodes) {
    const process = allProcesses.find((p) => p.id === node.id);
    const laneKey = process?._lane ?? 'REALISATION';
    const bounds = laneBoundsMap[laneKey];
    if (bounds) {
      node.extent = [
        [-10000, bounds.y + LANE_HEADER_HEIGHT],
        [10000, bounds.y + bounds.height - NODE_HEIGHT],
      ];
    }
  }

  return { nodes: layoutNodes, edges, lanes };
}

export function useProcessMapLayout(
  map: ProcessMapView | undefined,
  callbacks: LayoutCallbacks,
) {
  return useMemo(() => {
    if (!map) return { nodes: [], edges: [], lanes: [] };

    const total =
      map.management.length + map.realisation.length + map.support.length;
    if (total === 0) return { nodes: [], edges: [], lanes: [] };

    return buildNodesAndEdges(map, callbacks);
  }, [map, callbacks]);
}
