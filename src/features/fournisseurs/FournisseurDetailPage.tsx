import { Badge, Button, Card, CardHeader, PageHeader } from '@/components/ui';
import { showToast } from '@/lib/toast';
import {
  ArrowLeft,
  Building2,
  FileText,
  Gauge,
  Layers,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateEvaluationModal, EvaluationList } from './components';
import CreateReclamationModal from './components/CreateReclamationModal';
import ReclamationsTable from './components/ReclamationsTable';
import {
  useDeleteEvaluation,
  useEvaluations,
  useFournisseur,
  useReclamations,
} from './hooks';
import type { EvaluationFournisseur } from './types';

export default function FournisseurDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: fournisseur, isLoading, error } = useFournisseur(id);
  const { data: evaluations, isLoading: evalsLoading } = useEvaluations(id);
  const { data: reclamations, isLoading: reclamationsLoading } =
    useReclamations(id || '');
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [isReclamationModalOpen, setIsReclamationModalOpen] = useState(false);
  const deleteEvaluation = useDeleteEvaluation();

  const handleDeleteEvaluation = async (evaluation: EvaluationFournisseur) => {
    if (!id) return;
    try {
      await deleteEvaluation.mutateAsync({
        fournisseurId: id,
        evalId: evaluation.id,
      });
    } catch {
      showToast.error("Erreur lors de la suppression de l'évaluation");
    }
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Fournisseur non trouvé'
          description="Le fournisseur demandé n'existe pas ou a été supprimé"
          actions={
            <Button
              variant='secondary'
              onClick={() => navigate('/fournisseurs')}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour à la liste
            </Button>
          }
        />
      </div>
    );
  }

  const statutVariantMap: Record<string, 'success' | 'warning' | 'error'> = {
    HOMOLOGUE: 'success',
    SOUS_SURVEILLANCE: 'warning',
    DISQUALIFIE: 'error',
  };
  const statutLabelMap: Record<string, string> = {
    HOMOLOGUE: 'Homologué',
    SOUS_SURVEILLANCE: 'Sous surveillance',
    DISQUALIFIE: 'Disqualifié',
  };
  const categorieLabels: Record<string, string> = {
    TRAVAUX_HT: 'Travaux HT',
    FOURNITURES: 'Fournitures',
    PRESTATIONS: 'Prestations',
  };
  const criticiteLabels: Record<string, string> = {
    STRATEGIQUE: 'Stratégique',
    IMPORTANT: 'Important',
    STANDARD: 'Standard',
  };
  const statutVariant = fournisseur
    ? statutVariantMap[fournisseur.statut] || 'info'
    : 'info';

  return (
    <div className='space-y-6'>
      <PageHeader
        title={
          isLoading
            ? 'Chargement...'
            : fournisseur?.raisonSociale || 'Fournisseur'
        }
        description='Détail du fournisseur'
        actions={
          <Button variant='secondary' onClick={() => navigate('/fournisseurs')}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Retour
          </Button>
        }
      />

      {/* Fiche fournisseur */}
      <Card>
        <CardHeader
          title='Informations générales'
          action={
            fournisseur && (
              <Badge variant={statutVariant}>
                {statutLabelMap[fournisseur.statut] || fournisseur.statut}
              </Badge>
            )
          }
        />
        {isLoading ? (
          <div className='p-6 space-y-3'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3'
              />
            ))}
          </div>
        ) : fournisseur ? (
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              {fournisseur.domaineActivite && (
                <div className='flex items-center gap-2 text-sm'>
                  <Building2 className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Domaine :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {fournisseur.domaineActivite}
                  </span>
                </div>
              )}
              {fournisseur.email && (
                <div className='flex items-center gap-2 text-sm'>
                  <Mail className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Email :
                  </span>
                  <a
                    href={`mailto:${fournisseur.email}`}
                    className='text-brand-600 hover:underline'>
                    {fournisseur.email}
                  </a>
                </div>
              )}
              {fournisseur.telephone && (
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Téléphone :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {fournisseur.telephone}
                  </span>
                </div>
              )}
            </div>
            <div className='space-y-3'>
              {fournisseur.adresse && (
                <div className='flex items-center gap-2 text-sm'>
                  <MapPin className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Adresse :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {fournisseur.adresse}
                  </span>
                </div>
              )}
              {fournisseur.ifu && (
                <div className='flex items-center gap-2 text-sm'>
                  <FileText className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    IFU :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {fournisseur.ifu}
                  </span>
                </div>
              )}
              {fournisseur.categorie && (
                <div className='flex items-center gap-2 text-sm'>
                  <Layers className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Catégorie :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {categorieLabels[fournisseur.categorie] ||
                      fournisseur.categorie}
                  </span>
                </div>
              )}
              {fournisseur.criticite && (
                <div className='flex items-center gap-2 text-sm'>
                  <Gauge className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Criticité :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {criticiteLabels[fournisseur.criticite] ||
                      fournisseur.criticite}
                  </span>
                </div>
              )}
              {fournisseur.certifications && (
                <div className='flex items-center gap-2 text-sm'>
                  <ShieldCheck className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Certifications :
                  </span>
                  <span className='text-gray-900 dark:text-white'>
                    {fournisseur.certifications}
                  </span>
                </div>
              )}
              {fournisseur.noteGlobale != null && (
                <div className='flex items-center gap-2 text-sm'>
                  <Gauge className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Note globale :
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    {fournisseur.noteGlobale.toFixed(1)} / 100
                  </span>
                </div>
              )}
            </div>

            {/* Contacts */}
            {fournisseur.contacts && fournisseur.contacts.length > 0 && (
              <div className='col-span-full'>
                <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Contacts ({fournisseur.contacts.length})
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {fournisseur.contacts.map((contact, i) => (
                    <div
                      key={i}
                      className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {contact.nom}
                      </p>
                      {contact.fonction && (
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {contact.fonction}
                        </p>
                      )}
                      <div className='flex gap-3 mt-1'>
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className='text-xs text-brand-600 hover:underline'>
                            {contact.email}
                          </a>
                        )}
                        {contact.telephone && (
                          <span className='text-xs text-gray-500'>
                            {contact.telephone}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Card>

      {/* Évaluations */}
      <EvaluationList
        evaluations={evaluations}
        isLoading={evalsLoading}
        onAdd={() => setIsEvalModalOpen(true)}
        onDelete={handleDeleteEvaluation}
      />

      {/* Réclamations */}
      <Card>
        <CardHeader
          title='Réclamations'
          action={
            <Button size='sm' onClick={() => setIsReclamationModalOpen(true)}>
              Nouvelle réclamation
            </Button>
          }
        />
        {reclamationsLoading ? (
          <div className='p-6 space-y-3'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3'
              />
            ))}
          </div>
        ) : (
          <ReclamationsTable
            fournisseurId={id || ''}
            reclamations={reclamations || []}
          />
        )}
      </Card>

      {id && (
        <>
          <CreateEvaluationModal
            isOpen={isEvalModalOpen}
            onClose={() => setIsEvalModalOpen(false)}
            fournisseurId={id}
          />
          <CreateReclamationModal
            isOpen={isReclamationModalOpen}
            onClose={() => setIsReclamationModalOpen(false)}
            fournisseurId={id}
          />
        </>
      )}
    </div>
  );
}
