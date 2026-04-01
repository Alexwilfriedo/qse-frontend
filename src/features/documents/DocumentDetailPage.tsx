import { Button, Card, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { ArrowLeft, Download, Edit3, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AcknowledgementPanel,
  ConsultationPanel,
  DocumentCard,
  DocumentCommentsPanel,
  DocumentWorkflowActions,
  ExternalDocumentPanel,
  PaperDistributionPanel,
  QuizPanel,
  RejectDocumentModal,
} from './components';
import {
  useArchiveDocument,
  useDocument,
  usePublishDocument,
  useRejectDocument,
  useResumeEditing,
  useSubmitDocument,
  useUploadFile,
  useValidateConsultation,
  useVerifyDocument,
} from './hooks';

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: document, isLoading, error } = useDocument(id);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitDoc = useSubmitDocument();
  const verifyDoc = useVerifyDocument();
  const validateConsultation = useValidateConsultation();
  const publishDoc = usePublishDocument();
  const rejectDoc = useRejectDocument();
  const resumeEditing = useResumeEditing();
  const archiveDoc = useArchiveDocument();
  const uploadFile = useUploadFile();

  const isWorkflowPending =
    submitDoc.isPending ||
    verifyDoc.isPending ||
    validateConsultation.isPending ||
    publishDoc.isPending ||
    rejectDoc.isPending ||
    resumeEditing.isPending ||
    archiveDoc.isPending;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      uploadFile.mutate({ id, file });
    }
    e.target.value = '';
  };

  const handleDownload = async () => {
    if (!id) return;
    const response = await api.get(`/api/v1/documents/${id}/file`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = window.document.createElement('a');
    link.href = url;
    link.download = document?.fichierNom || 'document';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Document non trouvé'
          description="Le document demandé n'existe pas ou a été supprimé"
          actions={
            <Button variant='secondary' onClick={() => navigate('/documents')}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour à la liste
            </Button>
          }
        />
      </div>
    );
  }

  const isModifiable =
    document?.statut === 'BROUILLON' || document?.statut === 'REJETE';

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isLoading ? 'Chargement...' : document?.titre || 'Document'}
        description='Détail du document'
        actions={
          <div className='flex gap-2'>
            <Button variant='secondary' onClick={() => navigate('/documents')}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour
            </Button>
            {isModifiable && (
              <Button onClick={() => navigate(`/documents/${id}/edit`)}>
                <Edit3 className='w-4 h-4 mr-2' />
                Modifier
              </Button>
            )}
          </div>
        }
      />

      {document && (
        <DocumentWorkflowActions
          document={document}
          onSubmit={() => id && submitDoc.mutate(id)}
          onVerify={(req) =>
            id && verifyDoc.mutate({ id, requireConsultation: req })
          }
          onValidateConsultation={() => id && validateConsultation.mutate(id)}
          onPublish={() => id && publishDoc.mutate(id)}
          onReject={() => setIsRejectOpen(true)}
          onResumeEditing={() => id && resumeEditing.mutate(id)}
          onArchive={() => id && archiveDoc.mutate(id)}
          isPending={isWorkflowPending}
        />
      )}

      {document && (
        <Card>
          <div className='flex items-center justify-between gap-4 p-5'>
            <div className='space-y-2'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400'>
                Document joint
              </p>
              {document.hasFile || document.fichierNom ? (
                <>
                  <h4 className='text-base font-semibold text-gray-900 dark:text-white'>
                    Télécharger le document source
                  </h4>
                  <button
                    type='button'
                    onClick={handleDownload}
                    className='text-left text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline'>
                    {document.fichierNom}
                  </button>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Taille : {((document.fichierTaille ?? 0) / 1024).toFixed(1)} Ko
                  </p>
                </>
              ) : (
                <>
                  <h4 className='text-base font-semibold text-gray-900 dark:text-white'>
                    Aucun document joint
                  </h4>
                  <p className='text-sm text-gray-400 dark:text-gray-500'>
                    Ajoute un fichier pour permettre son téléchargement depuis cette fiche.
                  </p>
                </>
              )}
            </div>
            <div className='flex gap-2'>
              {(document.hasFile || document.fichierNom) && (
                <Button size='sm' onClick={handleDownload}>
                  <Download className='w-4 h-4 mr-1' />
                  Télécharger le document
                </Button>
              )}
              {isModifiable && (
                <>
                  <Button
                    size='sm'
                    variant='secondary'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadFile.isPending}>
                    <Upload className='w-4 h-4 mr-1' />
                    {uploadFile.isPending ? 'Upload...' : 'Ajouter un fichier'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    className='hidden'
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {document && document.statut === 'EN_CONSULTATION' && (
        <ConsultationPanel documentId={document.id} />
      )}

      {document &&
        (document.statut === 'PUBLIE' || document.statut === 'APPROUVE') && (
          <AcknowledgementPanel
            documentId={document.id}
            canManage={document.statut === 'PUBLIE'}
          />
        )}

      {document && document.externe && (
        <ExternalDocumentPanel document={document} />
      )}

      {document &&
        (document.statut === 'PUBLIE' || document.statut === 'APPROUVE') && (
          <QuizPanel documentId={document.id} />
        )}

      {document && document.statut === 'PUBLIE' && (
        <PaperDistributionPanel documentId={document.id} canManage={true} />
      )}

      {document && document.statut !== 'BROUILLON' && (
        <DocumentCommentsPanel documentId={document.id} />
      )}

      <DocumentCard document={document} isLoading={isLoading} />

      <RejectDocumentModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={(motif) => {
          if (id) {
            rejectDoc.mutate(
              { id, motif },
              { onSuccess: () => setIsRejectOpen(false) },
            );
          }
        }}
        isPending={rejectDoc.isPending}
      />
    </div>
  );
}
