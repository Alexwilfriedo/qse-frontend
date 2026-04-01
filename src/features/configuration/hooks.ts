import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  configurationApi,
  referenceApi,
  type CreateDocumentDomaineRequest,
  type CreateDocumentTypeRequest,
  type CreateReferenceItemRequest,
  type ReferenceCategory,
  type UpdateDocumentDomaineRequest,
  type UpdateDocumentTypeRequest,
  type UpdateReferenceItemRequest,
} from './configurationApi';

const QUERY_KEYS = {
  documentTypes: ['config', 'document-types'] as const,
  documentDomaines: ['config', 'document-domaines'] as const,
  references: (category: ReferenceCategory) =>
    ['config', 'references', category] as const,
};

// Document Types Hooks
export function useDocumentTypes(activeOnly = false) {
  return useQuery({
    queryKey: [...QUERY_KEYS.documentTypes, { activeOnly }],
    queryFn: () => configurationApi.getDocumentTypes(activeOnly),
  });
}

export function useCreateDocumentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocumentTypeRequest) =>
      configurationApi.createDocumentType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentTypes });
    },
  });
}

export function useUpdateDocumentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDocumentTypeRequest;
    }) => configurationApi.updateDocumentType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentTypes });
    },
  });
}

export function useToggleDocumentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active
        ? configurationApi.deactivateDocumentType(id)
        : configurationApi.activateDocumentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentTypes });
    },
  });
}

export function useDeleteDocumentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => configurationApi.deleteDocumentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentTypes });
    },
  });
}

// Document Domaines Hooks
export function useDocumentDomaines(activeOnly = false) {
  return useQuery({
    queryKey: [...QUERY_KEYS.documentDomaines, { activeOnly }],
    queryFn: () => configurationApi.getDocumentDomaines(activeOnly),
  });
}

export function useCreateDocumentDomaine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocumentDomaineRequest) =>
      configurationApi.createDocumentDomaine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentDomaines });
    },
  });
}

export function useUpdateDocumentDomaine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDocumentDomaineRequest;
    }) => configurationApi.updateDocumentDomaine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentDomaines });
    },
  });
}

export function useToggleDocumentDomaine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active
        ? configurationApi.deactivateDocumentDomaine(id)
        : configurationApi.activateDocumentDomaine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentDomaines });
    },
  });
}

export function useDeleteDocumentDomaine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => configurationApi.deleteDocumentDomaine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documentDomaines });
    },
  });
}

// ========== Reference Items Hooks (générique) ==========

export function useReferenceItems(
  category: ReferenceCategory,
  activeOnly = false,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.references(category), { activeOnly }],
    queryFn: () => referenceApi.getByCategory(category, activeOnly),
  });
}

export function useCreateReferenceItem(category: ReferenceCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReferenceItemRequest) =>
      referenceApi.create(category, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.references(category),
      });
    },
  });
}

export function useUpdateReferenceItem(category: ReferenceCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateReferenceItemRequest;
    }) => referenceApi.update(category, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.references(category),
      });
    },
  });
}

export function useToggleReferenceItem(category: ReferenceCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active
        ? referenceApi.deactivate(category, id)
        : referenceApi.activate(category, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.references(category),
      });
    },
  });
}

export function useDeleteReferenceItem(category: ReferenceCategory) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => referenceApi.delete(category, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.references(category),
      });
    },
  });
}
