import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { useEntityTree } from '@/features/cartography/hooks/useEntityTree';
import type { EntityTreeNode } from '@/features/cartography/types';
import { showToast } from '@/lib/toast';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SST_EVENT_TYPES } from '../sstTypes';
import type { CreateSstMonthlyReportRequest } from '../sstTypes';

interface CreateSstMonthlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateSstMonthlyReportRequest) => void;
  isLoading: boolean;
}

interface EventEntry {
  key: string;
  count: string;
  comment: string;
}

interface ServiceEventEntry {
  entityId: string;
  entityName: string;
  eventCount: string;
}

const EMPTY_SERVICE_EVENT: ServiceEventEntry = {
  entityId: '',
  entityName: '',
  eventCount: '',
};

function buildPeriodOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const value = `${year}-${month}`;
    const label = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return options;
}

function buildInitialEvents(): EventEntry[] {
  return SST_EVENT_TYPES.map((evt) => ({
    key: evt.key,
    count: '0',
    comment: '',
  }));
}

export function CreateSstMonthlyModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateSstMonthlyModalProps) {
  const [period, setPeriod] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [events, setEvents] = useState<EventEntry[]>(buildInitialEvents);
  const [serviceEvents, setServiceEvents] = useState<ServiceEventEntry[]>([]);
  const [heuresTravaillees, setHeuresTravaillees] = useState('');
  const [pctActionsRealisees, setPctActionsRealisees] = useState('');
  const [pctConformiteEpi, setPctConformiteEpi] = useState('');
  const [nbInspectionsTerrain, setNbInspectionsTerrain] = useState('');
  const [tauxParticipationCauseries, setTauxParticipationCauseries] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formTopRef = useRef<HTMLDivElement>(null);
  const { data: entityTree } = useEntityTree();

  const periodOptions = useMemo(() => buildPeriodOptions(), []);

  const flattenEntities = (nodes: EntityTreeNode[]): { value: string; label: string }[] =>
    nodes.flatMap((node) => [
      { value: node.id, label: node.nom },
      ...flattenEntities(node.children),
    ]);

  const entityOptions = useMemo(
    () => (entityTree ? flattenEntities(entityTree) : []),
    [entityTree],
  );

  // ── Auto-calculated TF and TG ──
  const accidentsAvecArret = Number(events.find((e) => e.key === 'accidentsAvecArret')?.count) || 0;
  const joursArrets = Number(events.find((e) => e.key === 'joursArrets')?.count) || 0;
  const heures = Number(heuresTravaillees) || 0;

  const tauxFrequence = heures > 0 ? ((accidentsAvecArret * 1_000_000) / heures) : null;
  const tauxGravite = heures > 0 ? ((joursArrets * 1_000) / heures) : null;

  // ── Reset form on close ──
  useEffect(() => {
    if (!isOpen) {
      setPeriod('');
      setEntryDate('');
      setEvents(buildInitialEvents());
      setServiceEvents([]);
      setHeuresTravaillees('');
      setPctActionsRealisees('');
      setPctConformiteEpi('');
      setNbInspectionsTerrain('');
      setTauxParticipationCauseries('');
      setErrors({});
    }
  }, [isOpen]);

  // ── Service events CRUD ──
  const addServiceEvent = () => {
    setServiceEvents((prev) => [...prev, { ...EMPTY_SERVICE_EVENT }]);
  };

  const removeServiceEvent = (index: number) => {
    setServiceEvents((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServiceEvent = (index: number, field: keyof ServiceEventEntry, value: string) => {
    setServiceEvents((prev) =>
      prev.map((se, i) => {
        if (i !== index) return se;
        if (field === 'entityId') {
          const opt = entityOptions.find((o) => o.value === value);
          return { ...se, entityId: value, entityName: opt?.label ?? '' };
        }
        return { ...se, [field]: value };
      }),
    );
  };

  // ── Events update ──
  const updateEvent = (key: string, field: 'count' | 'comment', value: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.key === key ? { ...e, [field]: value } : e)),
    );
  };

  // ── Validation ──
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!period) newErrors.period = 'Requis';
    if (!entryDate) newErrors.entryDate = 'Requis';
    if (!heuresTravaillees || Number(heuresTravaillees) <= 0) {
      newErrors.heuresTravaillees = 'Requis (> 0)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      showToast.error('Veuillez remplir tous les champs requis');
      return;
    }

    const eventMap = Object.fromEntries(events.map((ev) => [ev.key, ev]));

    const data: CreateSstMonthlyReportRequest = {
      period,
      entryDate,
      accidentsTrajet: Number(eventMap.accidentsTrajet.count) || 0,
      accidentsTrajetComment: eventMap.accidentsTrajet.comment || undefined,
      fatalites: Number(eventMap.fatalites.count) || 0,
      fatalitesComment: eventMap.fatalites.comment || undefined,
      accidentsAvecArret: Number(eventMap.accidentsAvecArret.count) || 0,
      accidentsAvecArretComment: eventMap.accidentsAvecArret.comment || undefined,
      accidentsSansArret: Number(eventMap.accidentsSansArret.count) || 0,
      accidentsSansArretComment: eventMap.accidentsSansArret.comment || undefined,
      presquaccidents: Number(eventMap.presquaccidents.count) || 0,
      presquaccidentsComment: eventMap.presquaccidents.comment || undefined,
      joursArrets: Number(eventMap.joursArrets.count) || 0,
      joursArretsComment: eventMap.joursArrets.comment || undefined,
      heuresTravaillees: Number(heuresTravaillees),
      pctActionsRealisees: pctActionsRealisees ? Number(pctActionsRealisees) : undefined,
      pctConformiteEpi: pctConformiteEpi ? Number(pctConformiteEpi) : undefined,
      nbInspectionsTerrain: nbInspectionsTerrain ? Number(nbInspectionsTerrain) : undefined,
      tauxParticipationCauseries: tauxParticipationCauseries
        ? Number(tauxParticipationCauseries)
        : undefined,
      serviceEvents:
        serviceEvents.length > 0
          ? serviceEvents
              .filter((se) => se.entityId && Number(se.eventCount) > 0)
              .map((se) => ({
                entityId: se.entityId,
                entityName: se.entityName,
                eventCount: Number(se.eventCount),
              }))
          : undefined,
    };

    onSave(data);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouveau rapport mensuel SST' size='xl'>
      <form onSubmit={handleSubmit}>
        <div ref={formTopRef} className='space-y-6'>
          {/* Period & Date */}
          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Période'
              required
              placeholder='Sélectionner un mois'
              options={periodOptions}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              error={errors.period}
            />
            <DatePicker
              label="Date de saisie"
              required
              value={entryDate}
              onChange={setEntryDate}
              error={errors.entryDate}
            />
          </div>

          {/* ── Section 1: Bilan des événements ── */}
          <fieldset className='space-y-3'>
            <legend className='text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 w-full'>
              1. Bilan des événements
            </legend>
            {SST_EVENT_TYPES.map((evt) => {
              const entry = events.find((e) => e.key === evt.key);
              if (!entry) return null;

              return (
                <div key={evt.key} className='grid grid-cols-12 gap-3 items-end'>
                  <div className='col-span-5'>
                    <label className='block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                      {evt.label}
                    </label>
                  </div>
                  <div className='col-span-2'>
                    <Input
                      type='number'
                      min={0}
                      placeholder='0'
                      value={entry.count}
                      onChange={(e) => updateEvent(evt.key, 'count', e.target.value)}
                    />
                  </div>
                  <div className='col-span-5'>
                    <Input
                      placeholder='Commentaire...'
                      value={entry.comment}
                      onChange={(e) => updateEvent(evt.key, 'comment', e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </fieldset>

          {/* ── Section 2: Répartition par service ── */}
          <fieldset className='space-y-3'>
            <legend className='text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 w-full'>
              2. Répartition par service
            </legend>

            {serviceEvents.map((se, index) => (
              <div key={index} className='grid grid-cols-12 gap-3 items-end'>
                <div className='col-span-6'>
                  <Select
                    label={index === 0 ? 'Service / Entité' : undefined}
                    placeholder='Sélectionner'
                    searchable
                    options={entityOptions}
                    value={se.entityId}
                    onChange={(e) => updateServiceEvent(index, 'entityId', e.target.value)}
                  />
                </div>
                <div className='col-span-4'>
                  <Input
                    label={index === 0 ? "Nb d'événements" : undefined}
                    type='number'
                    min={0}
                    placeholder='0'
                    value={se.eventCount}
                    onChange={(e) => updateServiceEvent(index, 'eventCount', e.target.value)}
                  />
                </div>
                <div className='col-span-2 flex justify-center'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeServiceEvent(index)}
                    className='text-red-500 hover:text-red-700'>
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type='button'
              variant='ghost'
              size='sm'
              leftIcon={<Plus className='w-4 h-4' />}
              onClick={addServiceEvent}>
              Ajouter un service
            </Button>
          </fieldset>

          {/* ── Section 3: Performance & Taux ── */}
          <fieldset className='space-y-4'>
            <legend className='text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 w-full'>
              3. Performance & Taux
            </legend>

            <Input
              label='Heures travaillées'
              required
              type='number'
              min={1}
              placeholder='Ex : 45000'
              value={heuresTravaillees}
              onChange={(e) => setHeuresTravaillees(e.target.value)}
              error={errors.heuresTravaillees}
            />

            {/* Auto-calculated rates */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Taux de Fréquence (TF)
                </label>
                <div className='px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300'>
                  {tauxFrequence !== null ? tauxFrequence.toFixed(2) : '—'}
                </div>
                <p className='mt-1 text-xs text-gray-400'>
                  (Acc. avec arrêt x 1 000 000) / Heures
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Taux de Gravité (TG)
                </label>
                <div className='px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300'>
                  {tauxGravite !== null ? tauxGravite.toFixed(2) : '—'}
                </div>
                <p className='mt-1 text-xs text-gray-400'>
                  (Jours d'arrêt x 1 000) / Heures
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='% Actions réalisées'
                type='number'
                min={0}
                max={100}
                placeholder='Ex : 90'
                value={pctActionsRealisees}
                onChange={(e) => setPctActionsRealisees(e.target.value)}
              />
              <Input
                label='% Conformité EPI'
                type='number'
                min={0}
                max={100}
                placeholder='Ex : 95'
                value={pctConformiteEpi}
                onChange={(e) => setPctConformiteEpi(e.target.value)}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Nb inspections terrain'
                type='number'
                min={0}
                placeholder='Ex : 4'
                value={nbInspectionsTerrain}
                onChange={(e) => setNbInspectionsTerrain(e.target.value)}
              />
              <Input
                label='Taux participation causeries (%)'
                type='number'
                min={0}
                max={100}
                placeholder='Ex : 80'
                value={tauxParticipationCauseries}
                onChange={(e) => setTauxParticipationCauseries(e.target.value)}
              />
            </div>
          </fieldset>
        </div>

        <div className='flex justify-end gap-3 pt-6'>
          <Button type='button' variant='secondary' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
