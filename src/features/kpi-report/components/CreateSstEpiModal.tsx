import { Button, Input, Modal, Select } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CreateSstEpiReportRequest } from '../sstTypes';

interface CreateSstEpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateSstEpiReportRequest) => void;
  isLoading: boolean;
}

const EMPTY_FORM: Omit<CreateSstEpiReportRequest, 'period' | 'responsibleName'> & {
  period: string;
  responsibleName: string;
} = {
  period: '',
  responsibleName: '',
  entreesTete: 0,
  sortiesTete: 0,
  rebutTete: 0,
  entreesMains: 0,
  sortiesMains: 0,
  rebutMains: 0,
  entreesPieds: 0,
  sortiesPieds: 0,
  rebutPieds: 0,
  epiEnService: 0,
  epiEnStockage: 0,
  epiEnReparation: 0,
  epiSansControle: 0,
  controlesConformes: 0,
  controlesA30j: 0,
  controlesRetard: 0,
  ptiDefectueux: 0,
};

function buildPeriodOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    options.push({ value, label });
  }
  return options;
}

const STOCK_ROWS = [
  {
    label: 'Protections Tête',
    entrees: 'entreesTete' as const,
    sorties: 'sortiesTete' as const,
    rebut: 'rebutTete' as const,
  },
  {
    label: 'Protections Mains',
    entrees: 'entreesMains' as const,
    sorties: 'sortiesMains' as const,
    rebut: 'rebutMains' as const,
  },
  {
    label: 'Protections Pieds',
    entrees: 'entreesPieds' as const,
    sorties: 'sortiesPieds' as const,
    rebut: 'rebutPieds' as const,
  },
];

