import {
  Button,
  Card,
  CardHeader,
  PageHeader,
  SkeletonText,
} from '@/components/ui';
import {
  AssignResponsablesModal,
  CreateEntityModal,
  DeleteEntityModal,
  EditEntityModal,
  EntityTreeItem,
  OrgChartCanvas,
} from '@/features/cartography/components';
import { useEntityTree, useUpdateEntity } from '@/features/cartography/hooks';
import type { EntityTreeNode } from '@/features/cartography/types';
import { showToast } from '@/lib/toast';
import { List, Network, Plus, Share2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type ViewMode = 'graph' | 'list';
const ORGANIGRAMME_VISIBLE_TYPES = new Set(['DIRECTION', 'DEPARTEMENT', 'SERVICE']);

export default function OrganigrammePage() {
  const { data: tree, isLoading } = useEntityTree();
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [parentNode, setParentNode] = useState<EntityTreeNode | null>(null);
  const [deleteNode, setDeleteNode] = useState<EntityTreeNode | null>(null);
  const [editNode, setEditNode] = useState<EntityTreeNode | null>(null);
  const [responsablesNode, setResponsablesNode] =
    useState<EntityTreeNode | null>(null);

  const handleAddChild = useCallback((parent: EntityTreeNode) => {
    setParentNode(parent);
    setIsCreateOpen(true);
  }, []);

  const handleAddRoot = useCallback(() => {
    setParentNode(null);
    setIsCreateOpen(true);
  }, []);

  const handleEdit = useCallback((node: EntityTreeNode) => {
    setEditNode(node);
  }, []);

  const updateEntity = useUpdateEntity();

  const visibleTree = useMemo(
    () => filterVisibleOrganigrammeTree(tree ?? []),
    [tree],
  );
  const selectedType = searchParams.get('type');
  const filteredEntities = useMemo(
    () =>
      selectedType
        ? flattenEntities(visibleTree).filter((node) => node.type === selectedType)
        : [],
    [selectedType, visibleTree],
  );

  const handleReparent = useCallback(
    (childId: string, newParentId: string) => {
      const child = findNode(tree ?? [], childId);
      if (!child) return;

      // Empêcher de rattacher un nœud à un de ses propres descendants
      if (isDescendant(child, newParentId)) {
        showToast.error('Impossible : le nœud cible est un descendant');
        return;
      }

      updateEntity.mutate({
        id: childId,
        data: {
          nom: child.nom,
          nomCourt: child.nomCourt ?? undefined,
          type: child.type,
          description: child.description ?? undefined,
          parentId: newParentId,
        },
      });
    },
    [tree, updateEntity],
  );

  const isEmpty = !isLoading && visibleTree.length === 0;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Organigramme'
        description="Structure organisationnelle de l'entreprise"
        actions={
          <div className='flex items-center gap-2'>
            <div className='flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-0.5'>
              <button
                type='button'
                onClick={() => {
                  setViewMode('graph');
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete('type');
                    return next;
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'graph'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <Share2 className='w-3.5 h-3.5' />
                Graphique
              </button>
              <button
                type='button'
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <List className='w-3.5 h-3.5' />
                Liste
              </button>
            </div>
            <Button onClick={handleAddRoot}>
              <Plus className='w-4 h-4 mr-2' />
              Nouvelle entité
            </Button>
          </div>
        }
      />

      {!isLoading &&
        visibleTree.length > 0 &&
        (() => {
          const counts = countByType(visibleTree);
          return (
            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
              {ENTITY_TYPE_STATS.map(({ type, label, color }) => (
                <button
                  key={type}
                  type='button'
                  onClick={() => {
                    setViewMode('list');
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('type', type);
                      return next;
                    });
                  }}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all hover:-translate-y-0.5 hover:shadow-theme-sm ${
                    selectedType === type
                      ? 'border-brand-400 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/30'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                  }`}>
                  <div className={`p-1.5 rounded-lg ${color}`}>
                    <Network className='w-4 h-4' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                      {label}
                    </p>
                    <p className='text-lg font-bold text-gray-900 dark:text-white'>
                      {counts[type] ?? 0}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          );
        })()}

      {isLoading && (
        <Card>
          <div className='p-6 space-y-3'>
            <SkeletonText lines={5} />
          </div>
        </Card>
      )}

      {isEmpty && (
        <Card>
          <div className='p-12 text-center'>
            <Network className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
              Aucune entité
            </h3>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              Commencez par créer la structure organisationnelle de votre
              entreprise.
            </p>
            <Button className='mt-4' onClick={handleAddRoot}>
              <Plus className='w-4 h-4 mr-2' />
              Créer la première entité
            </Button>
          </div>
        </Card>
      )}

      {visibleTree.length > 0 && viewMode === 'graph' && (
        <OrgChartCanvas
          tree={visibleTree}
          onEdit={handleEdit}
          onDelete={setDeleteNode}
          onAddChild={handleAddChild}
          onAssignResponsables={setResponsablesNode}
          onReparent={handleReparent}
        />
      )}

      {visibleTree.length > 0 && viewMode === 'list' && (
        <Card>
          <CardHeader
            title={
              selectedType
                ? `Liste des ${getEntityTypeLabel(selectedType)}`
                : 'Arbre organisationnel'
            }
            description={
              selectedType
                ? 'Vue filtrée selon le type sélectionné dans les cartes de synthèse.'
                : undefined
            }
            action={
              selectedType ? (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete('type');
                      return next;
                    })
                  }>
                  Voir tout
                </Button>
              ) : undefined
            }
          />
          {selectedType ? (
            <div className='space-y-3'>
              {filteredEntities.map((node) => (
                <div
                  key={node.id}
                  className='flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40'>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {node.nom}
                    </p>
                    {node.nomCourt && (
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {node.nomCourt}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' onClick={() => handleEdit(node)}>
                      Modifier
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setResponsablesNode(node)}>
                      Responsables
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-2'>
              {visibleTree.map((node) => (
                <EntityTreeItem
                  key={node.id}
                  node={node}
                  level={0}
                  onEdit={handleEdit}
                  onDelete={setDeleteNode}
                  onAddChild={handleAddChild}
                  onAssignResponsables={setResponsablesNode}
                  onReparent={handleReparent}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      <CreateEntityModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setParentNode(null);
        }}
        parentNode={parentNode}
      />
      <EditEntityModal
        isOpen={!!editNode}
        onClose={() => setEditNode(null)}
        entity={editNode}
      />
      <DeleteEntityModal
        isOpen={!!deleteNode}
        onClose={() => setDeleteNode(null)}
        entity={deleteNode}
      />
      <AssignResponsablesModal
        isOpen={!!responsablesNode}
        onClose={() => setResponsablesNode(null)}
        entity={responsablesNode}
      />
    </div>
  );
}

const ENTITY_TYPE_STATS = [
  {
    type: 'DIRECTION',
    label: 'Directions',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    type: 'DEPARTEMENT',
    label: 'Départements',
    color:
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  },
  {
    type: 'SERVICE',
    label: 'Services',
    color: 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300',
  },
];

function filterVisibleOrganigrammeTree(nodes: EntityTreeNode[]): EntityTreeNode[] {
  const filtered: EntityTreeNode[] = [];

  for (const node of nodes) {
    const visibleChildren = filterVisibleOrganigrammeTree(node.children);

    if (ORGANIGRAMME_VISIBLE_TYPES.has(node.type)) {
      filtered.push({
        ...node,
        children: visibleChildren,
      });
      continue;
    }

    filtered.push(...visibleChildren);
  }

  return filtered;
}

function findNode(
  nodes: EntityTreeNode[],
  id: string,
): EntityTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

function isDescendant(parent: EntityTreeNode, targetId: string): boolean {
  for (const child of parent.children) {
    if (child.id === targetId) return true;
    if (isDescendant(child, targetId)) return true;
  }
  return false;
}

function countByType(
  nodes: { type: string; children: { type: string; children: unknown[] }[] }[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  function walk(node: { type: string; children: unknown[] }) {
    counts[node.type] = (counts[node.type] ?? 0) + 1;
    (node.children as typeof nodes).forEach(walk);
  }
  nodes.forEach(walk);
  return counts;
}

function flattenEntities(nodes: EntityTreeNode[]): EntityTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenEntities(node.children)]);
}

function getEntityTypeLabel(type: string): string {
  return (
    ENTITY_TYPE_STATS.find((item) => item.type === type)?.label ?? type
  );
}
