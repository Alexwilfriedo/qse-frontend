import { PageHeader } from '@/components/ui';
import { useState } from 'react';
import { ScaleEditor, CriticalityMatrixEditor, CatalogManager } from './components';
import type { CatalogType } from './types';

const TABS = [
  { key: 'scales', label: 'Échelles' },
  { key: 'matrix', label: 'Matrice de Criticité' },
  { key: 'catalogs', label: 'Catalogues' },
] as const;

const CATALOG_TYPES: CatalogType[] = ['WORK_UNIT', 'DANGER_TYPE', 'ENVIRONMENTAL_ASPECT', 'RISK_FAMILY'];

type TabKey = (typeof TABS)[number]['key'];

export default function RiskConfigPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('scales');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration des Risques"
        description="Paramétrage du référentiel : échelles d'évaluation, matrice de criticité et catalogues"
      />

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {activeTab === 'scales' && (
          <>
            <ScaleEditor type="FREQUENCY" />
            <ScaleEditor type="SEVERITY" />
            <ScaleEditor type="MASTERY" />
          </>
        )}

        {activeTab === 'matrix' && <CriticalityMatrixEditor />}

        {activeTab === 'catalogs' &&
          CATALOG_TYPES.map((ct) => <CatalogManager key={ct} catalogType={ct} />)}
      </div>
    </div>
  );
}
