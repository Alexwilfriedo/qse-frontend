import { useNavigate, useParams } from 'react-router-dom';
import { useAction } from './hooks/useActions';
import { ActionCard } from './components/ActionCard';
import { DeleteActionModal } from './components/DeleteActionModal';
import { EditActionModal } from './components/EditActionModal';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { actionsApi } from './actionsApi';
import { showToast } from '@/lib/toast';
import { getApiErrorMessage } from '@/lib/api';
import type { UpdateActionRequest } from './types';

export function ActionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: action, isLoading, isError } = useAction(id ?? '');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateActionRequest) => actionsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      showToast.success('Action mise à jour');
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => actionsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      showToast.success('Action supprimée');
      navigate('/actions');
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (isError || !action) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 mb-4">Action introuvable</p>
        <button
          onClick={() => navigate('/actions')}
          className="text-brand-600 hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <>
      <ActionCard
        action={action}
        onBack={() => navigate('/actions')}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        showHistory={true}
      />

      <EditActionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        action={action}
        onSave={(data) => updateMutation.mutate(data)}
        isLoading={updateMutation.isPending}
      />

      <DeleteActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        action={action}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
