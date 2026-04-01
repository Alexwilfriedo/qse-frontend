export type ValidationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ValidationRequestView {
  id: string;
  processId: string;
  status: ValidationStatus;
  submittedBy: string;
  submittedAt: string;
  reviewerId?: string;
  reviewedAt?: string;
  comment?: string;
  snapshot?: string;
}

export interface DecisionRequest {
  comment?: string;
}

export interface SubmitResponse {
  validationId: string;
}

export interface PendingCheckResponse {
  pending: boolean;
}
