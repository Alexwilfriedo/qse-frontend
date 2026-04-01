import {
  Badge,
  Button,
  Card,
  CardHeader,
  DatePicker,
  Input,
  Select,
} from '@/components/ui';
import { useProcessMap } from '@/features/cartography/hooks';
import { AlertTriangle, ExternalLink, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSetProcessusLink, useSetReferenceExterne } from '../hooks';
import type { Document } from '../types';

interface ExternalDocumentPanelProps {
  document: Document;
}

/**
 * Panel pour gérer les métadonnées spécifiques aux documents externes (M2.5).
 * Permet de définir la référence externe, lier à un processus, et voir la date de validité.
 */
export function ExternalDocumentPanel({
  document,
}: ExternalDocumentPanelProps) {
  const [refExterne, setRefExterne] = useState(document.referenceExterne ?? '');
  const [processusId, setProcessusId] = useState(document.processusId ?? '');
  const [dateValidite, setDateValidite] = useState(document.dateValidite ?? '');

  const setRefMutation = useSetReferenceExterne();
  const setLinkMutation = useSetProcessusLink();
  const { data: processMap } = useProcessMap();

  const allProcesses = useMemo(() => {
    if (!processMap) return [];
    return [
      ...processMap.management,
      ...processMap.realisation,
      ...processMap.support,
    ];
  }, [processMap]);

  const linkedProcess = allProcesses.find((p) => p.id === document.processusId);

  const isValidityExpiring = useMemo(() => {
    if (!document.dateValidite) return false;
    const daysLeft = Math.ceil(
      (new Date(document.dateValidite).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    );
    return daysLeft <= 30;
  }, [document.dateValidite]);

  const isValidityExpired = useMemo(() => {
    if (!document.dateValidite) return false;
    return new Date(document.dateValidite) < new Date();
  }, [document.dateValidite]);

  const handleSaveReference = () => {
    setRefMutation.mutate({ id: document.id, referenceExterne: refExterne });
  };

  const handleSaveLink = () => {
    setLinkMutation.mutate({
      id: document.id,
      processusId: processusId || null,
      dateValidite: dateValidite || null,
    });
  };

  return (
    <Card>
      <CardHeader
        title='Document externe'
        description='Référence, processus lié et validité'
      />
      <div className='p-6 pt-0 space-y-5'>
        {/* Badges d'alerte validité */}
        {isValidityExpired && (
          <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <AlertTriangle className='w-4 h-4 text-red-500' />
            <span className='text-sm font-medium text-red-700 dark:text-red-400'>
              Date de validité dépassée — révision requise
            </span>
          </div>
        )}
        {isValidityExpiring && !isValidityExpired && (
          <div className='flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg'>
            <AlertTriangle className='w-4 h-4 text-amber-500' />
            <span className='text-sm font-medium text-amber-700 dark:text-amber-400'>
              Validité expire dans moins de 30 jours
            </span>
          </div>
        )}

        {/* Référence externe */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            <ExternalLink className='w-3.5 h-3.5 inline mr-1' />
            Référence externe (norme, loi, FDS)
          </label>
          <div className='flex gap-2'>
            <Input
              value={refExterne}
              onChange={(e) => setRefExterne(e.target.value)}
              placeholder='Ex: ISO 45001:2018, FDS-2024-042'
              className='flex-1'
            />
            <Button
              variant='secondary'
              onClick={handleSaveReference}
              disabled={
                setRefMutation.isPending ||
                refExterne === (document.referenceExterne ?? '')
              }>
              <Save className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Lien processus */}
        <Select
          label='Processus lie'
          placeholder='Aucun processus'
          clearable
          options={allProcesses.map((p) => ({
            value: p.id,
            label: p.codification ? `${p.codification} — ${p.nom}` : p.nom,
          }))}
          value={processusId}
          onChange={(e) => setProcessusId(e.target.value)}
          hint={
            linkedProcess
              ? `Processus actuel : ${linkedProcess.nom}`
              : undefined
          }
        />

        {/* Date de validité */}
        <DatePicker
          label='Date de validité'
          value={dateValidite}
          onChange={setDateValidite}
          clearable
        />

        {/* Bouton sauvegarde lien + validité */}
        <div className='flex justify-end'>
          <Button
            onClick={handleSaveLink}
            disabled={
              setLinkMutation.isPending ||
              (processusId === (document.processusId ?? '') &&
                dateValidite === (document.dateValidite ?? ''))
            }>
            <Save className='w-4 h-4 mr-2' />
            Enregistrer lien & validité
          </Button>
        </div>

        {/* Infos actuelles */}
        {document.referenceExterne && (
          <div className='flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700'>
            <Badge variant='info'>Référence</Badge>
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              {document.referenceExterne}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
