import { api } from '@/lib/api';
import type {
  AesAxisCode,
  AesMeasurement,
  CreateAesMeasurementRequest,
} from './aesTypes';

const BASE = '/api/v1/kpi-report/aes';

export const aesApi = {
  getMeasurements: async (
    siteId?: string,
    axisCode?: AesAxisCode,
  ): Promise<AesMeasurement[]> => {
    const params: Record<string, string> = {};
    if (siteId) params.siteId = siteId;
    if (axisCode) params.axisCode = axisCode;
    const response = await api.get<AesMeasurement[]>(`${BASE}/measurements`, {
      params,
    });
    return response.data;
  },

  create: async (
    data: CreateAesMeasurementRequest,
  ): Promise<AesMeasurement> => {
    const response = await api.post<AesMeasurement>(
      `${BASE}/measurements`,
      data,
    );
    return response.data;
  },

  uploadProof: async (id: string, file: File): Promise<AesMeasurement> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<AesMeasurement>(
      `${BASE}/measurements/${id}/proof`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  downloadProofUrl: (id: string) => `${BASE}/measurements/${id}/proof`,
};
