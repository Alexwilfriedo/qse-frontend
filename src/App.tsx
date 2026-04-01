import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { OfflineScreen } from './components/error/OfflineScreen';
import AdminLayout from './components/layout/AdminLayout';
import { ActionDetailPage } from './features/actions/ActionDetailPage';
import { ActionsPage } from './features/actions/ActionsPage';
import RoleFormPage from './features/admin/RoleFormPage';
import RolesPage from './features/admin/RolesPage';
import UsersPage from './features/admin/UsersPage';
import {
  AuditDetailPage,
  AuditorDetailPage,
  AuditorsPage,
  CampaignDetailPage,
  CampaignsPage,
  PublicAuditFeedbackPage,
} from './features/audits';
import ForceChangePasswordPage from './features/auth/ForceChangePasswordPage';
import LoginPage from './features/auth/LoginPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import ConfigurationPage from './features/configuration/ConfigurationPage';
import DocumentDetailPage from './features/documents/DocumentDetailPage';
import DocumentEditPage from './features/documents/DocumentEditPage';
import DocumentsPage from './features/documents/DocumentsPage';
import FournisseurDetailPage from './features/fournisseurs/FournisseurDetailPage';
import FournisseursPage from './features/fournisseurs/FournisseursPage';
import { IncidentDetailPage, IncidentsPage } from './features/incidents';
import {
  DuerpPage,
  EnvironmentalPage,
  MeasuresPage,
  OpportunityDetailPage,
  OpportunitiesPage,
  ProcessRiskMapPage,
  RiskConfigPage,
  RiskDetailPage,
  RiskMatrixPage,
  RisksPage,
} from './features/risks';
import {
  MaturityDashboardPage,
  SelfAssessmentCampaignDetailPage,
  SelfAssessmentCampaignsPage,
  SelfAssessmentConfigPage,
  SelfAssessmentFillPage,
} from './features/self-assessment';
import {
  MatriceBesoinsAttentesPage,
  ObjectivesPage,
  ProcessCartographyPage,
  RegulatoryWatchPage,
  StakeholdersPage,
  StrategicDocTypePage,
  StrategyDashboardPage,
} from './features/strategy';
import { StrategicDocumentType } from './features/strategy/types';
import {
  KpiReportAesPage,
  KpiReportSmqPage,
  KpiReportSstPage,
} from './features/kpi-report';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
import OrganigrammePage from './pages/OrganigrammePage';
import ProcessDetailPage from './pages/ProcessDetailPage';
import ProcessEditFipPage from './pages/ProcessEditFipPage';
import ProcessusPage from './pages/ProcessusPage';
import ProfilePage from './pages/ProfilePage';
import UniteTravailDetailPage from './pages/UniteTravailDetailPage';
import UnitesTravailPage from './pages/UnitesTravailPage';
import ValidationsPage from './pages/ValidationsPage';

