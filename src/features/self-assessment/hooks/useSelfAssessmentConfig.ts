import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateAxisRequest,
  CreateGridRequest,
  CreateQuestionRequest,
  UpdateAxisRequest,
  UpdateGridRequest,
  UpdateQuestionRequest,
} from '../types';
import * as selfAssessmentApi from '../selfAssessmentApi';

const KEYS = {
  grids: ['sa-grids'] as const,
  grid: (id: string) => ['sa-grids', id] as const,
  activeGrid: ['sa-grids', 'active'] as const,
};

// ========== Grids ==========

export function useGrids() {
  return useQuery({
    queryKey: KEYS.grids,
    queryFn: selfAssessmentApi.getGrids,
  });
}

export function useGrid(id: string) {
  return useQuery({
    queryKey: KEYS.grid(id),
    queryFn: () => selfAssessmentApi.getGrid(id),
    enabled: !!id,
  });
}

export function useActiveGrid() {
  return useQuery({
    queryKey: KEYS.activeGrid,
    queryFn: selfAssessmentApi.getActiveGrid,
  });
}

export function useCreateGrid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGridRequest) => selfAssessmentApi.createGrid(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grids });
    },
  });
}

export function useUpdateGrid(gridId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGridRequest) =>
      selfAssessmentApi.updateGrid(gridId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grids });
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}

export function usePublishGrid(gridId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => selfAssessmentApi.publishGrid(gridId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grids });
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
      qc.invalidateQueries({ queryKey: KEYS.activeGrid });
    },
  });
}

// ========== Axes ==========

export function useAddAxis(gridId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAxisRequest) =>
      selfAssessmentApi.addAxis(gridId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}

export function useUpdateAxis(gridId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ axisId, data }: { axisId: string; data: UpdateAxisRequest }) =>
      selfAssessmentApi.updateAxis(gridId, axisId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}

export function useRemoveAxis(gridId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (axisId: string) =>
      selfAssessmentApi.removeAxis(gridId, axisId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}

// ========== Questions ==========

export function useAddQuestion(gridId: string, axisId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      selfAssessmentApi.addQuestion(gridId, axisId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}

export function useUpdateQuestion(gridId: string, axisId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: UpdateQuestionRequest;
    }) => selfAssessmentApi.updateQuestion(gridId, axisId, questionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}

export function useRemoveQuestion(gridId: string, axisId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) =>
      selfAssessmentApi.removeQuestion(gridId, axisId, questionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.grid(gridId) });
    },
  });
}
