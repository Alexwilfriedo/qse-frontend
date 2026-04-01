import { Badge, Button, Modal } from '@/components/ui';
import type { AuditFinding, AuditSummary, FindingType } from '../types';
import { ReportSummaryCard } from './ReportSummaryCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  audit: AuditSummary;
  findings: AuditFinding[];
  onSubmitReport: () => void;
  isPending: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  INTERNE: 'Interne',
  EXTERNE: 'Externe',
  CERTIFICATION: 'Certification',
  SURVEILLANCE: 'Surveillance',
};

const FINDING_TYPE_LABELS: Record<FindingType, string> = {
  PF: 'Point fort',
  PP: 'Piste de progrès',
  PS: 'Point sensible',
  NCM: 'NC Majeure',
  NCm: 'NC Mineure',
};

const FINDING_TYPE_COLORS: Record<FindingType, string> = {
  PF: 'bg-green-100 text-green-800',
  PP: 'bg-blue-100 text-blue-800',
  PS: 'bg-orange-100 text-orange-800',
  NCM: 'bg-red-100 text-red-800',
  NCm: 'bg-amber-100 text-amber-800',
};

export function ReportPreviewModal({
  isOpen,
  onClose,
  audit,
  findings,
  onSubmitReport,
  isPending,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Aperçu du rapport d&apos;audit'>
      <div className='space-y-6 max-h-[70vh] overflow-y-auto'>
        {/* En-tête audit */}
        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase'>Type d&apos;audit</p>
            <p className='text-gray-800'>{TYPE_LABELS[audit.type] ?? audit.type}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase'>Périmètre</p>
            <p className='text-gray-800'>{audit.perimetre}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase'>Date de réalisation</p>
            <p className='text-gray-800'>{audit.datePrevisionnelle}</p>
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-500 uppercase'>Référentiels normatifs</p>
            <p className='text-gray-800'>{audit.referentielNormatif ?? '—'}</p>
          </div>
          {audit.objectifSpecifique && (
            <div className='col-span-2'>
              <p className='text-xs font-semibold text-gray-500 uppercase'>Objectifs</p>
              <p className='text-gray-800'>{audit.objectifSpecifique}</p>
            </div>
          )}
          {audit.notePerformanceProcessus != null && (
            <div>
              <p className='text-xs font-semibold text-gray-500 uppercase'>
                Note de performance du processus
              </p>
              <p className='text-gray-800 font-bold'>{audit.notePerformanceProcessus}%</p>
            </div>
          )}
        </div>

        {/* Synthèse des constats */}
        <ReportSummaryCard findings={findings} />

        {/* Détail des constats */}
        <div>
          <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Détail des constats ({findings.length})
          </p>
          {findings.length === 0 ? (
            <p className='text-sm text-gray-500'>Aucun constat enregistré.</p>
          ) : (
            <div className='space-y-3'>
              {findings.map((f, i) => (
                <div key={f.id} className='border rounded-lg p-3'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs text-gray-400'>#{i + 1}</span>
                    <Badge className={FINDING_TYPE_COLORS[f.type]}>
                      {FINDING_TYPE_LABELS[f.type]}
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-800'>{f.description}</p>
                  {f.ecartDescription && (
                    <p className='mt-1 text-sm text-gray-600'>
                      <span className='font-medium'>Écart : </span>
                      {f.ecartDescription}
                    </p>
                  )}
                  {f.recommandation && (
                    <p className='mt-1 text-sm text-gray-600'>
                      <span className='font-medium'>Recommandation : </span>
                      {f.recommandation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
        <Button variant='secondary' onClick={onClose}>
          Fermer
        </Button>
        <Button onClick={onSubmitReport} disabled={isPending || findings.length === 0}>
          {isPending ? 'Envoi...' : 'Soumettre pour revue'}
        </Button>
      </div>
    </Modal>
  );
}
