import { api } from '@/lib/api';

// ========== TYPES ==========

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  forcePasswordChange: boolean;
  isGuest: boolean;
  guestExpiresAt: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  roles: string[];
}

export interface CreateGuestRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
  expiresAt: string;
}

export interface PasswordPolicyConfig {
  id: string;
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecial: boolean;
  maxAgeDays: number | null;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ResetPasswordResponse {
  temporaryCode: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface AssignRolesRequest {
  roleIds: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds?: string[];
}

// ========== API ==========

export const adminApi = {
  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/api/v1/admin/users');
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/api/v1/admin/users', data);
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/api/v1/admin/users/${id}`);
    return response.data;
  },

  assignRoles: async (
    userId: string,
    data: AssignRolesRequest,
  ): Promise<User> => {
    const response = await api.put<User>(
      `/api/v1/admin/users/${userId}/roles`,
      data,
    );
    return response.data;
  },

  activateUser: async (userId: string, reason?: string): Promise<User> => {
    const response = await api.put<User>(
      `/api/v1/admin/users/${userId}/activate`,
      reason ? { reason } : undefined,
    );
    return response.data;
  },

  deactivateUser: async (userId: string, reason: string): Promise<User> => {
    const response = await api.put<User>(
      `/api/v1/admin/users/${userId}/deactivate`,
      { reason },
    );
    return response.data;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>('/api/v1/admin/roles');
    return response.data;
  },

  getRole: async (id: string): Promise<Role> => {
    const response = await api.get<Role>(`/api/v1/admin/roles/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await api.post<Role>('/api/v1/admin/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await api.put<Role>(`/api/v1/admin/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/roles/${id}`);
  },

  // Permissions
  getPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>('/api/v1/admin/permissions');
    return response.data;
  },

  getPermissionsByCategory: async (category: string): Promise<Permission[]> => {
    const response = await api.get<Permission[]>(
      `/api/v1/admin/permissions/category/${category}`,
    );
    return response.data;
  },

  // User update
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put<User>(`/api/v1/admin/users/${id}`, data);
    return response.data;
  },

  // Password reset
  resetPassword: async (userId: string): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(
      `/api/v1/admin/users/${userId}/reset-password`,
    );
    return response.data;
  },

  // Password policy
  getPasswordPolicy: async (): Promise<PasswordPolicyConfig> => {
    const response = await api.get<PasswordPolicyConfig>(
      '/api/v1/admin/users/password-policy',
    );
    return response.data;
  },

  updatePasswordPolicy: async (
    data: Omit<PasswordPolicyConfig, 'id'>,
  ): Promise<PasswordPolicyConfig> => {
    const response = await api.put<PasswordPolicyConfig>(
      '/api/v1/admin/users/password-policy',
      data,
    );
    return response.data;
  },

  // Guest access
  createGuest: async (data: CreateGuestRequest): Promise<string> => {
    const response = await api.post<string>('/api/v1/admin/users/guests', data);
    return response.data;
  },
};
