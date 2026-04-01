import { Button, Card, CardHeader, PageHeader } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditorDetailModal } from './components/AuditorDetailModal';
import { AuditorTable } from './components/AuditorTable';
import { CreateAuditorModal } from './components/CreateAuditorModal';
import {
  useAuditors,
  useCreateAuditor,
  useEvaluerCompetences,
  useUploadAuditorPhoto,
  useUpdateAuditor,
} from './hooks/useAudits';
import type {
  Auditor,
  AuditorLevel,
  CreateAuditorRequest,
  EvaluerCompetencesRequest,
  UpdateAuditorRequest,
} from './types';

export function AuditorsPage() {
  const navigate = useNavigate();
  const [actifFilter, setActifFilter] = useState<boolean | undefined>(true);
  const [levelFilter, setLevelFilter] = useState<AuditorLevel | undefined>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAuditor, setEditingAuditor] = useState<Auditor | null>(null);
  const [evaluatingAuditor, setEvaluatingAuditor] = useState<Auditor | null>(null);
  const { data: auditors, isLoading } = useAuditors(actifFilter, levelFilter);
  const createMutation = useCreateAuditor();
  const updateMutation = useUpdateAuditor();
  const evaluateMutation = useEvaluerCompetences();
  const uploadPhotoMutation = useUploadAuditorPhoto();

  const handleCreate = async (
    data: CreateAuditorRequest,
    photoFile?: File | null,
  ) => {
    try {
      const { id } = await createMutation.mutateAsync(data);
      if (photoFile) {
        await uploadPhotoMutation.mutateAsync({ id, file: photoFile });
      }
      showToast.success('Auditeur créé avec succès');
      setIsCreateOpen(false);
    } catch (err) {
      showToast.error(getApiErrorMessage(err));
    }
  };

  const handleUpdate = async (
    data: UpdateAuditorRequest,
    photoFile?: File | null,
  ) => {
    if (!editingAuditor) {
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editingAuditor.id, data });
      if (photoFile) {
        await uploadPhotoMutation.mutateAsync({
          id: editingAuditor.id,
          file: photoFile,
        });
      }
      showToast.success('Auditeur modifié avec succès');
      setEditingAuditor(null);
    } catch (err) {
      showToast.error(getApiErrorMessage(err));
    }
  };

  const handleEvaluate = async (data: EvaluerCompetencesRequest) => {
    if (!evaluatingAuditor) {
      return;
    }

    await evaluateMutation.mutateAsync({
      id: evaluatingAuditor.id,
      data,
    });
    showToast.success('Évaluation enregistrée');
    setEvaluatingAuditor(null);
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Auditeurs internes'
        description='Fiches de qualification ISO 19011'
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouvel auditeur
          </Button>
        }
      />

      <Card>
        <CardHeader title='Base auditeurs' />

        <div className='flex gap-3 px-4 pb-3'>
          <select
            value={actifFilter === undefined ? '' : String(actifFilter)}
            onChange={(e) =>
              setActifFilter(
                e.target.value === '' ? undefined : e.target.value === 'true',
              )
            }
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm'>
            <option value=''>Tous</option>
            <option value='true'>Actifs</option>
            <option value='false'>Inactifs</option>
          </select>

          <select
            value={levelFilter ?? ''}
            onChange={(e) =>
              setLevelFilter(
                (e.target.value || undefined) as AuditorLevel | undefined,
              )
            }
            className='rounded-md border border-gray-300 px-3 py-1.5 text-sm'>
            <option value=''>Tous niveaux</option>
            <option value='JUNIOR'>Junior</option>
            <option value='CONFIRME'>Confirme</option>
            <option value='LEAD'>Lead</option>
          </select>
        </div>

        <AuditorTable
          auditors={auditors}
          isLoading={isLoading}
          onOpen={(auditor) => navigate(`/audits/auditors/${auditor.id}`)}
          onEdit={setEditingAuditor}
          onEvaluate={setEvaluatingAuditor}
        />
      </Card>

      <CreateAuditorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
        isPending={createMutation.isPending || uploadPhotoMutation.isPending}
      />

      <AuditorDetailModal
        auditor={evaluatingAuditor}
        isOpen={!!evaluatingAuditor}
        onClose={() => setEvaluatingAuditor(null)}
        onEvaluate={handleEvaluate}
        isPending={evaluateMutation.isPending}
      />

      <CreateAuditorModal
        auditor={editingAuditor}
        isOpen={!!editingAuditor}
        onClose={() => setEditingAuditor(null)}
        onSave={(data, photoFile) =>
          handleUpdate(data as UpdateAuditorRequest, photoFile)
        }
        isPending={updateMutation.isPending || uploadPhotoMutation.isPending}
      />
    </div>
  );
}
