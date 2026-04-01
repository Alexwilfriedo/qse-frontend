import { PageHeader } from '@/components/ui';
import CriticalityConfigTable from '@/features/risks/components/CriticalityConfigTable';
import ScaleEditor from '@/features/risks/components/ScaleEditor';
import { useState } from 'react';
import { ReferenceItemTable } from './components';
import type { ReferenceCategory } from './configurationApi';
import { REFERENCE_CATEGORY_LABELS } from './configurationApi';

const TABS: { key: string; label: string; categories: ReferenceCategory[] }[] =
  [
    {
      key: 'documents',
      label: 'Documents',
      categories: ['document-statuses'],
    },
    {
      key: 'actions',
      label: 'Actions',
      categories: [
        'action-types',
        'action-priorities',
        'action-origins',
        'action-statuses',
      ],
    },
    {
      key: 'audits',
      label: 'Audits',
      categories: ['audit-types', 'audit-statuses', 'campaign-statuses'],
    },
    {
      key: 'cartography',
      label: 'Cartographie',
      categories: ['process-types', 'entity-types', 'process-link-types'],
    },
    {
      key: 'risk-management',
      label: 'Gestion des risques',
      categories: [],
    },
    {
      key: 'incidents',
      label: 'Incidents',
      categories: [
        'incident-locations',
        'incident-immediate-consequences',
        'incident-trigger-factors',
      ],
    },
    {
      key: 'opportunities',
      label: 'Opportunités',
      categories: [
        'opportunity-origins',
        'opportunity-types',
        'opportunity-feasibility-levels',
        'opportunity-benefit-levels',
        'opportunity-score-levels',
      ],
    },
  ];

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const currentTab = TABS.find((t) => t.key === activeTab) ?? TABS[0];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Configuration'
        description='Paramétrage des valeurs de référence : types, statuts, priorités, couleurs'
      />

      {/* Tabs */}
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <nav className='flex gap-4'>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tables par catégorie */}
      <div className='space-y-6'>
        {activeTab === 'risk-management' ? (
          <>
            <ScaleEditor type='FREQUENCY' />
            <ScaleEditor type='SEVERITY' />
            <CriticalityConfigTable />
          </>
        ) : (
          currentTab.categories.map((category) => (
            <ReferenceItemTable
              key={category}
              category={category}
              categoryLabel={REFERENCE_CATEGORY_LABELS[category]}
            />
          ))
        )}
      </div>
    </div>
  );
}
