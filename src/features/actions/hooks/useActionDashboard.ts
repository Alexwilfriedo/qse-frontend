import { useQuery } from '@tanstack/react-query';
import { actionsApi } from '../actionsApi';

export function useActionDashboard() {
  return useQuery({
    queryKey: ['actions', 'dashboard'],
    queryFn: () => actionsApi.getDashboard(),
  });
}
