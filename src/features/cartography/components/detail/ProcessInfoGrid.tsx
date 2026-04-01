import { Avatar, getInitials } from '@/components/ui';
import { useUserName, useUsers } from '@/features/admin/hooks/useUsers';
import {
  Building2,
  Calendar,
  Hash,
  Shield,
  User,
  UserCheck,
} from 'lucide-react';
import { useEntityTree } from '../../hooks';
import type { ProcessView } from '../../processTypes';
import type { EntityTreeNode } from '../../types';

interface Props {
  process: ProcessView;
}

function flattenTree(nodes: EntityTreeNode[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const n of nodes) {
    map.set(n.id, n.nom);
    for (const [k, v] of flattenTree(n.children)) {
      map.set(k, v);
    }
  }
  return map;
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function PersonCard({
  label,
  userId,
  icon: Icon,
}: {
  label: string;
  userId: string | null;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { data: users } = useUsers();
  const name = useUserName(userId);
  const user = users?.find((u) => u.id === userId);
  const initials = user ? getInitials(user.firstName, user.lastName) : '?';

  return (
    <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50'>
      <Avatar initials={initials} size='sm' />
      <div className='min-w-0'>
        <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
          <Icon className='w-3 h-3' />
          {label}
        </p>
        <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
          {name}
        </p>
      </div>
    </div>
  );
}

function MetaItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (!value) return null;
  return (
    <div className='flex items-start gap-2.5'>
      <Icon className='w-4 h-4 text-gray-400 mt-0.5 shrink-0' />
      <div>
        <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
        <p className='text-sm font-medium text-gray-900 dark:text-white'>
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProcessInfoGrid({ process }: Props) {
  const { data: entityTree } = useEntityTree();
  const createdByName = useUserName(process.createdBy);

  const entityMap = entityTree ? flattenTree(entityTree) : new Map();
  const entityName = process.entityId
    ? (entityMap.get(process.entityId) ?? null)
    : null;

  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-theme-sm'>
      <div className='p-6'>
        <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4'>
          Informations générales
        </h3>

        {/* Personnes */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6'>
          <PersonCard
            label='Pilote du processus'
            userId={process.piloteId}
            icon={UserCheck}
          />
          <PersonCard label='Manager' userId={process.managerId} icon={User} />
        </div>

        {/* Métadonnées */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
          <MetaItem
            label='Entité organisationnelle'
            value={entityName}
            icon={Building2}
          />
          <MetaItem
            label='Codification'
            value={process.codification}
            icon={Hash}
          />
          <MetaItem
            label='Version'
            value={`v${process.versionNumber}`}
            icon={Shield}
          />
          <MetaItem
            label='Date de validité'
            value={formatDate(process.dateValidite)}
            icon={Calendar}
          />
          <MetaItem
            label='Date de création'
            value={formatDate(process.createdAt)}
            icon={Calendar}
          />
          <MetaItem
            label='Dernière modification'
            value={formatDate(process.updatedAt)}
            icon={Calendar}
          />
          <MetaItem
            label='Créé par'
            value={createdByName !== '—' ? createdByName : null}
            icon={User}
          />
        </div>
      </div>
    </div>
  );
}
