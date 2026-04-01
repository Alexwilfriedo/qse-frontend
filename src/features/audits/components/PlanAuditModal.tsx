import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Textarea,
  TimePicker,
  type SelectOption,
} from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuditors } from '../hooks/useAudits';
import { AUDIT_PROGRAM_DOMAINS } from '../programConfig';
import type { AuditCampaignDetail, PlanAuditRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlanAuditRequest) => void;
  isPending: boolean;
  campaign: AuditCampaignDetail;
}

interface AuditScheduleRow {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
}

interface InterviewRow {
  id: string;
  processus: string;
  auditeurIds: string[];
  auditeUserId: string;
  auditeNom: string;
  auditeEmail: string;
}

interface DocumentRow {
  id: string;
  value: string;
}

function emptyAuditSchedule(): AuditScheduleRow {
  return {
    id: crypto.randomUUID(),
    date: '',
    heureDebut: '',
    heureFin: '',
  };
}

function emptyInterview(): InterviewRow {
  return {
    id: crypto.randomUUID(),
    processus: '',
    auditeurIds: [],
    auditeUserId: '',
    auditeNom: '',
    auditeEmail: '',
  };
}

function emptyDocument(): DocumentRow {
  return {
    id: crypto.randomUUID(),
    value: '',
  };
}

