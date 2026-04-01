import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  closeCampaign,
  createCampaign,
  getCampaign,
  getCampaigns,
  getDashboard,
  getEvolution,
  getHistory,
  getResponse,
  requestRevision,
  saveResponse,
  validateResponse,
} from '../selfAssessmentApi';
import type { CreateCampaignRequest, SaveResponseRequest } from '../types';

const KEYS = {
  campaigns: ['self-assessment', 'campaigns'] as const,
  campaign: (id: string) => ['self-assessment', 'campaigns', id] as const,
  response: (campaignId: string, processId: string) =>
    ['self-assessment', 'responses', campaignId, processId] as const,
  history: (processId: string) =>
    ['self-assessment', 'history', processId] as const,
  dashboard: (campaignId: string) =>
    ['self-assessment', 'dashboard', campaignId] as const,
  evolution: (processId: string) =>
    ['self-assessment', 'evolution', processId] as const,
};

// ========== Campaigns ==========

export function useCampaigns() {
  return useQuery({
    queryKey: KEYS.campaigns,
    queryFn: getCampaigns,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.campaign(id!),
    queryFn: () => getCampaign(id!),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => createCampaign(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.campaigns }),
  });
}

export function useCloseCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => closeCampaign(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: KEYS.campaigns });
      qc.invalidateQueries({ queryKey: KEYS.campaign(id) });
    },
  });
}

// ========== Responses ==========

export function useResponse(
  campaignId: string | undefined,
  processId: string | undefined,
) {
  return useQuery({
    queryKey: KEYS.response(campaignId!, processId!),
    queryFn: () => getResponse(campaignId!, processId!),
    enabled: !!campaignId && !!processId,
  });
}

export function useSaveResponse(campaignId: string, processId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveResponseRequest) =>
      saveResponse(campaignId, processId, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: KEYS.response(campaignId, processId),
      });
      qc.invalidateQueries({ queryKey: KEYS.campaign(campaignId) });
    },
  });
}

export function useValidateResponse(campaignId: string, processId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => validateResponse(campaignId, processId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: KEYS.response(campaignId, processId),
      });
      qc.invalidateQueries({ queryKey: KEYS.campaign(campaignId) });
    },
  });
}

export function useRequestRevision(campaignId: string, processId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => requestRevision(campaignId, processId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: KEYS.response(campaignId, processId),
      });
      qc.invalidateQueries({ queryKey: KEYS.campaign(campaignId) });
    },
  });
}

// ========== History ==========

export function useAssessmentHistory(processId: string | undefined) {
  return useQuery({
    queryKey: KEYS.history(processId!),
    queryFn: () => getHistory(processId!),
    enabled: !!processId,
  });
}

// ========== Dashboard / Maturité (M7.3) ==========

export function useDashboard(campaignId: string | undefined) {
  return useQuery({
    queryKey: KEYS.dashboard(campaignId!),
    queryFn: () => getDashboard(campaignId!),
    enabled: !!campaignId,
  });
}

export function useEvolution(processId: string | undefined) {
  return useQuery({
    queryKey: KEYS.evolution(processId!),
    queryFn: () => getEvolution(processId!),
    enabled: !!processId,
  });
}
