import { useQuery } from '@tanstack/react-query';
import { entitiesApi } from '../entitiesApi';

export function useEntityTree() {
  return useQuery({
    queryKey: ['entities', 'tree'],
    queryFn: () => entitiesApi.getTree(),
  });
}