export function PlanAuditModal({
  isOpen,
  onClose,
  onSave,
  isPending,
  campaign,
}: Props) {
  const { data: users } = useUsers();
  const { data: auditors } = useAuditors(true);

  const [objectifSpecifique, setObjectifSpecifique] = useState('');
  const [auditSchedules, setAuditSchedules] = useState<AuditScheduleRow[]>([
    emptyAuditSchedule(),
  ]);
  const [auditeurPrincipalId, setAuditeurPrincipalId] = useState('');
  const [selectedAuditeurId, setSelectedAuditeurId] = useState('');
  const [auditeursIds, setAuditeursIds] = useState<string[]>([]);
  const [interviews, setInterviews] = useState<InterviewRow[]>([
    emptyInterview(),
  ]);
  const [documentsAExaminer, setDocumentsAExaminer] = useState<DocumentRow[]>([
    emptyDocument(),
  ]);

  const auditorOptions = useMemo<SelectOption[]>(() => {
    if (!auditors) {
      return [];
    }

    return auditors.map((auditor) => {
      const user = users?.find((item) => item.id === auditor.userId);
      return {
        value: auditor.userId,
        label: user
          ? `${user.firstName} ${user.lastName}`
          : (auditor.nomComplet ?? `Auditeur ${auditor.id.slice(0, 8)}`),
        description: user?.email ?? auditor.level,
      };
    });
  }, [auditors, users]);

  const auditeeUserOptions = useMemo<SelectOption[]>(
    () =>
      (users ?? []).map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
        description: user.email,
      })),
    [users],
  );

  const selectedAuditeurs = useMemo(
    () =>
      auditeursIds
        .map((id) => auditorOptions.find((option) => option.value === id))
        .filter(Boolean) as SelectOption[],
    [auditeursIds, auditorOptions],
  );

  const canSubmit =
    campaign.scopeId &&
    campaign.scopeType &&
    campaign.referentielNormatif &&
    auditeurPrincipalId &&
    auditSchedules.some((item) => item.date && item.heureDebut);

  const reset = () => {
    setObjectifSpecifique('');
    setAuditSchedules([emptyAuditSchedule()]);
    setAuditeurPrincipalId('');
    setSelectedAuditeurId('');
    setAuditeursIds([]);
    setInterviews([emptyInterview()]);
    setDocumentsAExaminer([emptyDocument()]);
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, campaign.id]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddAuditeur = () => {
    if (!selectedAuditeurId || auditeursIds.includes(selectedAuditeurId)) {
      return;
    }

    setAuditeursIds((prev) => [...prev, selectedAuditeurId]);
    setSelectedAuditeurId('');
  };

  const toggleInterviewAuditor = (rowId: string, auditorId: string) => {
    setInterviews((prev) =>
      prev.map((row) =>
        row.id !== rowId
          ? row
          : {
              ...row,
              auditeurIds: row.auditeurIds.includes(auditorId)
                ? row.auditeurIds.filter((id) => id !== auditorId)
                : [...row.auditeurIds, auditorId],
            },
      ),
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!campaign.scopeId || !campaign.scopeType || !campaign.referentielNormatif) {
      return;
    }

    const firstSchedule = auditSchedules.find((item) => item.date);
    const title = `Audit ${campaign.scopeLabel ?? campaign.titre} - ${firstSchedule?.date ?? ''}`;

    onSave({
      titre: title,
      type: 'INTERNE',
      perimetre: campaign.scopeLabel ?? campaign.titre,
      specificite: campaign.perimetre[0],
      scopeType: campaign.scopeType,
      scopeId: campaign.scopeId,
      referentielNormatif: campaign.referentielNormatif,
      datePrevisionnelle: firstSchedule?.date ?? '',
      heureOuverture: firstSchedule?.heureDebut || undefined,
      heureFermeture: firstSchedule?.heureFin || undefined,
      interviewsJson: JSON.stringify(
        interviews.filter(
          (item) =>
            item.processus ||
            item.auditeurIds.length > 0 ||
            item.auditeUserId ||
            item.auditeNom ||
            item.auditeEmail,
        ),
      ),
      objectifSpecifique: objectifSpecifique.trim() || undefined,
      auditSchedulesJson: JSON.stringify(
        auditSchedules.filter((item) => item.date || item.heureDebut || item.heureFin),
      ),
      documentsAExaminerJson: JSON.stringify(
        documentsAExaminer.map((item) => item.value.trim()).filter(Boolean),
      ),
      dureeJours: Math.max(
        1,
        auditSchedules.filter((item) => item.date).length,
      ),
      auditeurPrincipalId,
      auditeursIds,
    });
  };

  const domaineLabel =
    AUDIT_PROGRAM_DOMAINS.find((item) => item.domaine === campaign.perimetre[0])
      ?.label ?? campaign.perimetre[0];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Planifier un audit' size='xl'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-brand-700'>
            Contexte du programme
          </p>
          <div className='mt-2 flex flex-wrap items-center gap-2'>
            <span className='inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800'>
              {domaineLabel}
            </span>
            <span className='inline-flex rounded-full bg-white px-3 py-1 text-sm text-gray-700'>
              {campaign.referentielNormatif ?? '—'}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Input label='Spécificité' value={domaineLabel} readOnly />
          <Input
            label='Référentiel normatif'
            value={campaign.referentielNormatif ?? ''}
            readOnly
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Input
            label="Périmètre d'audit"
            value={campaign.scopeLabel ?? ''}
            readOnly
          />
          <Textarea
            label='Objectif global annuel'
            value={campaign.objectifsAudit ?? ''}
            readOnly
            disabled
          />
        </div>

        <Textarea
          label='Objectif spécifique'
          value={objectifSpecifique}
          onChange={(event) => setObjectifSpecifique(event.target.value)}
          placeholder="Préciser l'objectif spécifique de l'audit planifié"
        />

        <div className='rounded-xl border border-gray-200 p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-base font-semibold text-gray-900'>
              Date de l&apos;audit et heure
            </h3>
            <Button
              type='button'
              variant='secondary'
              onClick={() =>
                setAuditSchedules((prev) => [...prev, emptyAuditSchedule()])
              }>
              <Plus className='mr-2 h-4 w-4' />
              Ajouter une date
            </Button>
          </div>

          <div className='space-y-3'>
            {auditSchedules.map((schedule, index) => (
              <div
                key={schedule.id}
                className='grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-3 md:grid-cols-[1fr_140px_140px_auto]'>
                <DatePicker
                  label={`Date ${index + 1}`}
                  value={schedule.date}
                  onChange={(value) =>
                    setAuditSchedules((prev) =>
                      prev.map((item) =>
                        item.id === schedule.id ? { ...item, date: value } : item,
                      ),
                    )
                  }
                  required={index === 0}
                />
                <TimePicker
                  label='Heure début'
                  value={schedule.heureDebut}
                  onChange={(value) =>
                    setAuditSchedules((prev) =>
                      prev.map((item) =>
                        item.id === schedule.id
                          ? { ...item, heureDebut: value }
                          : item,
                      ),
                    )
                  }
                  required={index === 0}
                />
                <TimePicker
                  label='Heure fin'
                  value={schedule.heureFin}
                  onChange={(value) =>
                    setAuditSchedules((prev) =>
                      prev.map((item) =>
                        item.id === schedule.id
                          ? { ...item, heureFin: value }
                          : item,
                      ),
                    )
                  }
                />
                <div className='flex items-end justify-end'>
                  <Button
                    type='button'
                    variant='secondary'
                    disabled={auditSchedules.length === 1}
                    onClick={() =>
                      setAuditSchedules((prev) =>
                        prev.filter((item) => item.id !== schedule.id),
                      )
                    }>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 p-4'>
          <p className='mb-4 text-sm font-semibold text-gray-900'>Équipe d&apos;audit</p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]'>
            <Select
              label="Responsable d'audit (RA)"
              options={auditorOptions}
              value={auditeurPrincipalId}
              onChange={(event) => setAuditeurPrincipalId(event.target.value)}
              placeholder='Sélectionner le RA'
              searchable
              required
            />
            <Select
              label='Auditeurs'
              options={auditorOptions.filter(
                (option) =>
                  option.value !== auditeurPrincipalId &&
                  !auditeursIds.includes(option.value),
              )}
              value={selectedAuditeurId}
              onChange={(event) => setSelectedAuditeurId(event.target.value)}
              placeholder='Ajouter un auditeur'
              searchable
            />
            <div className='flex items-end'>
              <Button type='button' variant='secondary' onClick={handleAddAuditeur}>
                <Plus className='w-4 h-4 mr-1' />
                Ajouter
              </Button>
            </div>
          </div>

          {selectedAuditeurs.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {selectedAuditeurs.map((auditor) => (
                <span
                  key={auditor.value}
                  className='inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700'>
                  {auditor.label}
                  <button
                    type='button'
                    onClick={() =>
                      setAuditeursIds((prev) =>
                        prev.filter((id) => id !== auditor.value),
                      )
                    }
                    className='text-brand-500 hover:text-brand-700'>
                    <Trash2 className='w-3.5 h-3.5' />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className='rounded-xl border border-gray-200 p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-base font-semibold text-gray-900'>
              Interview par processus
            </h3>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setInterviews((prev) => [...prev, emptyInterview()])}>
              <Plus className='mr-2 h-4 w-4' />
              Ajouter une ligne
            </Button>
          </div>

          <div className='space-y-3'>
            {interviews.map((row, index) => (
              <div key={row.id} className='rounded-xl border border-gray-200 p-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    label={`Processus ${index + 1}`}
                    value={row.processus}
                    onChange={(event) =>
                      setInterviews((prev) =>
                        prev.map((item) =>
                          item.id === row.id
                            ? { ...item, processus: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder='Processus ou séquence auditée'
                  />
                  <Select
                    label='Audité (utilisateur interne)'
                    options={auditeeUserOptions}
                    value={row.auditeUserId}
                    onChange={(event) => {
                      const user = users?.find((item) => item.id === event.target.value);
                      setInterviews((prev) =>
                        prev.map((item) =>
                          item.id === row.id
                            ? {
                                ...item,
                                auditeUserId: event.target.value,
                                auditeNom: user
                                  ? `${user.firstName} ${user.lastName}`
                                  : item.auditeNom,
                                auditeEmail: user?.email ?? item.auditeEmail,
                              }
                            : item,
                        ),
                      );
                    }}
                    placeholder="Sélectionner un utilisateur"
                    searchable
                  />
                </div>

                <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Input
                    label='Nom de l’audité'
                    value={row.auditeNom}
                    onChange={(event) =>
                      setInterviews((prev) =>
                        prev.map((item) =>
                          item.id === row.id
                            ? { ...item, auditeNom: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder='Nom affiché de la personne auditée'
                  />
                  <Input
                    label='E-mail de l’audité'
                    type='email'
                    value={row.auditeEmail}
                    onChange={(event) =>
                      setInterviews((prev) =>
                        prev.map((item) =>
                          item.id === row.id
                            ? { ...item, auditeEmail: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder='email@entreprise.com'
                  />
                </div>

                <div className='mt-4'>
                  <p className='mb-2 text-sm font-medium text-gray-700'>
                    Auditeurs affectés (sélection multiple)
                  </p>
                  <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                    {auditorOptions.map((option) => (
                      <label
                        key={`${row.id}-${option.value}`}
                        className='flex items-start gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50'>
                        <input
                          type='checkbox'
                          checked={row.auditeurIds.includes(option.value)}
                          onChange={() =>
                            toggleInterviewAuditor(row.id, option.value)
                          }
                          className='mt-1 h-4 w-4 rounded border-gray-300 text-brand-500'
                        />
                        <span>
                          <span className='block text-sm font-medium text-gray-800'>
                            {option.label}
                          </span>
                          {option.description && (
                            <span className='block text-xs text-gray-500'>
                              {option.description}
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className='mt-4 flex justify-end'>
                  <Button
                    type='button'
                    variant='secondary'
                    disabled={interviews.length === 1}
                    onClick={() =>
                      setInterviews((prev) =>
                        prev.filter((item) => item.id !== row.id),
                      )
                    }>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-base font-semibold text-gray-900'>
              Liste des documents à examiner à l&apos;avance
            </h3>
            <Button
              type='button'
              variant='secondary'
              onClick={() =>
                setDocumentsAExaminer((prev) => [...prev, emptyDocument()])
              }>
              <Plus className='mr-2 h-4 w-4' />
              Ajouter un document
            </Button>
          </div>

          <div className='space-y-3'>
            {documentsAExaminer.map((document, index) => (
              <div
                key={document.id}
                className='grid grid-cols-[1fr_auto] gap-3'>
                <Input
                  label={`Document ${index + 1}`}
                  value={document.value}
                  onChange={(event) =>
                    setDocumentsAExaminer((prev) =>
                      prev.map((item) =>
                        item.id === document.id
                          ? { ...item, value: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder='Saisir le document à examiner'
                />
                <div className='flex items-end'>
                  <Button
                    type='button'
                    variant='secondary'
                    disabled={documentsAExaminer.length === 1}
                    onClick={() =>
                      setDocumentsAExaminer((prev) =>
                        prev.filter((item) => item.id !== document.id),
                      )
                    }>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' isLoading={isPending} disabled={!canSubmit}>
            Enregistrer la planification
          </Button>
        </div>
      </form>
    </Modal>
  );
}
