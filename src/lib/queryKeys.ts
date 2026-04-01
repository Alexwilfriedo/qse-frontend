/**
 * Clés de cache centralisées pour React Query.
 */
export const queryKeys = {
  // Auth
  user: ['user'] as const,
  userMe: ['user', 'me'] as const,

  // Admin - Users
  adminUsers: ['admin', 'users'] as const,
  adminUser: (id: string) => ['admin', 'users', id] as const,

  // Admin - Roles
  adminRoles: ['admin', 'roles'] as const,
  adminRole: (id: string) => ['admin', 'roles', id] as const,

  // Admin - Permissions
  adminPermissions: ['admin', 'permissions'] as const,
  adminPermissionsByCategory: (category: string) =>
    ['admin', 'permissions', 'category', category] as const,

  // Audits - Campaigns
  auditCampaigns: (annee?: number) =>
    annee ? ['audits', 'campaigns', annee] as const : ['audits', 'campaigns'] as const,
  auditCampaign: (id: string) => ['audits', 'campaigns', id] as const,
  auditDashboard: (annee: number) => ['audits', 'dashboard', annee] as const,

  // Audits
  campaignAudits: (campaignId: string) => ['audits', 'campaigns', campaignId, 'audits'] as const,
  auditCalendar: (mois: number, annee: number) => ['audits', 'calendar', annee, mois] as const,
} as const;
