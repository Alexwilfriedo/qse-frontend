import { Button, DatePicker, Input, Modal, Select, Textarea, TimePicker } from '@/components/ui';
import { useProcessMap, useWorkUnits } from '@/features/cartography/hooks';
import { useReferenceItems } from '@/features/configuration/hooks';
import { useEffect, useMemo, useState } from 'react';
import type { CreateIncidentRequest, Domaine, IncidentType } from '../types';

const DOMAINE_OPTIONS = [
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
  { value: 'QUALITE', label: 'Qualité' },
];

const QUALITY_TYPE_OPTIONS = [
  { value: 'INCIDENT', label: 'Incident' },
  { value: 'NON_CONFORMITE', label: 'Non-conformité' },
  { value: 'OPPORTUNITE', label: 'Opportunité' },
];

const HSE_TYPE_OPTIONS = [
  { value: 'ACCIDENT_AVEC_ARRET', label: 'Accident avec Arrêt' },
  { value: 'ACCIDENT_SANS_ARRET', label: 'Accident sans Arrêt' },
  { value: 'INCIDENT', label: 'Incident' },
  { value: 'PRESQU_ACCIDENT', label: "Presqu'accident" },
];

function formatDatePart(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimePart(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIncidentRequest) => void;
  isPending: boolean;
}

export default function IncidentFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: Props) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domaine, setDomaine] = useState<Domaine>('SECURITE');
  const [incidentType, setIncidentType] = useState<IncidentType>(
    'ACCIDENT_AVEC_ARRET',
  );
  const [incidentDate, setIncidentDate] = useState(formatDatePart(new Date()));
  const [incidentTime, setIncidentTime] = useState(formatTimePart(new Date()));
  const [processusId, setProcessusId] = useState('');
  const [workUnitId, setWorkUnitId] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [immediateConsequence, setImmediateConsequence] = useState('');
  const [triggerFactor, setTriggerFactor] = useState('');
  const [conservativeMeasures, setConservativeMeasures] = useState('');

  const { data: workUnits } = useWorkUnits();
  const { data: processMap } = useProcessMap();
  const { data: locationItems } = useReferenceItems('incident-locations', true);
  const { data: consequenceItems } = useReferenceItems(
    'incident-immediate-consequences',
    true,
  );
  const { data: triggerFactorItems } = useReferenceItems(
    'incident-trigger-factors',
    true,
  );

  const processOptions = useMemo(
    () =>
      processMap
        ? [...processMap.management, ...processMap.realisation, ...processMap.support]
            .map((process) => ({
              value: process.id,
              label: `${process.codification} - ${process.nom}`,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
        : [],
    [processMap],
  );

  const workUnitOptions = useMemo(
    () =>
      workUnits
        ?.map((workUnit) => ({
          value: workUnit.id,
          label: `${workUnit.code} - ${workUnit.name}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr')) ?? [],
    [workUnits],
  );

  const locationOptions =
    locationItems?.map((item) => ({ value: item.code, label: item.label })) ?? [];
  const consequenceOptions =
    consequenceItems?.map((item) => ({ value: item.code, label: item.label })) ?? [];
  const triggerFactorOptions =
    triggerFactorItems?.map((item) => ({ value: item.code, label: item.label })) ?? [];

  const incidentTypeOptions = useMemo(
    () => (domaine === 'QUALITE' ? QUALITY_TYPE_OPTIONS : HSE_TYPE_OPTIONS),
    [domaine],
  );

  useEffect(() => {
    const defaultType: IncidentType =
      domaine === 'QUALITE' ? 'INCIDENT' : 'ACCIDENT_AVEC_ARRET';

    setIncidentType((prev) =>
      incidentTypeOptions.some((option) => option.value === prev) ? prev : defaultType,
    );
    setProcessusId('');
    setWorkUnitId('');
  }, [domaine, incidentTypeOptions]);

  useEffect(() => {
    if (!isOpen) return;
    setCode('');
    setTitle('');
    setDescription('');
    setDomaine('SECURITE');
    setIncidentType('ACCIDENT_AVEC_ARRET');
    setIncidentDate(formatDatePart(new Date()));
    setIncidentTime(formatTimePart(new Date()));
    setProcessusId('');
    setWorkUnitId('');
    setLocation('');
    setLocationDetails('');
    setImmediateConsequence('');
    setTriggerFactor('');
    setConservativeMeasures('');
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code,
      title,
      description: description || undefined,
      domaine,
      incidentType,
      processusId: domaine === 'QUALITE' ? processusId || undefined : undefined,
      workUnitId: domaine !== 'QUALITE' ? workUnitId || undefined : undefined,
      incidentDate: `${incidentDate}T${incidentTime}`,
      location: location || undefined,
      locationDetails: locationDetails || undefined,
      immediateConsequence: immediateConsequence || undefined,
      triggerFactor: triggerFactor || undefined,
      conservativeMeasures: conservativeMeasures || undefined,
      severity: 1,
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Déclarer un incident'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-3 gap-4'>
          <Input
            label='Code'
            placeholder='INC-SST-001'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <DatePicker
            label='Date'
            value={incidentDate}
            onChange={(v) => setIncidentDate(v)}
            required
          />
          <TimePicker
            label='Heure'
            value={incidentTime}
            onChange={(v) => setIncidentTime(v)}
            required
          />
        </div>

        <Input
          label='Titre'
          placeholder="Intitulé de l'incident"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          label='Description'
          placeholder='Détails...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Spécificité'
            required
            options={DOMAINE_OPTIONS}
            value={domaine}
            onChange={(e) => setDomaine(e.target.value as Domaine)}
          />
          <Select
            label='Type'
            required
            options={incidentTypeOptions}
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value as IncidentType)}
          />
        </div>

        {domaine === 'QUALITE' ? (
          <Select
            label='Processus'
            required
            options={processOptions}
            value={processusId}
            onChange={(e) => setProcessusId(e.target.value)}
            placeholder='Sélectionner un processus'
          />
        ) : (
          <Select
            label='Unité de travail'
            required
            options={workUnitOptions}
            value={workUnitId}
            onChange={(e) => setWorkUnitId(e.target.value)}
            placeholder='Sélectionner une unité de travail'
          />
        )}

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Localisation'
            required
            options={locationOptions}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Sélectionner une localisation'
          />
          <Input
            label='Details (localisation)'
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
            placeholder='Préciser la localisation'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Conséquence immédiate'
            required
            options={consequenceOptions}
            value={immediateConsequence}
            onChange={(e) => setImmediateConsequence(e.target.value)}
            placeholder='Sélectionner une conséquence'
          />
          <Select
            label='Facteur déclencheur'
            required
            options={triggerFactorOptions}
            value={triggerFactor}
            onChange={(e) => setTriggerFactor(e.target.value)}
            placeholder='Sélectionner un facteur'
          />
        </div>

        <Textarea
          label='Mesures conservatoires'
          value={conservativeMeasures}
          onChange={(e) => setConservativeMeasures(e.target.value)}
          rows={3}
          placeholder='Décrire les mesures conservatoires'
        />

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={
              isPending ||
              !code ||
              !title ||
              !incidentDate ||
              !incidentTime ||
              !location ||
              !immediateConsequence ||
              !triggerFactor ||
              (domaine === 'QUALITE' ? !processusId : !workUnitId)
            }>
            {isPending ? 'Création...' : 'Déclarer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
