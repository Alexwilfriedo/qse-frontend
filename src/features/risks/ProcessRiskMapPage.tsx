import { Badge, PageHeader, SkeletonTable } from '@/components/ui';
import ExportButtons from './components/ExportButtons';
import ReportSection from './components/ReportSection';
import { useProcessRiskMapReport } from './hooks/useRisks';
import { exportProcessMapExcel, exportProcessMapPdf } from './risksApi';
import type {
  MeasureSummary,
  ProcessRiskRow,
  ProcessRiskSection,
} from './types';

function CriticityBadge({ score }: { score: number }) {
  const variant = score >= 12 ? 'error' : score >= 6 ? 'warning' : 'success';
  return <Badge variant={variant}>{score}</Badge>;
}

function ControlsList({ controls }: { controls: MeasureSummary[] }) {
  if (controls.length === 0)
    return <span className='text-sm text-gray-400'>Aucun</span>;
  return (
    <ul className='list-disc pl-4 text-sm'>
      {controls.map((c, i) => (
        <li key={i}>{c.title}</li>
      ))}
    </ul>
  );
}

function RiskRow({ row }: { row: ProcessRiskRow }) {
  return (
    <tr className='border-b border-gray-100 dark:border-gray-700'>
      <td className='px-3 py-2 text-sm font-medium'>{row.code}</td>
      <td className='px-3 py-2 text-sm'>{row.title}</td>
      <td className='px-3 py-2 text-sm text-gray-600'>{row.causes || '—'}</td>
      <td className='px-3 py-2 text-center text-sm'>{row.frequency}</td>
      <td className='px-3 py-2 text-center text-sm'>{row.severity}</td>
      <td className='px-3 py-2 text-center'>
        <CriticityBadge score={row.criticalityScore} />
      </td>
      <td className='px-3 py-2'>
        <ControlsList controls={row.controls} />
      </td>
      <td className='px-3 py-2 text-center'>
        {row.residualScore > 0 ? (
          <CriticityBadge score={row.residualScore} />
        ) : (
          <span className='text-sm text-gray-400'>—</span>
        )}
      </td>
    </tr>
  );
}

export default function ProcessRiskMapPage() {
  const { data: report, isLoading, isError, error } = useProcessRiskMapReport();

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <PageHeader
          title='Cartographie Risques Processus'
          description='Risques par processus métier (ISO 9001)'
        />
        {report && (
          <ExportButtons
            onExportPdf={exportProcessMapPdf}
            onExportExcel={exportProcessMapExcel}
            pdfFilename='Cartographie_Processus.pdf'
            excelFilename='Cartographie_Processus.xlsx'
          />
        )}
      </div>

      {isLoading && <SkeletonTable rows={8} columns={8} />}

      {isError && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950'>
          <p className='text-sm font-medium text-red-600 dark:text-red-400'>
            Erreur lors du chargement de la cartographie
          </p>
          <p className='mt-1 text-xs text-red-500'>
            {(error as { response?: { status?: number } })?.response?.status ===
            403
              ? "Vous n'avez pas la permission de consulter cette page."
              : "Veuillez réessayer ou contacter l'administrateur."}
          </p>
        </div>
      )}

      {report && (
        <>
          <div className='flex items-center gap-4 text-sm text-gray-600'>
            <span>
              Généré le{' '}
              {new Date(report.generatedAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className='font-medium'>
              {report.totalRisks} risque{report.totalRisks > 1 ? 's' : ''}
            </span>
          </div>

          {report.sections.map((section: ProcessRiskSection) => (
            <ReportSection
              key={section.processusId}
              title={section.processusName}
              count={section.risks.length}>
              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='border-b-2 border-gray-200 dark:border-gray-600'>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Code
                      </th>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Risque
                      </th>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Causes
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Prob.
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Impact
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Brut
                      </th>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Contrôles
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Résiduel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.risks.map((row: ProcessRiskRow) => (
                      <RiskRow key={row.riskId} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportSection>
          ))}

          {report.sections.length === 0 && (
            <p className='py-12 text-center text-gray-500'>
              Aucun risque processus enregistré.
            </p>
          )}
        </>
      )}
    </div>
  );
}
