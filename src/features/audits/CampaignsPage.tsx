import { Button, Card, PageHeader, Textarea } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { ArrowRight, BookmarkCheck, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import {
  useCampaigns,
  useCreateCampaign,
  useAuditProgramObjectives,
  useUpsertAuditProgramObjective,
} from './hooks/useAudits';
import { AUDIT_PROGRAM_DOMAINS } from './programConfig';
import type {
  AuditCampaign,
  CreateCampaignRequest,
  Domaine,
  UpsertAuditProgramObjectiveRequest,
} from './types';

export function CampaignsPage() {
  const currentYear = new Date().getFullYear();
  const [annee, setAnnee] = useState(currentYear);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<{
    domaine: Domaine;
    referentielNormatif: string;
    objectifGlobal: string;
  } | null>(null);
  const [objectiveDrafts, setObjectiveDrafts] = useState<Record<string, string>>(
    {},
  );

  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useCampaigns(annee);
  const { data: objectives } = useAuditProgramObjectives(annee);
  const createMutation = useCreateCampaign();
  const upsertObjectiveMutation = useUpsertAuditProgramObjective();

  const objectivesByKey = useMemo(() => {
    const map = new Map<string, string>();
    objectives?.forEach((objective) => {
      map.set(
        buildObjectiveKey(objective.domaine, objective.referentielNormatif),
        objective.objectifGlobal,
      );
    });
    return map;
  }, [objectives]);

  const handleCreate = (data: CreateCampaignRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        showToast.success('Programme créé avec succès');
        setIsCreateOpen(false);
        setSelectedPreset(null);
      },
      onError: (err) => showToast.error(getApiErrorMessage(err)),
    });
  };

  const handleSaveObjective = (data: UpsertAuditProgramObjectiveRequest) => {
    upsertObjectiveMutation.mutate(data, {
      onSuccess: () => showToast.success('Objectif annuel enregistré'),
      onError: (err) => showToast.error(getApiErrorMessage(err)),
    });
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Programme d'audit"
        description='Définissez les objectifs annuels par norme avant de planifier les programmes de chaque spécificité.'
        actions={
          <select
            value={annee}
            onChange={(e) => setAnnee(Number(e.target.value))}
            className='rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm'>
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        }
      />

      <div className='grid gap-5 xl:grid-cols-3'>
        {AUDIT_PROGRAM_DOMAINS.map((domainConfig) => (
          <Card
            key={domainConfig.domaine}
            className={`overflow-hidden border ${domainConfig.accentClass}`}>
            <div className='border-b border-black/5 bg-white/70 px-5 py-4 backdrop-blur'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.24em] text-gray-500'>
                    Spécificité
                  </p>
                  <h2 className='mt-1 text-2xl font-semibold text-gray-900'>
                    {domainConfig.label}
                  </h2>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${domainConfig.accentSoftClass}`}>
                  {domainConfig.normes.length} norme
                  {domainConfig.normes.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className='space-y-5 p-5'>
              {domainConfig.normes.map((norme) => {
                const key = buildObjectiveKey(domainConfig.domaine, norme);
                const storedObjective = objectivesByKey.get(key) ?? '';
                const objectiveValue =
                  objectiveDrafts[key] !== undefined
                    ? objectiveDrafts[key]
                    : storedObjective;
                const domainCampaigns = filterCampaigns(
                  campaigns,
                  domainConfig.domaine,
                  norme,
                );
                const canCreateProgram = storedObjective.trim().length > 0;

                return (
                  <section
                    key={norme}
                    className='rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
                          Norme
                        </p>
                        <h3 className='mt-1 text-lg font-semibold text-gray-900'>
                          {norme}
                        </h3>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPreset({
                            domaine: domainConfig.domaine,
                            referentielNormatif: norme,
                            objectifGlobal: storedObjective,
                          });
                          setIsCreateOpen(true);
                        }}
                        disabled={!canCreateProgram}
                        className='shrink-0'>
                        <Plus className='mr-2 h-4 w-4' />
                        Ajouter un programme
                      </Button>
                    </div>

                    <div className='mt-4 space-y-3'>
                      <Textarea
                        label='Objectif global annuel'
                        value={objectiveValue}
                        onChange={(event) =>
                          setObjectiveDrafts((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }))
                        }
                        placeholder={`Définir l'objectif global ${annee} pour ${norme}`}
                      />

                      <div className='flex items-center justify-between gap-3'>
                        <p className='text-sm text-gray-500'>
                          {canCreateProgram
                            ? 'Objectif enregistré. Vous pouvez créer les programmes rattachés.'
                            : "Enregistrez d'abord l'objectif global avant de créer un programme."}
                        </p>
                        <Button
                          variant='secondary'
                          onClick={() =>
                            handleSaveObjective({
                              annee,
                              domaine: domainConfig.domaine,
                              referentielNormatif: norme,
                              objectifGlobal: objectiveValue,
                            })
                          }
                          disabled={
                            upsertObjectiveMutation.isPending ||
                            !objectiveValue.trim()
                          }>
                          <BookmarkCheck className='mr-2 h-4 w-4' />
                          Enregistrer
                        </Button>
                      </div>
                    </div>

                    <div className='mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-4'>
                      <div className='mb-3 flex items-center justify-between gap-3'>
                        <div>
                          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-gray-500'>
                            Programmes créés
                          </p>
                          <p className='mt-1 text-sm text-gray-600'>
                            {domainCampaigns.length} programme
                            {domainCampaigns.length > 1 ? 's' : ''} pour cette norme
                          </p>
                        </div>
                      </div>

                      {isLoading ? (
                        <p className='text-sm text-gray-500'>Chargement...</p>
                      ) : domainCampaigns.length === 0 ? (
                        <p className='text-sm text-gray-500'>
                          Aucun programme enregistré pour cette norme.
                        </p>
                      ) : (
                        <div className='space-y-2'>
                          {domainCampaigns.map((campaign) => (
                            <button
                              key={campaign.id}
                              type='button'
                              onClick={() =>
                                navigate(`/audits/campaigns/${campaign.id}`)
                              }
                              className='flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40'>
                              <div>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {campaign.scopeLabel ?? campaign.titre}
                                </p>
                                <p className='mt-1 text-xs text-gray-500'>
                                  {campaign.dateDebut} au {campaign.dateFin}
                                </p>
                              </div>
                              <ArrowRight className='h-4 w-4 text-gray-400' />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <CreateCampaignModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSelectedPreset(null);
        }}
        onSave={handleCreate}
        isLoading={createMutation.isPending}
        defaultAnnee={annee}
        preset={selectedPreset}
      />
    </div>
  );
}

function buildObjectiveKey(domaine: Domaine, referentielNormatif: string) {
  return `${domaine}::${referentielNormatif}`;
}

function filterCampaigns(
  campaigns: AuditCampaign[] | undefined,
  domaine: Domaine,
  referentielNormatif: string,
) {
  return (
    campaigns?.filter(
      (campaign) =>
        campaign.perimetre.includes(domaine) &&
        campaign.referentielNormatif === referentielNormatif,
    ) ?? []
  );
}
