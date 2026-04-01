export interface WorkUnitView {
  id: string;
  name: string;
  code: string;
  location: string;
  department: string;
  chefUniteId: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  entityVersion: number;
}

export interface CreateWorkUnitRequest {
  name: string;
  code: string;
  location: string;
  department: string;
  chefUniteId?: string;
}

export type UpdateWorkUnitRequest = CreateWorkUnitRequest;
