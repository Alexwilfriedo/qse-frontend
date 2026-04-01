import { api } from '@/lib/api';
import type {
  Acknowledgement,
  AcknowledgementStats,
  AddCommentRequest,
  CastVoteRequest,
  ConsultationStatus,
  ConsultationVote,
  CreateDocumentRequest,
  CreateQuizRequest,
  Document,
  DocumentComment,
  DocumentDashboard,
  DocumentFilters,
  DocumentQuiz,
  DocumentsPage,
  PaperDistribution,
  QuizAttempt,
  RequestAcknowledgementsRequest,
  SubmitQuizAttemptRequest,
  UpdateDocumentRequest,
} from './types';

export const documentsApi = {
  getDocuments: async (
    filters: DocumentFilters = {},
  ): Promise<DocumentsPage> => {
    const params = new URLSearchParams();
    if (filters.domaine) params.append('domaine', filters.domaine);
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));

    const response = await api.get<DocumentsPage>(
      `/api/v1/documents?${params.toString()}`,
    );
    return response.data;
  },

  getDocument: async (id: string): Promise<Document> => {
    const response = await api.get<Document>(`/api/v1/documents/${id}`);
    return response.data;
  },

  createDocument: async (
    data: CreateDocumentRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>('/api/v1/documents', data);
    return response.data;
  },

  updateDocument: async (
    id: string,
    data: UpdateDocumentRequest,
  ): Promise<Document> => {
    const response = await api.put<Document>(`/api/v1/documents/${id}`, data);
    return response.data;
  },

  patchDocument: async (
    id: string,
    data: Partial<UpdateDocumentRequest>,
  ): Promise<Document> => {
    const response = await api.patch<Document>(`/api/v1/documents/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/documents/${id}`);
  },

  // ========== Workflow ==========

  submitDocument: async (id: string): Promise<Document> => {
    const response = await api.post<Document>(`/api/v1/documents/${id}/submit`);
    return response.data;
  },

  verifyDocument: async (
    id: string,
    requireConsultation: boolean,
  ): Promise<Document> => {
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/verify`,
      { requireConsultation },
    );
    return response.data;
  },

  validateConsultation: async (id: string): Promise<Document> => {
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/validate-consultation`,
    );
    return response.data;
  },

  publishDocument: async (id: string): Promise<Document> => {
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/publish`,
    );
    return response.data;
  },

  rejectDocument: async (id: string, motif: string): Promise<Document> => {
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/reject`,
      { motif },
    );
    return response.data;
  },

  resumeEditing: async (id: string): Promise<Document> => {
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/resume-editing`,
    );
    return response.data;
  },

  archiveDocument: async (id: string): Promise<Document> => {
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/archive`,
    );
    return response.data;
  },

  // ========== File Upload / Download ==========

  uploadFile: async (id: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Document>(
      `/api/v1/documents/${id}/file`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  getFileDownloadUrl: (id: string): string => `/api/v1/documents/${id}/file`,

  getDashboard: async (): Promise<DocumentDashboard> => {
    const response = await api.get<DocumentDashboard>(
      '/api/v1/documents/dashboard',
    );
    return response.data;
  },

  // ========== Consultation ISO 45001 (M2.3) ==========

  getConsultationVotes: async (id: string): Promise<ConsultationVote[]> => {
    const response = await api.get<ConsultationVote[]>(
      `/api/v1/documents/${id}/consultation/votes`,
    );
    return response.data;
  },

  getConsultationStatus: async (id: string): Promise<ConsultationStatus> => {
    const response = await api.get<ConsultationStatus>(
      `/api/v1/documents/${id}/consultation/status`,
    );
    return response.data;
  },

  castConsultationVote: async (
    id: string,
    data: CastVoteRequest,
  ): Promise<ConsultationVote> => {
    const response = await api.post<ConsultationVote>(
      `/api/v1/documents/${id}/consultation/vote`,
      data,
    );
    return response.data;
  },

  // ========== Accusés de lecture (M2.4) ==========

  getAcknowledgements: async (id: string): Promise<Acknowledgement[]> => {
    const response = await api.get<Acknowledgement[]>(
      `/api/v1/documents/${id}/acknowledgements`,
    );
    return response.data;
  },

  getAcknowledgementStats: async (
    id: string,
  ): Promise<AcknowledgementStats> => {
    const response = await api.get<AcknowledgementStats>(
      `/api/v1/documents/${id}/acknowledgements/stats`,
    );
    return response.data;
  },

  requestAcknowledgements: async (
    id: string,
    data: RequestAcknowledgementsRequest,
  ): Promise<{ created: number }> => {
    const response = await api.post<{ created: number }>(
      `/api/v1/documents/${id}/acknowledgements`,
      data,
    );
    return response.data;
  },

  acknowledgeDocument: async (id: string): Promise<void> => {
    await api.post(`/api/v1/documents/${id}/acknowledge`);
  },

  getMyPendingAcknowledgements: async (): Promise<Acknowledgement[]> => {
    const response = await api.get<Acknowledgement[]>(
      '/api/v1/documents/my-pending-acknowledgements',
    );
    return response.data;
  },

  // ========== Commentaires (M2.2) ==========

  getComments: async (id: string): Promise<DocumentComment[]> => {
    const response = await api.get<DocumentComment[]>(
      `/api/v1/documents/${id}/comments`,
    );
    return response.data;
  },

  addComment: async (
    id: string,
    data: AddCommentRequest,
  ): Promise<DocumentComment> => {
    const response = await api.post<DocumentComment>(
      `/api/v1/documents/${id}/comments`,
      data,
    );
    return response.data;
  },

  resolveComment: async (commentId: string): Promise<DocumentComment> => {
    const response = await api.post<DocumentComment>(
      `/api/v1/documents/comments/${commentId}/resolve`,
    );
    return response.data;
  },

  // M2.5 — Documents externes
  setReferenceExterne: async (
    id: string,
    referenceExterne: string,
  ): Promise<Document> => {
    const response = await api.put<Document>(
      `/api/v1/documents/${id}/reference-externe`,
      { referenceExterne },
    );
    return response.data;
  },

  setProcessusLink: async (
    id: string,
    processusId: string | null,
    dateValidite: string | null,
  ): Promise<Document> => {
    const response = await api.put<Document>(
      `/api/v1/documents/${id}/processus-link`,
      { processusId, dateValidite },
    );
    return response.data;
  },

  // M2.4 — Quiz
  getQuiz: async (documentId: string): Promise<DocumentQuiz | null> => {
    const response = await api.get<DocumentQuiz | null>(
      `/api/v1/documents/${documentId}/quiz`,
      {
        validateStatus: (status) => status === 404 || (status >= 200 && status < 300),
      },
    );
    if (response.status === 404) {
      return null;
    }
    return response.data;
  },

  createQuiz: async (
    documentId: string,
    request: CreateQuizRequest,
  ): Promise<DocumentQuiz> => {
    const response = await api.post<DocumentQuiz>(
      `/api/v1/documents/${documentId}/quiz`,
      request,
    );
    return response.data;
  },

  submitQuizAttempt: async (
    documentId: string,
    request: SubmitQuizAttemptRequest,
  ): Promise<QuizAttempt> => {
    const response = await api.post<QuizAttempt>(
      `/api/v1/documents/${documentId}/quiz/attempt`,
      request,
    );
    return response.data;
  },

  getMyQuizAttempts: async (documentId: string): Promise<QuizAttempt[]> => {
    const response = await api.get<QuizAttempt[] | null>(
      `/api/v1/documents/${documentId}/quiz/attempts`,
      {
        validateStatus: (status) => status === 404 || (status >= 200 && status < 300),
      },
    );
    if (response.status === 404 || !response.data) {
      return [];
    }
    return response.data;
  },

  // M2.6 — Paper Distribution
  getPaperDistributions: async (
    documentId: string,
  ): Promise<PaperDistribution[]> => {
    const response = await api.get<PaperDistribution[]>(
      `/api/v1/documents/${documentId}/paper-distributions`,
    );
    return response.data;
  },

  createPaperDistribution: async (
    documentId: string,
    recipientId: string,
  ): Promise<PaperDistribution> => {
    const response = await api.post<PaperDistribution>(
      `/api/v1/documents/${documentId}/paper-distributions`,
      { recipientId },
    );
    return response.data;
  },

  updatePaperDistributionStatus: async (
    distributionId: string,
    action: string,
    newVersion?: string,
  ): Promise<PaperDistribution> => {
    const response = await api.put<PaperDistribution>(
      `/api/v1/documents/paper-distributions/${distributionId}/status`,
      { action, newVersion },
    );
    return response.data;
  },
};
