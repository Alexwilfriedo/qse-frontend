import { Button, Select } from '@/components/ui';
import {
  useCreateLink,
  useDeleteLink,
  useProcessLinks,
  useProcessMap,
} from '@/features/cartography/hooks';
import type { ProcessLinkView, ProcessView } from '@/features/cartography/processTypes';
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  process: ProcessView;
}

function getRelatedProcessId(link: ProcessLinkView, processId: string) {
  return link.sourceProcessId === processId
    ? link.targetProcessId
    : link.sourceProcessId;
}

export function ProcessInteractionsCard({ process }: Props) {
  const [incomingTargetId, setIncomingTargetId] = useState('');
  const [outgoingTargetId, setOutgoingTargetId] = useState('');
  const { data: map } = useProcessMap();
  const { data: links } = useProcessLinks(process.id);
  const createLink = useCreateLink();
  const deleteLink = useDeleteLink();

  const allProcesses = useMemo(
    () => (map ? [...map.management, ...map.realisation, ...map.support] : []),
    [map],
  );

  const interactionLinks = useMemo(
    () => (links ?? []).filter((link) => link.linkType === 'INTERACTION'),
    [links],
  );

  const incomingLinks = useMemo(
    () => interactionLinks.filter((link) => link.targetProcessId === process.id),
    [interactionLinks, process.id],
  );

  const outgoingLinks = useMemo(
    () => interactionLinks.filter((link) => link.sourceProcessId === process.id),
    [interactionLinks, process.id],
  );

  const linkedProcessIds = useMemo(
    () =>
      new Set(
        interactionLinks.map((link) => getRelatedProcessId(link, process.id)),
      ),
    [interactionLinks, process.id],
  );

  const processMapById = useMemo(
    () => new Map(allProcesses.map((item) => [item.id, item])),
    [allProcesses],
  );

  const availableTargets = useMemo(
    () =>
      allProcesses.filter(
        (item) => item.id !== process.id && !linkedProcessIds.has(item.id),
      ),
    [allProcesses, linkedProcessIds, process.id],
  );

  const handleAddIncomingInteraction = () => {
    if (!incomingTargetId) return;
    createLink.mutate(
      {
        sourceId: incomingTargetId,
        data: {
          targetId: process.id,
          type: 'INTERACTION',
        },
      },
      {
        onSuccess: () => {
          setIncomingTargetId('');
        },
      },
    );
  };

  const handleAddOutgoingInteraction = () => {
    if (!outgoingTargetId) return;
    createLink.mutate(
      {
        sourceId: process.id,
        data: {
          targetId: outgoingTargetId,
          type: 'INTERACTION',
        },
      },
      {
        onSuccess: () => {
          setOutgoingTargetId('');
        },
      },
    );
  };

  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-theme-sm'>
      <div className='p-6 space-y-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide'>
              Interactions entre processus
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Ajoute ou supprime les processus en interaction directe avec ce
              processus.
            </p>
          </div>
          <div className='inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/30 dark:text-orange-300'>
            <ArrowRightLeft className='h-3.5 w-3.5' />
            {interactionLinks.length} interaction
            {interactionLinks.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className='grid gap-4 xl:grid-cols-2'>
          <div className='rounded-xl border border-dashed border-blue-300 bg-blue-50/60 p-4 dark:border-blue-800 dark:bg-blue-950/20'>
            <div className='grid gap-3 md:grid-cols-[1fr_auto] md:items-end'>
              <Select
                label='Ajouter une interaction en entrée'
                value={incomingTargetId}
                onChange={(e) => setIncomingTargetId(e.target.value)}
                placeholder='Sélectionner le processus source'
                searchable
                options={availableTargets.map((item) => ({
                  value: item.id,
                  label: `${item.nom} (${item.codification})`,
                }))}
              />
              <Button
                type='button'
                onClick={handleAddIncomingInteraction}
                disabled={!incomingTargetId || createLink.isPending}
                isLoading={createLink.isPending}
                leftIcon={<Plus className='h-4 w-4' />}>
                Ajouter
              </Button>
            </div>
          </div>

          <div className='rounded-xl border border-dashed border-orange-300 bg-orange-50/60 p-4 dark:border-orange-800 dark:bg-orange-950/20'>
            <div className='grid gap-3 md:grid-cols-[1fr_auto] md:items-end'>
              <Select
                label='Ajouter une interaction en sortie'
                value={outgoingTargetId}
                onChange={(e) => setOutgoingTargetId(e.target.value)}
                placeholder='Sélectionner le processus cible'
                searchable
                options={availableTargets.map((item) => ({
                  value: item.id,
                  label: `${item.nom} (${item.codification})`,
                }))}
                hint={
                  availableTargets.length === 0
                    ? 'Tous les autres processus sont déjà liés.'
                    : undefined
                }
              />
              <Button
                type='button'
                onClick={handleAddOutgoingInteraction}
                disabled={!outgoingTargetId || createLink.isPending}
                isLoading={createLink.isPending}
                leftIcon={<Plus className='h-4 w-4' />}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {interactionLinks.length > 0 ? (
          <div className='grid gap-4 xl:grid-cols-2'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300'>
                <ArrowDownToLine className='h-4 w-4' />
                Interactions en entrée
              </div>
              {incomingLinks.length > 0 ? incomingLinks.map((link) => {
                const relatedId = getRelatedProcessId(link, process.id);
                const relatedProcess = processMapById.get(relatedId);

                return (
                  <div
                    key={link.id}
                    className='flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-800 dark:bg-blue-950/20 md:flex-row md:items-center md:justify-between'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white'>
                        <ArrowDownToLine className='h-4 w-4 text-blue-500' />
                        {relatedProcess ? (
                          <Link
                            to={`/cartographie/processus/${relatedProcess.id}`}
                            className='hover:text-brand-600 hover:underline'>
                            {relatedProcess.nom}
                          </Link>
                        ) : (
                          <span>Processus source introuvable</span>
                        )}
                      </div>
                      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        {relatedProcess?.codification ?? relatedId}
                      </p>
                    </div>

                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => deleteLink.mutate(link.id)}
                      isLoading={deleteLink.isPending}
                      leftIcon={<Trash2 className='h-4 w-4' />}>
                      Supprimer
                    </Button>
                  </div>
                );
              }) : (
                <div className='rounded-xl border border-dashed border-blue-200 p-6 text-center text-sm text-gray-500 dark:border-blue-900 dark:text-gray-400'>
                  Aucune interaction entrante.
                </div>
              )}
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-300'>
                <ArrowUpFromLine className='h-4 w-4' />
                Interactions en sortie
              </div>
              {outgoingLinks.length > 0 ? outgoingLinks.map((link) => {
                const relatedId = getRelatedProcessId(link, process.id);
                const relatedProcess = processMapById.get(relatedId);

                return (
                  <div
                    key={link.id}
                    className='flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50/60 p-4 dark:border-orange-800 dark:bg-orange-950/20 md:flex-row md:items-center md:justify-between'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white'>
                        <ArrowUpFromLine className='h-4 w-4 text-orange-500' />
                        {relatedProcess ? (
                          <Link
                            to={`/cartographie/processus/${relatedProcess.id}`}
                          className='hover:text-brand-600 hover:underline'>
                          {relatedProcess.nom}
                        </Link>
                      ) : (
                        <span>Processus lié introuvable</span>
                      )}
                    </div>
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      {relatedProcess?.codification ?? relatedId}
                    </p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => deleteLink.mutate(link.id)}
                      isLoading={deleteLink.isPending}
                      leftIcon={<Trash2 className='h-4 w-4' />}>
                      Supprimer
                    </Button>
                  </div>
                  </div>
                );
              }) : (
                <div className='rounded-xl border border-dashed border-orange-200 p-6 text-center text-sm text-gray-500 dark:border-orange-900 dark:text-gray-400'>
                  Aucune interaction sortante.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400'>
            Aucune interaction n&apos;est encore définie pour ce processus.
          </div>
        )}
      </div>
    </div>
  );
}
