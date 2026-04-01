import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as incidentsApi from '../incidentsApi';
import type {
  CreateIncidentRequest,
  FiveWhyRequest,
  IncidentFilters,
  UpdateIncidentRequest,
} from '../types';

const KEYS = {
  incidents: ['incidents'] as const,
  incident: (id: string) => ['incidents', id] as const,
};

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: [...KEYS.incidents, filters],
    queryFn: () => incidentsApi.getIncidents(filters),
    placeholderData: (prev) => prev,
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: KEYS.incident(id),
    queryFn: () => incidentsApi.getIncidentById(id),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIncidentRequest) =>
      incidentsApi.createIncident(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.incidents });
    },
  });
}

export function useUpdateIncident(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateIncidentRequest) =>
      incidentsApi.updateIncident(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.incident(id) });
      qc.invalidateQueries({ queryKey: KEYS.incidents });
    },
  });
}

export function useAnalyzeFiveWhy(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FiveWhyRequest) => incidentsApi.analyzeFiveWhy(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.incident(id) });
      qc.invalidateQueries({ queryKey: KEYS.incidents });
    },
  });
}

export function useStartTreatment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => incidentsApi.startTreatment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.incident(id) });
      qc.invalidateQueries({ queryKey: KEYS.incidents });
    },
  });
}

export function useCloseIncident(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => incidentsApi.closeIncident(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.incident(id) });
      qc.invalidateQueries({ queryKey: KEYS.incidents });
    },
  });
}

export function useLinkRisk(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (riskId: string) => incidentsApi.linkRisk(id, riskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.incident(id) });
    },
  });
}
