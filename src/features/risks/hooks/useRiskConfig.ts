import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CatalogType, SaveScaleRequest, SaveThresholdRequest, CreateCatalogItemRequest, UpdateCatalogItemRequest, ScaleType } from '../types';
import * as risksApi from '../risksApi';

const KEYS = {
  scales: ['risk-scales'] as const,
  scale: (type: ScaleType) => ['risk-scales', type] as const,
  matrix: ['criticality-matrix'] as const,
  catalog: (type: CatalogType) => ['risk-catalog', type] as const,
};

// ========== Scales ==========

export function useRiskScales() {
  return useQuery({
    queryKey: KEYS.scales,
    queryFn: risksApi.getScales,
  });
}

export function useRiskScale(type: ScaleType) {
  return useQuery({
    queryKey: KEYS.scale(type),
    queryFn: () => risksApi.getScaleByType(type),
  });
}

export function useSaveScale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveScaleRequest) => risksApi.saveScale(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.scales });
    },
  });
}

// ========== Criticality Matrix ==========

export function useCriticalityMatrix() {
  return useQuery({
    queryKey: KEYS.matrix,
    queryFn: risksApi.getCriticalityMatrix,
  });
}

export function useSaveCriticalityMatrix() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveThresholdRequest[]) => risksApi.saveCriticalityMatrix(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.matrix });
    },
  });
}

// ========== Catalogs ==========

export function useRiskCatalog(catalogType: CatalogType, activeOnly = false) {
  return useQuery({
    queryKey: [...KEYS.catalog(catalogType), activeOnly],
    queryFn: () => risksApi.getCatalogItems(catalogType, activeOnly),
  });
}

export function useCreateCatalogItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCatalogItemRequest) => risksApi.createCatalogItem(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: KEYS.catalog(variables.catalogType) });
    },
  });
}

export function useUpdateCatalogItem(catalogType: CatalogType) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCatalogItemRequest }) =>
      risksApi.updateCatalogItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.catalog(catalogType) });
    },
  });
}

export function useToggleCatalogItem(catalogType: CatalogType) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => risksApi.toggleCatalogItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.catalog(catalogType) });
    },
  });
}