export function CreateSstEpiModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateSstEpiModalProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formTopRef = useRef<HTMLDivElement>(null);

  const periodOptions = useMemo(() => buildPeriodOptions(), []);

  useEffect(() => {
    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const setField = <K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: (typeof EMPTY_FORM)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const setNumericField = (key: keyof typeof EMPTY_FORM, raw: string) => {
    const parsed = raw === '' ? 0 : parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      setField(key, parsed as never);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.period) newErrors.period = 'Requis';
    if (!formData.responsibleName.trim()) newErrors.responsibleName = 'Requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      showToast.error('Veuillez remplir tous les champs requis');
      return;
    }

    onSave({
      period: formData.period,
      responsibleName: formData.responsibleName.trim(),
      entreesTete: formData.entreesTete,
      sortiesTete: formData.sortiesTete,
      rebutTete: formData.rebutTete,
      entreesMains: formData.entreesMains,
      sortiesMains: formData.sortiesMains,
      rebutMains: formData.rebutMains,
      entreesPieds: formData.entreesPieds,
      sortiesPieds: formData.sortiesPieds,
      rebutPieds: formData.rebutPieds,
      epiEnService: formData.epiEnService,
      epiEnStockage: formData.epiEnStockage,
      epiEnReparation: formData.epiEnReparation,
      epiSansControle: formData.epiSansControle,
      controlesConformes: formData.controlesConformes,
      controlesA30j: formData.controlesA30j,
      controlesRetard: formData.controlesRetard,
      ptiDefectueux: formData.ptiDefectueux,
    });
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouveau rapport EPI' size='lg'>
      <form onSubmit={handleSubmit}>
        <div ref={formTopRef} className='space-y-6'>
          {/* Header: Period + Responsible */}
          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Période'
              required
              placeholder='Sélectionner une période'
              options={periodOptions}
              value={formData.period}
              onChange={(e) => setField('period', e.target.value)}
              error={errors.period}
            />
            <Input
              label='Responsable'
              required
              placeholder='Nom du responsable EPI'
              value={formData.responsibleName}
              onChange={(e) => setField('responsibleName', e.target.value)}
              error={errors.responsibleName}
            />
          </div>

          {/* Section 1: Mouvements de Stock */}
          <fieldset className='space-y-3'>
            <legend className='text-sm font-semibold text-gray-900 dark:text-white'>
              Mouvements de Stock
            </legend>
            <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
              {/* Table header */}
              <div className='grid grid-cols-4 bg-gray-50 dark:bg-gray-800/50 text-xs font-medium text-gray-500 dark:text-gray-400'>
                <div className='px-3 py-2'>Type</div>
                <div className='px-3 py-2 text-center'>Entrées Neufs</div>
                <div className='px-3 py-2 text-center'>Sorties Dotation</div>
                <div className='px-3 py-2 text-center'>Mis au rebut HS</div>
              </div>
              {/* Table rows */}
              {STOCK_ROWS.map((row) => (
                <div
                  key={row.label}
                  className='grid grid-cols-4 items-center border-t border-gray-100 dark:border-gray-700/50'>
                  <div className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300'>
                    {row.label}
                  </div>
                  <div className='px-2 py-1.5'>
                    <input
                      type='number'
                      min={0}
                      className='w-full text-center text-sm px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                      value={formData[row.entrees] || ''}
                      onChange={(e) => setNumericField(row.entrees, e.target.value)}
                    />
                  </div>
                  <div className='px-2 py-1.5'>
                    <input
                      type='number'
                      min={0}
                      className='w-full text-center text-sm px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                      value={formData[row.sorties] || ''}
                      onChange={(e) => setNumericField(row.sorties, e.target.value)}
                    />
                  </div>
                  <div className='px-2 py-1.5'>
                    <input
                      type='number'
                      min={0}
                      className='w-full text-center text-sm px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
                      value={formData[row.rebut] || ''}
                      onChange={(e) => setNumericField(row.rebut, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Section 2: État du Parc & Maintenance */}
          <fieldset className='space-y-3'>
            <legend className='text-sm font-semibold text-gray-900 dark:text-white'>
              État du Parc & Maintenance
            </legend>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='EPI en service'
                type='number'
                min={0}
                value={formData.epiEnService || ''}
                onChange={(e) => setNumericField('epiEnService', e.target.value)}
              />
              <Input
                label='EPI en stockage'
                type='number'
                min={0}
                value={formData.epiEnStockage || ''}
                onChange={(e) => setNumericField('epiEnStockage', e.target.value)}
              />
              <Input
                label='EPI en réparation'
                type='number'
                min={0}
                value={formData.epiEnReparation || ''}
                onChange={(e) => setNumericField('epiEnReparation', e.target.value)}
              />
              <Input
                label='EPI créés sans contrôle'
                type='number'
                min={0}
                value={formData.epiSansControle || ''}
                onChange={(e) => setNumericField('epiSansControle', e.target.value)}
              />
            </div>
          </fieldset>

          {/* Section 3: Registre des Contrôles Périodiques */}
          <fieldset className='space-y-3'>
            <legend className='text-sm font-semibold text-gray-900 dark:text-white'>
              Registre des Contrôles Périodiques
            </legend>
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Conformes après contrôle (Vert)'
                type='number'
                min={0}
                value={formData.controlesConformes || ''}
                onChange={(e) => setNumericField('controlesConformes', e.target.value)}
              />
              <Input
                label='À contrôler sous 30j (Orange)'
                type='number'
                min={0}
                value={formData.controlesA30j || ''}
                onChange={(e) => setNumericField('controlesA30j', e.target.value)}
              />
              <Input
                label='Date dépassée / Retard (Rouge)'
                type='number'
                min={0}
                value={formData.controlesRetard || ''}
                onChange={(e) => setNumericField('controlesRetard', e.target.value)}
              />
              <Input
                label='PTI défectueux'
                type='number'
                min={0}
                value={formData.ptiDefectueux || ''}
                onChange={(e) => setNumericField('ptiDefectueux', e.target.value)}
              />
            </div>
          </fieldset>
        </div>

        <div className='flex justify-end gap-3 pt-4'>
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
