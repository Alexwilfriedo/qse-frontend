import { Button, Card, CardHeader, SkeletonTable } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCriticalityMatrix, useSaveCriticalityMatrix } from '../hooks/useRiskConfig';
import type { CriticalityLevel, SaveThresholdRequest } from '../types';

const LEVEL_LABELS: Record<CriticalityLevel, string> = {
  FAIBLE: 'Faible',
  MOYEN: 'Moyen',
  ELEVE: 'Élevé',
};

const DEFAULT_THRESHOLDS: SaveThresholdRequest[] = [
  { level: 'FAIBLE', minValue: 1, maxValue: 4, label: 'Faible', color: '#12b76a' },
  { level: 'MOYEN', minValue: 5, maxValue: 9, label: 'Moyen', color: '#f79009' },
  { level: 'ELEVE', minValue: 10, maxValue: 20, label: 'Élevé', color: '#f04438' },
];

export default function CriticalityMatrixEditor() {
  const { data: thresholds, isLoading } = useCriticalityMatrix();
  const saveMutation = useSaveCriticalityMatrix();

  const [form, setForm] = useState<SaveThresholdRequest[]>(DEFAULT_THRESHOLDS);

  useEffect(() => {
    if (thresholds && thresholds.length > 0) {
      setForm(thresholds.map((t) => ({
        level: t.level,
        minValue: t.minValue,
        maxValue: t.maxValue,
        label: t.label,
        color: t.color,
      })));
    }
  }, [thresholds]);

  const updateThreshold = (index: number, field: keyof SaveThresholdRequest, val: string | number) => {
    setForm((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: val } : t)));
  };

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(form);
      showToast.success('Matrice de criticité enregistrée');
    } catch {
      showToast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Matrice de Criticité (F × G)"
        action={
          <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="mr-1 h-4 w-4" />
            Enregistrer
          </Button>
        }
      />

      {isLoading ? (
        <SkeletonTable rows={3} columns={4} />
      ) : (
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Niveau</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Score Min</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Score Max</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Couleur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {form.map((threshold, idx) => (
              <tr key={threshold.level}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: threshold.color }}
                    />
                    <span className="text-sm font-medium">{LEVEL_LABELS[threshold.level]}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min={1}
                    value={threshold.minValue}
                    onChange={(e) => updateThreshold(idx, 'minValue', Number(e.target.value))}
                    className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min={1}
                    value={threshold.maxValue}
                    onChange={(e) => updateThreshold(idx, 'maxValue', Number(e.target.value))}
                    className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={threshold.color}
                      onChange={(e) => updateThreshold(idx, 'color', e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border"
                    />
                    <span className="font-mono text-xs text-gray-500">{threshold.color}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-700">
        La criticité est calculée par le produit Fréquence × Gravité. Les seuils définissent les zones vert/jaune/rouge de la matrice.
      </div>
    </Card>
  );
}
