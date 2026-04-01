import { Button, DatePicker, FileDropzone, Input, Modal, Select } from '@/components/ui';
import { useEntityTree } from '@/features/cartography/hooks/useEntityTree';
import type { EntityTreeNode } from '@/features/cartography/types';
import { showToast } from '@/lib/toast';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AES_AXES } from '../aesTypes';
import type { AesAxisCode, CreateAesMeasurementRequest } from '../aesTypes';

interface CreateAesMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateAesMeasurementRequest, proofFile?: File | null) => void;
  isLoading: boolean;
}

const UNIT_OPTIONS = [
  { value: '%', label: '%' },
  { value: 'Unité', label: 'Unité' },
];

const AXIS_OPTIONS = AES_AXES.map((a) => ({
  value: a.code,
  label: a.label,
}));

const EMPTY_FORM = {
  dateMesure: '',
  siteId: '',
  siteName: '',
  axisCode: '' as AesAxisCode | '',
  indicatorName: '',
  realizedValue: '',
  targetValue: '',
  unit: '',
};

export function CreateAesMeasurementModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateAesMeasurementModalProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formTopRef = useRef<HTMLDivElement>(null);
  const { data: entityTree } = useEntityTree();

  const flattenSites = (nodes: EntityTreeNode[]): { value: string; label: string }[] =>
    nodes.flatMap((node) => [
      ...(node.type === 'SITE' ? [{ value: node.id, label: node.nom }] : []),
      ...flattenSites(node.children),
    ]);

  const siteOptions = useMemo(
    () => (entityTree ? flattenSites(entityTree) : []),
    [entityTree],
  );

  // Auto-fill indicator and target when axis changes
  const selectedAxis = useMemo(
    () => AES_AXES.find((a) => a.code === formData.axisCode),
    [formData.axisCode],
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setProofFile(null);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.dateMesure) newErrors.dateMesure = 'Requis';
    if (!formData.siteId) newErrors.siteId = 'Requis';
    if (!formData.axisCode) newErrors.axisCode = 'Requis';
    if (!formData.indicatorName.trim()) newErrors.indicatorName = 'Requis';
    if (formData.realizedValue === '') newErrors.realizedValue = 'Requis';
    if (formData.targetValue === '') newErrors.targetValue = 'Requis';
    if (!formData.unit) newErrors.unit = 'Requis';
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

    onSave(
      {
        dateMesure: formData.dateMesure,
        siteId: formData.siteId,
        siteName: formData.siteName,
        axisCode: formData.axisCode as AesAxisCode,
        indicatorName: formData.indicatorName,
        realizedValue: Number(formData.realizedValue),
        targetValue: Number(formData.targetValue),
        unit: formData.unit,
      },
      proofFile,
    );
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setProofFile(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouvelle mesure AES' size='lg'>
      <form onSubmit={handleSubmit}>
        <div ref={formTopRef} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <DatePicker
              label='Date'
              required
              value={formData.dateMesure}
              onChange={(v) => setFormData((p) => ({ ...p, dateMesure: v }))}
              error={errors.dateMesure}
            />
            <Select
              label='Site'
              required
              searchable
              placeholder='Sélectionner un site'
              options={siteOptions}
              value={formData.siteId}
              onChange={(e) => {
                const opt = siteOptions.find((o) => o.value === e.target.value);
                setFormData((p) => ({
                  ...p,
                  siteId: e.target.value,
                  siteName: opt?.label ?? '',
                }));
              }}
              error={errors.siteId}
            />
          </div>

          <Select
            label='Axe de la Norme'
            required
            placeholder='Sélectionner un axe'
            options={AXIS_OPTIONS}
            value={formData.axisCode}
            onChange={(e) => {
              const axis = AES_AXES.find((a) => a.code === e.target.value);
              setFormData((p) => ({
                ...p,
                axisCode: e.target.value as AesAxisCode,
                indicatorName: axis?.defaultIndicator ?? p.indicatorName,
                targetValue: axis ? String(axis.defaultTarget) : p.targetValue,
                unit: axis?.defaultUnit ?? p.unit,
              }));
            }}
            error={errors.axisCode}
          />

          <Input
            label='Indicateur (KPI)'
            required
            value={formData.indicatorName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, indicatorName: e.target.value }))
            }
            error={errors.indicatorName}
            hint={selectedAxis ? `Par défaut : ${selectedAxis.defaultIndicator}` : undefined}
          />

          <div className='grid grid-cols-3 gap-4'>
            <Input
              label='Valeur Réalisée'
              required
              type='number'
              value={formData.realizedValue}
              onChange={(e) =>
                setFormData((p) => ({ ...p, realizedValue: e.target.value }))
              }
              error={errors.realizedValue}
            />
            <Input
              label='Objectif Cible'
              required
              type='number'
              value={formData.targetValue}
              onChange={(e) =>
                setFormData((p) => ({ ...p, targetValue: e.target.value }))
              }
              error={errors.targetValue}
            />
            <Select
              label='Unité de mesure'
              required
              placeholder='Sélectionner'
              options={UNIT_OPTIONS}
              value={formData.unit}
              onChange={(e) =>
                setFormData((p) => ({ ...p, unit: e.target.value }))
              }
              error={errors.unit}
            />
          </div>

          {/* Statut auto-calculé */}
          {formData.realizedValue !== '' && formData.targetValue !== '' && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                Statut :
              </span>
              {(() => {
                const realized = Number(formData.realizedValue);
                const target = Number(formData.targetValue);
                if (realized >= target) {
                  return (
                    <span className='inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400'>
                      Conforme
                    </span>
                  );
                }
                if (realized >= target * 0.8) {
                  return (
                    <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-400'>
                      À surveiller
                    </span>
                  );
                }
                return (
                  <span className='inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400'>
                    Non conforme
                  </span>
                );
              })()}
            </div>
          )}

          <FileDropzone
            label='Preuve (photo, bordereau, document)'
            accept='.pdf,.png,.jpg,.jpeg,.doc,.docx'
            hint='PDF, images ou documents — max 10 Mo'
            value={proofFile}
            onChange={setProofFile}
          />
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
