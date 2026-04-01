export type EntityType = string;

export interface OrganizationalEntity {
  id: string;
  nom: string;
  nomCourt: string | null;
  type: EntityType;
  parentId: string | null;
  description: string | null;
  ordreAffichage: number;
  responsableIds: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  entityVersion: number;
}

export interface EntityTreeNode {
  id: string;
  nom: string;
  nomCourt: string | null;
  type: EntityType;
  description: string | null;
  ordreAffichage: number;
  responsableIds: string[];
  children: EntityTreeNode[];
}

export interface CreateEntityRequest {
  nom: string;
  nomCourt?: string;
  type: EntityType;
  parentId?: string;
  description?: string;
  ordreAffichage?: number;
}

export interface UpdateEntityRequest {
  nom: string;
  nomCourt?: string;
  type: EntityType;
  parentId?: string;
  description?: string;
  ordreAffichage?: number;
}

export interface AssignResponsablesRequest {
  responsableIds: string[];
}

export const DEFAULT_ENTITY_TYPE_OPTIONS: { value: EntityType; label: string }[] = [
  { value: 'DIRECTION', label: 'Direction' },
  { value: 'SERVICE', label: 'Service' },
  { value: 'DEPARTEMENT', label: 'Département' },
  { value: 'SITE', label: 'Site' },
  { value: 'UNITE', label: 'Unité' },
];

export function getEntityTypeLabel(type: EntityType): string {
  return (
    DEFAULT_ENTITY_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    type
  );
}
