import { useQuery } from '@tanstack/react-query';
import { processesApi } from '../processesApi';

export function useProcessMap() {
  return useQuery({
    queryKey: ['processes', 'map'],
    queryFn: () => processesApi.getMap(),
  });
}

export function useProcess(id: string | undefined) {
  return useQuery({
    queryKey: ['processes', id],
    queryFn: () => processesApi.getProcess(id!),
    enabled: !!id,
  });
}

export function useProcessLinks(id: string | undefined) {
  return useQuery({
    queryKey: ['processes', id, 'links'],
    queryFn: () => processesApi.getLinks(id!),
    enabled: !!id,
  });
}

export function useMaturityMatrix() {
  return useQuery({
    queryKey: ['processes', 'maturity-matrix'],
    queryFn: () => processesApi.getMaturityMatrix(),
  });
}
