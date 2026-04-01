import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, type LoginRequest } from './authApi';
import { useAuthStore } from './authStore';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    setAuth,
    clearAuth,
    isAuthenticated,
    user,
    accessToken,
    forcePasswordChange,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(
        response.accessToken,
        response.refreshToken,
        response.user,
        response.forcePasswordChange,
      );
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (response.forcePasswordChange) {
        navigate('/change-password');
      } else {
        showToast.success(`Bienvenue, ${response.user.firstName} !`);
        navigate('/');
      }
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      showToast.success('Déconnexion réussie');
      navigate('/login');
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      showToast.error('Erreur de déconnexion');
      navigate('/login');
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated && !!accessToken,
    retry: false,
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    isAuthenticated,
    forcePasswordChange,
    user: currentUser ?? user,
  };
}
