import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useState } from 'react';
import { useCreateProcess, useEntityTree, useProcessMap } from '../hooks';
import type { CreateProcessRequest, ProcessType } from '../processTypes';
import { PROCESS_TYPES } from '../processTypes';
import type { EntityTreeNode } from '../types';

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM: CreateProcessRequest = {
  nom: '',
  type: 'REALISATION',
  piloteId: '',
  managerId: '',
  inputInteractionProcessIds: [],
  outputInteractionProcessIds: [],
};

export function CreateProcessModal({
  isOpen,
  onClose,
}: CreateProcessModalProps) {
  const [form, setForm] = useState<CreateProcessRequest>(EMPTY_FORM);
  const createProcess = useCreateProcess();
  const { data: users } = useUsers();
  const { data: entityTree } = useEntityTree();
  const { data: processMap } = useProcessMap();

  const userOptions = (users ?? []).map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));

  const flattenTree = (
    nodes: EntityTreeNode[],
  ): { value: string; label: string }[] =>
    nodes.flatMap((n) => [
      { value: n.id, label: n.nom },
      ...flattenTree(n.children),
    ]);
  const entityOptions = entityTree ? flattenTree(entityTree) : [];
  const relatedProcessOptions = processMap
    ? [...processMap.management, ...processMap.realisation, ...processMap.support].map(
        (process) => ({
          value: process.id,
          label: `${process.codification} - ${process.nom}`,
        }),
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProcess.mutate(
      {
        ...form,
        description: form.description || undefined,
        entityId: form.entityId || undefined,
        inputInteractionProcessIds:
          form.inputInteractionProcessIds &&
          form.inputInteractionProcessIds.length > 0
            ? form.inputInteractionProcessIds
            : undefined,
        outputInteractionProcessIds:
          form.outputInteractionProcessIds &&
          form.outputInteractionProcessIds.length > 0
            ? form.outputInteractionProcessIds
            : undefined,
        createdAt: form.createdAt
          ? new Date(form.createdAt).toISOString()
          : undefined,
        updatedAt: form.updatedAt
          ? new Date(form.updatedAt).toISOString()
          : undefined,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const set =
    <K extends keyof CreateProcessRequest>(field: K) =>
    (value: CreateProcessRequest[K]) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.nom.trim() && form.piloteId.trim() && form.managerId.trim();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouveau processus'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Nom du processus *'
            value={form.nom}
            onChange={(e) => set('nom')(e.target.value)}
            required
            placeholder='Ex: Gestion de la production'
          />
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Type de processus *
            </label>
            <Select
              value={form.type}
              onChange={(e) => set('type')(e.target.value as ProcessType)}
              options={PROCESS_TYPES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </div>
        </div>

        <Input
          label='Description'
          value={form.description || ''}
          onChange={(e) => set('description')(e.target.value || undefined)}
          placeholder='Description optionnelle'
        />

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Manager *
            </label>
            <Select
              value={form.managerId}
              onChange={(e) => set('managerId')(e.target.value)}
              placeholder='Sélectionner le manager'
              options={userOptions}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Pilote *
            </label>
            <Select
              value={form.piloteId}
              onChange={(e) => set('piloteId')(e.target.value)}
              placeholder='Sélectionner le pilote'
              options={userOptions}
            />
          </div>
        </div>

        {entityOptions.length > 0 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Entité organisationnelle
            </label>
            <Select
              value={form.entityId || ''}
              onChange={(e) => set('entityId')(e.target.value || undefined)}
              placeholder='Aucune'
              options={entityOptions}
            />
          </div>
        )}

        {relatedProcessOptions.length > 0 && (
          <div className='space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700'>
            <div>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Interactions entre processus
              </p>
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                Distingue les interactions qui alimentent ce processus de celles
                qu&apos;il envoie vers les autres.
              </p>
            </div>

            <div className='grid gap-4 xl:grid-cols-2'>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                    Interactions en entrée
                  </p>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Processus qui envoient des éléments vers ce processus.
                  </p>
                </div>
                <div className='grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-1'>
                  {relatedProcessOptions.map((process) => {
                    const checked = form.inputInteractionProcessIds?.includes(
                      process.value,
                    );
                    return (
                      <label
                        key={`in-${process.value}`}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          checked
                            ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-200'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        }`}>
                        <input
                          type='checkbox'
                          checked={checked}
                          onChange={(e) =>
                            set('inputInteractionProcessIds')(
                              e.target.checked
                                ? [
                                    ...(form.inputInteractionProcessIds ?? []),
                                    process.value,
                                  ]
                                : (form.inputInteractionProcessIds ?? []).filter(
                                    (id) => id !== process.value,
                                  ),
                            )
                          }
                          className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                        />
                        <span>{process.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                    Interactions en sortie
                  </p>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Processus vers lesquels ce processus envoie des éléments.
                  </p>
                </div>
                <div className='grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-1'>
                  {relatedProcessOptions.map((process) => {
                    const checked = form.outputInteractionProcessIds?.includes(
                      process.value,
                    );
                    return (
                      <label
                        key={`out-${process.value}`}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          checked
                            ? 'border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-200'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        }`}>
                        <input
                          type='checkbox'
                          checked={checked}
                          onChange={(e) =>
                            set('outputInteractionProcessIds')(
                              e.target.checked
                                ? [
                                    ...(form.outputInteractionProcessIds ?? []),
                                    process.value,
                                  ]
                                : (
                                    form.outputInteractionProcessIds ?? []
                                  ).filter((id) => id !== process.value),
                            )
                          }
                          className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                        />
                        <span>{process.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type='button'
          onClick={() => set('processusCle')(!form.processusCle)}
          className={`
            flex items-center gap-3 w-full px-4 py-3 rounded-lg border text-sm font-medium
            transition-all duration-200 cursor-pointer
            ${
              form.processusCle
                ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-200'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600'
            }
          `}>
          <span
            className={`
              flex items-center justify-center w-5 h-5 rounded-md text-xs transition-colors
              ${
                form.processusCle
                  ? 'bg-amber-400 text-white dark:bg-amber-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }
            `}>
            {form.processusCle ? '★' : '☆'}
          </span>
          Processus clé
        </button>

        <div className='grid grid-cols-2 gap-4'>
          <DatePicker
            label='Date de création'
            value={form.createdAt || ''}
            onChange={(val) => set('createdAt')(val || undefined)}
            clearable
          />
          <DatePicker
            label='Dernière modification'
            value={form.updatedAt || ''}
            onChange={(val) => set('updatedAt')(val || undefined)}
            clearable
          />
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={createProcess.isPending || !isValid}>
            {createProcess.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
