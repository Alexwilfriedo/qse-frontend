import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { strategyApi } from '../strategyApi';
import type {
  CreateRegulatoryWatchRequest,
  CreateStakeholderRequest,
  CreateStrategicDocumentRequest,
  CreateStrategicObjectiveRequest,
  ObjectiveStatut,
  RecordKpiMeasureRequest,
  RegulatoryCategory,
  RevisionDocumentRequest,
  StrategicDocumentType,
  UpdateRegulatoryWatchRequest,
  UpdateStakeholderRequest,
  UpdateStrategicDocumentRequest,
  UpdateStrategicObjectiveRequest,
} from '../types';

const KEYS = {
  dashboard: ['strategy', 'dashboard'] as const,
  documents: ['strategy', 'documents'] as const,
  document: (id: string) => ['strategy', 'documents', id] as const,
  documentsAlerts: ['strategy', 'documents', 'alerts'] as const,
  stakeholders: ['strategy', 'stakeholders'] as const,
  stakeholder: (id: string) => ['strategy', 'stakeholders', id] as const,
  objectives: ['strategy', 'objectives'] as const,
  objective: (id: string) => ['strategy', 'objectives', id] as const,
  objectivesAlerts: ['strategy', 'objectives', 'alerts'] as const,
  watches: ['strategy', 'watches'] as const,
  watch: (id: string) => ['strategy', 'watches', id] as const,
  watchesAlerts: ['strategy', 'watches', 'alerts'] as const,
};

// ========== Dashboard ==========

export function useStrategyDashboard() {
  return useQuery({
    queryKey: KEYS.dashboard,
    queryFn: () => strategyApi.getDashboard().then((r) => r.data),
  });
}

// ========== Documents Stratégiques ==========

export function useDocuments(type?: StrategicDocumentType) {
  return useQuery({
    queryKey: [...KEYS.documents, type],
    queryFn: () => strategyApi.getDocuments(type).then((r) => r.data),
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: KEYS.document(id),
    queryFn: () => strategyApi.getDocumentById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useDocumentsAlerts() {
  return useQuery({
    queryKey: KEYS.documentsAlerts,
    queryFn: () => strategyApi.getDocumentsAlerts().then((r) => r.data),
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStrategicDocumentRequest) =>
      strategyApi.createDocument(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.documents });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStrategicDocumentRequest;
    }) => strategyApi.updateDocument(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.documents });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useRevisionDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RevisionDocumentRequest }) =>
      strategyApi.revisionDocument(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.documents });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ========== Parties Intéressées ==========

export function useStakeholders() {
  return useQuery({
    queryKey: KEYS.stakeholders,
    queryFn: () => strategyApi.getStakeholders().then((r) => r.data),
  });
}

export function useStakeholder(id: string) {
  return useQuery({
    queryKey: KEYS.stakeholder(id),
    queryFn: () => strategyApi.getStakeholderById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateStakeholder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStakeholderRequest) =>
      strategyApi.createStakeholder(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.stakeholders });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useUpdateStakeholder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStakeholderRequest;
    }) => strategyApi.updateStakeholder(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.stakeholders });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ========== Objectifs Stratégiques ==========

export function useObjectives(statut?: ObjectiveStatut) {
  return useQuery({
    queryKey: [...KEYS.objectives, statut],
    queryFn: () => strategyApi.getObjectives(statut).then((r) => r.data),
  });
}

export function useObjective(id: string) {
  return useQuery({
    queryKey: KEYS.objective(id),
    queryFn: () => strategyApi.getObjectiveById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useObjectivesAlerts() {
  return useQuery({
    queryKey: KEYS.objectivesAlerts,
    queryFn: () => strategyApi.getObjectivesAlerts().then((r) => r.data),
  });
}

export function useCreateObjective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStrategicObjectiveRequest) =>
      strategyApi.createObjective(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.objectives });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useUpdateObjective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStrategicObjectiveRequest;
    }) => strategyApi.updateObjective(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.objectives });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useRecordMeasure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordKpiMeasureRequest }) =>
      strategyApi.recordMeasure(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.objectives });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ========== Veille Réglementaire ==========

export function useWatches(categorie?: RegulatoryCategory) {
  return useQuery({
    queryKey: [...KEYS.watches, categorie],
    queryFn: () => strategyApi.getWatches(categorie).then((r) => r.data),
  });
}

export function useWatch(id: string) {
  return useQuery({
    queryKey: KEYS.watch(id),
    queryFn: () => strategyApi.getWatchById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useWatchesAlerts() {
  return useQuery({
    queryKey: KEYS.watchesAlerts,
    queryFn: () => strategyApi.getWatchesAlerts().then((r) => r.data),
  });
}

export function useCreateWatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRegulatoryWatchRequest) =>
      strategyApi.createWatch(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.watches });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useUpdateWatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRegulatoryWatchRequest;
    }) => strategyApi.updateWatch(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.watches });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useDeleteWatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => strategyApi.deleteWatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.watches });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ========== Delete mutations ==========

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => strategyApi.deleteDocument(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.documents });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useDeleteStakeholder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => strategyApi.deleteStakeholder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.stakeholders });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useDeleteObjective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => strategyApi.deleteObjective(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.objectives });
      qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}
