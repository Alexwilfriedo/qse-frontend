import { CommandPalette } from '@/components/ui';
import { useAuthStore } from '@/features/auth/authStore';
import { useAuth } from '@/features/auth/useAuth';
import { NotificationBell } from '@/features/notifications';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface NavLeaf {
  name: string;
  href: string;
}

interface NavChild {
  name: string;
  href?: string;
  children?: NavLeaf[];
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  {
    name: 'Cartographie & Pilotage',
    icon: MapIcon,
    children: [
      { name: 'Organigramme', href: '/cartographie/organigramme' },
      { name: 'Cartographie des Processus', href: '/cartographie/processus' },
      { name: 'Unités de travail', href: '/cartographie/unites-travail' },
    ],
  },
  {
    name: 'Contexte & Stratégie',
    icon: StrategyIcon,
    children: [
      { name: "Vue d'ensemble", href: '/strategy' },
      {
        name: 'Analyse du Contexte',
        children: [
          { name: 'Analyse PESTEL', href: '/strategy/context/pestel' },
          { name: 'Analyse SWOT', href: '/strategy/context/swot' },
          { name: 'Registre des Enjeux', href: '/strategy/context/enjeux' },
        ],
      },
      {
        name: 'Parties Intéressées',
        children: [
          { name: 'Cartographie des PII', href: '/strategy/stakeholders' },
          {
            name: 'Matrice Besoins & Attentes',
            href: '/strategy/stakeholders/matrix',
          },
        ],
      },
      {
        name: 'Direction et Vision',
        children: [
          { name: 'Politique QSE', href: '/strategy/direction/politique-qse' },
          {
            name: "Lettre d'Engagement",
            href: '/strategy/direction/lettre-engagement',
          },
          {
            name: 'Vision et Valeurs',
            href: '/strategy/direction/vision-valeurs',
          },
          { name: 'Organigramme', href: '/strategy/direction/organigramme' },
        ],
      },
      {
        name: 'Planification Stratégique',
        children: [
          {
            name: 'Objectifs Stratégiques',
            href: '/strategy/planning/objectives',
          },
          {
            name: "Plan d'Actions Stratégiques",
            href: '/strategy/planning/plan-actions',
          },
          {
            name: 'Risques & Opportunités',
            href: '/strategy/planning/risques-opportunites',
          },
        ],
      },
      {
        name: 'Structure du Système',
        children: [
          {
            name: "Domaine d'Application",
            href: '/strategy/structure/domaine',
          },
          {
            name: 'Cartographie des Processus',
            href: '/strategy/structure/cartography',
          },
        ],
      },
      {
        name: 'Veille et Conformité',
        children: [
          {
            name: 'Veille Réglementaire',
            href: '/strategy/regulatory',
          },
        ],
      },
    ],
  },
  { name: 'Documents GED', href: '/documents', icon: DocumentIcon },
  {
    name: 'Risques QSE',
    icon: RiskIcon,
    children: [
      { name: 'Registre des risques', href: '/risks' },
      { name: 'Matrice de criticité', href: '/risks/matrix' },
      { name: 'Incidents', href: '/incidents' },
      { name: 'DUERP', href: '/risks/reports/duerp' },
      {
        name: 'Analyse environnementale',
        href: '/risks/reports/environmental',
      },
      { name: 'Carto. risques processus', href: '/risks/reports/process-map' },
      { name: 'Opportunités', href: '/risks/opportunities' },
    ],
  },
  {
    name: 'Audit QSE',
    icon: AuditIcon,
    children: [
      { name: 'Base de données auditeurs', href: '/audits/auditors' },
      { name: "Programme d'audit", href: '/audits' },
      { name: "Plan d'audit", href: '/audits' },
      { name: "Rapports d'audit", href: '/audits' },
      { name: 'Suivi des actions correctives', href: '/actions' },
      { name: 'Évaluation des auditeurs internes', href: '/audits/auditors' },
      { name: 'Maturité du processus', href: '/audits' },
      { name: 'Tableau de Bord & Pilotage des Audits', href: '/audits' },
    ],
  },
  { name: "Actions d'amélioration", href: '/actions', icon: ActionsIcon },
  {
    name: 'KPI Report',
    icon: KpiReportIcon,
    children: [
      { name: 'Qualité (SMQ)', href: '/kpi-report/smq' },
      { name: 'Sécurité (SST)', href: '/kpi-report/sst' },
      { name: 'Environnement (AES)', href: '/kpi-report/aes' },
    ],
  },
  { name: 'Fournisseurs', href: '/fournisseurs', icon: FournisseurIcon },
  {
    name: 'Administration',
    icon: SettingsIcon,
    children: [
      { name: 'Utilisateurs', href: '/admin/users' },
      { name: 'Rôles & Permissions', href: '/admin/roles' },
      { name: 'Configuration', href: '/admin/configuration' },
    ],
  },
];

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
      />
    </svg>
  );
}

function StrategyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6'
      />
    </svg>
  );
}

function AuditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
      />
    </svg>
  );
}

function ActionsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z'
      />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
      />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z'
      />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
      />
    </svg>
  );
}

function RiskIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
      />
    </svg>
  );
}

function KpiReportIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
      />
    </svg>
  );
}

function FournisseurIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m4.5 0V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25'
      />
    </svg>
  );
}

function UserMenu({
  user,
  onLogout,
}: {
  user: { firstName: string; lastName: string } | null;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors'
        aria-label='Menu utilisateur'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'>
          <svg
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
            />
          </svg>
        </div>
        <span className='hidden text-sm font-medium sm:inline-block'>
          {user?.firstName} {user?.lastName}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m19.5 8.25-7.5 7.5-7.5-7.5'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50'>
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className='flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'>
            <svg
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
              />
            </svg>
            Mon profil
          </button>
          <hr className='my-1 border-gray-200 dark:border-gray-700' />
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className='flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'>
            <svg
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
              />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({
  className,
  isOpen,
}: {
  className?: string;
  isOpen: boolean;
}) {
  return (
    <svg
      className={`${className} transition-transform ${isOpen ? 'rotate-90' : ''}`}
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m8.25 4.5 7.5 7.5-7.5 7.5'
      />
    </svg>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>([
    'Cartographie & Pilotage',
    'Administration',
  ]);

  const commandItems = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'Tableau de bord',
        description: 'Accueil et tableau de bord',
        category: 'Navigation',
        onSelect: () => navigate('/'),
      },
      {
        id: 'organigramme',
        label: 'Organigramme',
        description: 'Structure organisationnelle',
        category: 'Cartographie & Pilotage',
        onSelect: () => navigate('/cartographie/organigramme'),
      },
      {
        id: 'processus',
        label: 'Cartographie des Processus',
        description: 'Gestion des processus',
        category: 'Cartographie & Pilotage',
        onSelect: () => navigate('/cartographie/processus'),
      },
      {
        id: 'documents',
        label: 'Documents',
        description: 'Gestion documentaire (GED)',
        category: 'Documents',
        onSelect: () => navigate('/documents'),
      },
      {
        id: 'actions',
        label: 'Actions',
        description: "Actions d'amélioration",
        category: 'Actions',
        onSelect: () => navigate('/actions'),
      },
      {
        id: 'strategy-dashboard',
        label: 'Contexte & Stratégie',
        description: 'Dashboard stratégique du SMI',
        category: 'Stratégie',
        onSelect: () => navigate('/strategy'),
      },
      {
        id: 'strategy-pestel',
        label: 'Analyse PESTEL',
        description: 'Enjeux externes (Politique, Économique, Social…)',
        category: 'Analyse du Contexte',
        onSelect: () => navigate('/strategy/context/pestel'),
      },
      {
        id: 'strategy-swot',
        label: 'Analyse SWOT',
        description: 'Forces, Faiblesses, Opportunités, Menaces',
        category: 'Analyse du Contexte',
        onSelect: () => navigate('/strategy/context/swot'),
      },
      {
        id: 'strategy-enjeux',
        label: 'Registre des Enjeux',
        description: 'Fiches détaillées des enjeux identifiés',
        category: 'Analyse du Contexte',
        onSelect: () => navigate('/strategy/context/enjeux'),
      },
      {
        id: 'stakeholders',
        label: 'Cartographie des PII',
        description: 'Parties intéressées (clients, salariés, autorités…)',
        category: 'Parties Intéressées',
        onSelect: () => navigate('/strategy/stakeholders'),
      },
      {
        id: 'stakeholders-matrix',
        label: 'Matrice Besoins & Attentes',
        description: 'Besoins et attentes des parties intéressées',
        category: 'Parties Intéressées',
        onSelect: () => navigate('/strategy/stakeholders/matrix'),
      },
      {
        id: 'strategy-politique',
        label: 'Politique QSE',
        description: 'Document cadre signé par la Direction',
        category: 'Direction et Vision',
        onSelect: () => navigate('/strategy/direction/politique-qse'),
      },
      {
        id: 'strategy-engagement',
        label: "Lettre d'Engagement",
        description: 'Implication du top management',
        category: 'Direction et Vision',
        onSelect: () => navigate('/strategy/direction/lettre-engagement'),
      },
      {
        id: 'strategy-vision',
        label: 'Vision et Valeurs',
        description: "Culture et ambition à long terme de l'entreprise",
        category: 'Direction et Vision',
        onSelect: () => navigate('/strategy/direction/vision-valeurs'),
      },
      {
        id: 'strategy-organigramme',
        label: 'Organigramme',
        description: "Structure de l'autorité et des responsabilités",
        category: 'Direction et Vision',
        onSelect: () => navigate('/strategy/direction/organigramme'),
      },
      {
        id: 'strategic-objectives',
        label: 'Objectifs Stratégiques',
        description: 'KPI et suivi des objectifs',
        category: 'Planification Stratégique',
        onSelect: () => navigate('/strategy/planning/objectives'),
      },
      {
        id: 'strategy-plan-actions',
        label: "Plan d'Actions Stratégiques",
        description: 'Grandes étapes pour réaliser la Politique QSE',
        category: 'Planification Stratégique',
        onSelect: () => navigate('/strategy/planning/plan-actions'),
      },
      {
        id: 'strategy-risques-opportunites',
        label: 'Risques & Opportunités',
        description: 'Registre haut niveau des menaces et opportunités',
        category: 'Planification Stratégique',
        onSelect: () => navigate('/strategy/planning/risques-opportunites'),
      },
      {
        id: 'strategy-domaine',
        label: "Domaine d'Application",
        description: 'Périmètre, sites, exclusions justifiées',
        category: 'Structure du Système',
        onSelect: () => navigate('/strategy/structure/domaine'),
      },
      {
        id: 'strategy-cartography',
        label: 'Cartographie des Processus',
        description: 'Schéma global Management, Réalisation, Support',
        category: 'Structure du Système',
        onSelect: () => navigate('/strategy/structure/cartography'),
      },
      {
        id: 'regulatory-watch',
        label: 'Veille Réglementaire',
        description: 'Textes légaux impactant la stratégie',
        category: 'Veille et Conformité',
        onSelect: () => navigate('/strategy/regulatory'),
      },
      {
        id: 'audit-campaigns',
        label: "Campagnes d'audit",
        description: "Programme annuel d'audits QSE",
        category: 'Audit',
        onSelect: () => navigate('/audits'),
      },
      {
        id: 'auditors',
        label: 'Auditeurs',
        description: 'Fiches de qualification ISO 19011',
        category: 'Audit',
        onSelect: () => navigate('/audits/auditors'),
      },
      {
        id: 'fournisseurs',
        label: 'Fournisseurs',
        description: 'Référentiel fournisseurs et évaluations HSQSE',
        category: 'Fournisseurs',
        onSelect: () => navigate('/fournisseurs'),
      },
      {
        id: 'users',
        label: 'Utilisateurs',
        description: 'Gestion des utilisateurs',
        category: 'Administration',
        onSelect: () => navigate('/admin/users'),
      },
      {
        id: 'roles',
        label: 'Rôles & Permissions',
        description: 'Gestion des rôles et permissions',
        category: 'Administration',
        onSelect: () => navigate('/admin/roles'),
      },
      {
        id: 'duerp',
        label: 'DUERP',
        description:
          "Document Unique d'Évaluation des Risques Professionnels (ISO 45001)",
        category: 'Risques',
        onSelect: () => navigate('/risks/reports/duerp'),
      },
      {
        id: 'environmental',
        label: 'Analyse environnementale',
        description: 'Registre Aspects et Impacts (ISO 14001)',
        category: 'Risques',
        onSelect: () => navigate('/risks/reports/environmental'),
      },
      {
        id: 'process-risk-map',
        label: 'Carto. risques processus',
        description: 'Cartographie par processus (ISO 9001)',
        category: 'Risques',
        onSelect: () => navigate('/risks/reports/process-map'),
      },
      {
        id: 'configuration',
        label: 'Configuration',
        description: 'Types et domaines',
        category: 'Administration',
        onSelect: () => navigate('/admin/configuration'),
      },
    ],
    [navigate],
  );

  const toggleSection = (name: string) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const isChildActive = (children?: NavChild[]) =>
    children?.some((child) => {
      if (child.href) return location.pathname.startsWith(child.href);
      return child.children?.some((leaf) =>
        location.pathname.startsWith(leaf.href),
      );
    }) ?? false;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
        <div className='flex h-16 items-center gap-2 px-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>Q</span>
          </div>
          <span className='font-semibold text-gray-900 dark:text-white'>
            QSE Admin
          </span>
        </div>

        <nav className='mt-6 px-3 overflow-y-auto flex-1 min-h-0 pb-6'>
          <ul className='space-y-1'>
            {navigation.map((item) => {
              if (item.children) {
                const isOpen = openSections.includes(item.name);
                const hasActiveChild = isChildActive(item.children);
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        hasActiveChild
                          ? 'text-brand-700 dark:text-brand-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}>
                      <span className='flex items-center gap-3 min-w-0'>
                        <item.icon className='h-5 w-5 shrink-0' />
                        <span className='truncate'>{item.name}</span>
                      </span>
                      <ChevronIcon
                        className='h-4 w-4 shrink-0'
                        isOpen={isOpen}
                      />
                    </button>
                    {isOpen && (
                      <ul className='mt-1 ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4'>
                        {item.children.map((child) => {
                          if (child.children) {
                            const isSubOpen = openSections.includes(child.name);
                            const hasActiveLeaf = child.children.some(
                              (leaf) => location.pathname === leaf.href,
                            );
                            return (
                              <li key={child.name}>
                                <button
                                  onClick={() => toggleSection(child.name)}
                                  className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                                    hasActiveLeaf
                                      ? 'text-brand-600 dark:text-brand-400'
                                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                                  }`}>
                                  <span className='truncate'>{child.name}</span>
                                  <ChevronIcon
                                    className='h-3 w-3 shrink-0'
                                    isOpen={isSubOpen}
                                  />
                                </button>
                                {isSubOpen && (
                                  <ul className='mt-1 ml-2 space-y-0.5 border-l border-gray-100 dark:border-gray-700/50 pl-3'>
                                    {child.children.map((leaf) => {
                                      const isLeafActive =
                                        location.pathname === leaf.href;
                                      return (
                                        <li key={leaf.href}>
                                          <Link
                                            to={leaf.href}
                                            className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                              isLeafActive
                                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium'
                                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                            }`}>
                                            {leaf.name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            );
                          }

                          const isActive = location.pathname === child.href;
                          return (
                            <li key={child.href ?? child.name}>
                              <Link
                                to={child.href!}
                                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                  isActive
                                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}>
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href!}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}>
                    <item.icon className='h-5 w-5 shrink-0' />
                    <span className='truncate'>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className='pl-64'>
        {/* Header */}
        <header className='sticky top-0 z-40 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex h-full items-center justify-between px-6'>
            {/* Search trigger */}
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
                )
              }
              className='flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'>
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                />
              </svg>
              <span>Rechercher...</span>
              <kbd className='hidden rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium dark:bg-gray-700 sm:inline-block'>
                ⌘K
              </kbd>
            </button>
            <div className='flex items-center gap-4'>
              <NotificationBell />
              <UserMenu user={user} onLogout={logout} />
            </div>
          </div>
        </header>

        {/* Command Palette */}
        <CommandPalette
          items={commandItems}
          placeholder='Rechercher une page...'
        />

        {/* Page content */}
        <main className='p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
