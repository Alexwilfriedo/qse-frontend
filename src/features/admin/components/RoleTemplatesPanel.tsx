import { Badge, Button, Card, CardHeader } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ShieldCheck } from 'lucide-react';
import { adminApi, type Permission } from '../adminApi';

interface RoleTemplate {
  name: string;
  description: string;
  domain: 'qualite' | 'securite' | 'environnement' | 'transverse';
  permissionCodes: string[];
}

const QSE_TEMPLATES: RoleTemplate[] = [
  {
    name: 'Responsable Qualité',
    description:
      'Gestion complète du SMQ : documents, processus, actions qualité',
    domain: 'qualite',
    permissionCodes: [
      'documents:read',
      'documents:write',
      'documents:approve',
      'process:read',
      'process:write',
      'actions:read',
      'actions:write',
      'risks:read',
      'risks:write',
      'config:read',
    ],
  },
  {
    name: 'Responsable Sécurité',
    description: 'Gestion SST : risques professionnels, incidents, DUERP',
    domain: 'securite',
    permissionCodes: [
      'risks:read',
      'risks:write',
      'incidents:read',
      'incidents:write',
      'actions:read',
      'actions:write',
      'documents:read',
      'config:read',
    ],
  },
  {
    name: 'Responsable Environnement',
    description:
      'Gestion environnementale : aspects, impacts, analyse environnementale',
    domain: 'environnement',
    permissionCodes: [
      'risks:read',
      'risks:write',
      'incidents:read',
      'incidents:write',
      'actions:read',
      'actions:write',
      'documents:read',
      'config:read',
    ],
  },
  {
    name: 'Pilote de Processus',
    description: 'Pilotage de processus, indicateurs, revue',
    domain: 'transverse',
    permissionCodes: [
      'process:read',
      'process:write',
      'documents:read',
      'actions:read',
      'actions:write',
      'risks:read',
    ],
  },
  {
    name: 'Auditeur Interne',
    description: 'Consultation tous modules, gestion des non-conformités',
    domain: 'transverse',
    permissionCodes: [
      'documents:read',
      'process:read',
      'actions:read',
      'actions:write',
      'risks:read',
      'incidents:read',
    ],
  },
  {
    name: 'Collaborateur',
    description: 'Accès en lecture, déclaration incidents',
    domain: 'transverse',
    permissionCodes: [
      'documents:read',
      'process:read',
      'actions:read',
      'risks:read',
      'incidents:read',
      'incidents:write',
    ],
  },
];

const DOMAIN_STYLES: Record<string, { badge: string; label: string }> = {
  qualite: { badge: 'badge-qualite', label: 'Qualité' },
  securite: { badge: 'badge-securite', label: 'Sécurité' },
  environnement: { badge: 'badge-environnement', label: 'Environnement' },
  transverse: { badge: 'badge-info', label: 'Transverse' },
};

export function RoleTemplatesPanel() {
  const queryClient = useQueryClient();

  const { data: permissions } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: adminApi.getPermissions,
  });

  const { data: roles } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: adminApi.getRoles,
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      showToast.success('Rôle créé depuis le template');
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const resolvePermissionIds = (codes: string[]): string[] => {
    if (!permissions) return [];
    return permissions
      .filter((p: Permission) => codes.includes(p.code))
      .map((p: Permission) => p.id);
  };

  const roleExists = (name: string): boolean => {
    return (
      roles?.some((r) => r.name.toLowerCase() === name.toLowerCase()) ?? false
    );
  };

  const handleCreate = (template: RoleTemplate) => {
    const permissionIds = resolvePermissionIds(template.permissionCodes);
    createMutation.mutate({
      name: template.name,
      description: template.description,
      permissionIds,
    });
  };

  return (
    <Card>
      <CardHeader
        title='Templates QSE'
        description='Créez rapidement des rôles pré-configurés pour votre organisation QSE'
      />
      <div className='p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {QSE_TEMPLATES.map((template) => {
          const exists = roleExists(template.name);
          const style = DOMAIN_STYLES[template.domain];
          return (
            <div
              key={template.name}
              className='rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col'>
              <div className='flex items-start justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck className='w-5 h-5 text-brand-500' />
                  <h4 className='font-medium text-gray-900 dark:text-white text-sm'>
                    {template.name}
                  </h4>
                </div>
                <span className={style.badge}>{style.label}</span>
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400 mb-3 flex-1'>
                {template.description}
              </p>
              <div className='flex flex-wrap gap-1 mb-3'>
                {template.permissionCodes.slice(0, 4).map((code) => (
                  <Badge key={code} variant='default'>
                    {code}
                  </Badge>
                ))}
                {template.permissionCodes.length > 4 && (
                  <Badge variant='default'>
                    +{template.permissionCodes.length - 4}
                  </Badge>
                )}
              </div>
              <Button
                size='sm'
                variant={exists ? 'ghost' : 'primary'}
                disabled={exists || createMutation.isPending}
                onClick={() => handleCreate(template)}>
                {exists ? (
                  'Déjà créé'
                ) : (
                  <>
                    <Copy className='w-3.5 h-3.5 mr-1' />
                    Créer ce rôle
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