function App() {
  return (
    <ErrorBoundary>
      <OfflineScreen />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/change-password' element={<ForceChangePasswordPage />} />
        <Route
          path='/audit-feedback/:token'
          element={<PublicAuditFeedbackPage />}
        />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path='/actions' element={<ActionsPage />} />
          <Route path='/actions/:id' element={<ActionDetailPage />} />
          <Route path='/admin/users' element={<UsersPage />} />
          <Route path='/admin/roles' element={<RolesPage />} />
          <Route path='/admin/roles/new' element={<RoleFormPage />} />
          <Route path='/admin/roles/:id/edit' element={<RoleFormPage />} />
          <Route path='/admin/configuration' element={<ConfigurationPage />} />
          <Route path='/admin/risk-config' element={<RiskConfigPage />} />
          <Route path='/risks' element={<RisksPage />} />
          <Route path='/risks/opportunities' element={<OpportunitiesPage />} />
          <Route
            path='/risks/opportunities/:id'
            element={<OpportunityDetailPage />}
          />
          <Route path='/risks/matrix' element={<RiskMatrixPage />} />
          <Route path='/risks/measures' element={<MeasuresPage />} />
          <Route path='/risks/reports/duerp' element={<DuerpPage />} />
          <Route
            path='/risks/reports/environmental'
            element={<EnvironmentalPage />}
          />
          <Route
            path='/risks/reports/process-map'
            element={<ProcessRiskMapPage />}
          />
          <Route path='/risks/:id' element={<RiskDetailPage />} />
          <Route path='/incidents' element={<IncidentsPage />} />
          <Route path='/incidents/:id' element={<IncidentDetailPage />} />
          <Route path='/documents' element={<DocumentsPage />} />
          <Route path='/documents/:id' element={<DocumentDetailPage />} />
          <Route path='/documents/:id/edit' element={<DocumentEditPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/kpi-report/smq' element={<KpiReportSmqPage />} />
          <Route path='/kpi-report/sst' element={<KpiReportSstPage />} />
          <Route path='/kpi-report/aes' element={<KpiReportAesPage />} />
          <Route path='/validations' element={<ValidationsPage />} />
          <Route path='/audits' element={<CampaignsPage />} />
          <Route
            path='/audits/campaigns/:id'
            element={<CampaignDetailPage />}
          />
          <Route path='/audits/auditors' element={<AuditorsPage />} />
          <Route path='/audits/auditors/:id' element={<AuditorDetailPage />} />
          <Route path='/audits/:id' element={<AuditDetailPage />} />
          {/* Contexte & Stratégie — Vue d'ensemble */}
          <Route path='/strategy' element={<StrategyDashboardPage />} />

          {/* 1. Analyse du Contexte */}
          <Route
            path='/strategy/context/pestel'
            element={
              <StrategicDocTypePage
                sectionTitle='Analyse PESTEL'
                sectionDescription='Enjeux externes : Politique, Économique, Sociologique, Technologique, Environnemental, Légal.'
                documentTypes={[StrategicDocumentType.PESTEL]}
              />
            }
          />
          <Route
            path='/strategy/context/swot'
            element={
              <StrategicDocTypePage
                sectionTitle='Analyse SWOT'
                sectionDescription={
                  "Forces, Faiblesses, Opportunités et Menaces de l'organisation."
                }
                documentTypes={[StrategicDocumentType.SWOT]}
              />
            }
          />
          <Route
            path='/strategy/context/enjeux'
            element={
              <StrategicDocTypePage
                sectionTitle='Registre des Enjeux'
                sectionDescription='Fiche détaillée pour chaque enjeu identifié (description, impact, probabilité, responsable).'
                documentTypes={[StrategicDocumentType.REGISTRE_ENJEUX]}
              />
            }
          />

          {/* 2. Parties Intéressées */}
          <Route path='/strategy/stakeholders' element={<StakeholdersPage />} />
          <Route
            path='/strategy/stakeholders/matrix'
            element={<MatriceBesoinsAttentesPage />}
          />

          {/* 3. Direction et Vision */}
          <Route
            path='/strategy/direction/politique-qse'
            element={
              <StrategicDocTypePage
                sectionTitle='Politique QSE'
                sectionDescription='Document cadre signé par la Direction définissant les engagements Qualité, SST et Environnement.'
                documentTypes={[StrategicDocumentType.POLITIQUE_QSE]}
              />
            }
          />
          <Route
            path='/strategy/direction/lettre-engagement'
            element={
              <StrategicDocTypePage
                sectionTitle="Lettre d'Engagement"
                sectionDescription="Preuve formelle de l'implication du top management."
                documentTypes={[StrategicDocumentType.LETTRE_ENGAGEMENT]}
              />
            }
          />
          <Route
            path='/strategy/direction/vision-valeurs'
            element={
              <StrategicDocTypePage
                sectionTitle='Vision et Valeurs'
                sectionDescription="Document décrivant la culture et l'ambition à long terme de l'entreprise."
                documentTypes={[StrategicDocumentType.VISION_VALEURS]}
              />
            }
          />
          <Route
            path='/strategy/direction/organigramme'
            element={
              <StrategicDocTypePage
                sectionTitle='Organigramme'
                sectionDescription="Structure de l'autorité et des responsabilités stratégiques."
                documentTypes={[StrategicDocumentType.ORGANIGRAMME]}
              />
            }
          />

          {/* 4. Planification Stratégique */}
          <Route
            path='/strategy/planning/objectives'
            element={<ObjectivesPage />}
          />
          <Route
            path='/strategy/planning/plan-actions'
            element={
              <StrategicDocTypePage
                sectionTitle="Plan d'Actions Stratégiques"
                sectionDescription='Les grandes étapes pour réaliser la Politique QSE.'
                documentTypes={[
                  StrategicDocumentType.PLAN_ACTIONS_STRATEGIQUES,
                ]}
              />
            }
          />
          <Route
            path='/strategy/planning/risques-opportunites'
            element={
              <StrategicDocTypePage
                sectionTitle='Risques & Opportunités Stratégiques'
                sectionDescription={
                  "Registre haut niveau des menaces sur la pérennité de l'entreprise."
                }
                documentTypes={[StrategicDocumentType.RISQUES_OPPORTUNITES]}
              />
            }
          />

          {/* 5. Structure du Système */}
          <Route
            path='/strategy/structure/domaine'
            element={
              <StrategicDocTypePage
                sectionTitle="Domaine d'Application"
                sectionDescription='Périmètre : sites, produits, services et activités couverts par le système QSE (ainsi que les exclusions justifiées).'
                documentTypes={[StrategicDocumentType.DOMAINE_APPLICATION]}
              />
            }
          />
          <Route
            path='/strategy/structure/cartography'
            element={<ProcessCartographyPage />}
          />

          {/* 6. Veille et Conformité */}
          <Route
            path='/strategy/regulatory'
            element={<RegulatoryWatchPage />}
          />
          <Route
            path='/self-assessment/config'
            element={<SelfAssessmentConfigPage />}
          />
          <Route
            path='/self-assessment/campaigns'
            element={<SelfAssessmentCampaignsPage />}
          />
          <Route
            path='/self-assessment/campaigns/:id'
            element={<SelfAssessmentCampaignDetailPage />}
          />
          <Route
            path='/self-assessment/campaigns/:campaignId/fill/:processId'
            element={<SelfAssessmentFillPage />}
          />
          <Route
            path='/self-assessment/dashboard'
            element={<MaturityDashboardPage />}
          />
          <Route path='/fournisseurs' element={<FournisseursPage />} />
          <Route path='/fournisseurs/:id' element={<FournisseurDetailPage />} />
          <Route
            path='/cartographie/organigramme'
            element={<OrganigrammePage />}
          />
          <Route path='/cartographie/processus' element={<ProcessusPage />} />
          <Route
            path='/cartographie/unites-travail'
            element={<UnitesTravailPage />}
          />
          <Route
            path='/cartographie/unites-travail/:id'
            element={<UniteTravailDetailPage />}
          />
          <Route
            path='/cartographie/processus/:id'
            element={<ProcessDetailPage />}
          />
          <Route
            path='/cartographie/processus/:id/edit'
            element={<ProcessEditFipPage />}
          />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
