import { Badge, PageHeader, SkeletonTable } from '@/components/ui';
import ExportButtons from './components/ExportButtons';
import ReportSection from './components/ReportSection';
import { useEnvironmentalReport } from './hooks/useRisks';
import { exportEnvironmentalExcel, exportEnvironmentalPdf } from './risksApi';
import type {
  EnvironmentalRow,
  EnvironmentalSection,
  MeasureSummary,
} from './types';

function CriticityBadge({ score }: { score: number }) {
  const variant = score >= 12 ? 'error' : score >= 6 ? 'warning' : 'success';
  return <Badge variant={variant}>{score}</Badge>;
}

function MeasuresList({ measures }: { measures: MeasureSummary[] }) {
  if (measures.length === 0)
    return <span className='text-sm text-gray-400'>Aucune</span>;
  return (
    <ul className='list-disc pl-4 text-sm'>
      {measures.map((m, i) => (
        <li key={i}>{m.title}</li>
      ))}
    </ul>
  );
}

function AspectRow({ row }: { row: EnvironmentalRow }) {
  return (
    <tr className='border-b border-gray-100 dark:border-gray-700'>
      <td className='px-3 py-2 text-sm font-medium'>{row.code}</td>
      <td className='px-3 py-2 text-sm'>{row.title}</td>
      <td className='px-3 py-2 text-sm text-gray-600'>
        {row.consequences || '—'}
      </td>
      <td className='px-3 py-2 text-center text-sm'>{row.frequency}</td>
      <td className='px-3 py-2 text-center text-sm'>{row.severity}</td>
      <td className='px-3 py-2 text-center'>
        <CriticityBadge score={row.criticalityScore} />
      </td>
      <td className='px-3 py-2'>
        <MeasuresList measures={row.measures} />
      </td>
      <td className='px-3 py-2 text-center'>
        {row.residualScore > 0 ? (
          <CriticityBadge score={row.residualScore} />
        ) : (
          <span className='text-sm text-gray-400'>—</span>
        )}
      </td>
      <td className='px-3 py-2 text-center'>
        {row.significantAspect ? (
          <Badge variant='error'>AES</Badge>
        ) : (
          <span className='text-sm text-gray-400'>—</span>
        )}
      </td>
    </tr>
  );
}

export default function EnvironmentalPage() {
  const { data: report, isLoading } = useEnvironmentalReport();

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <PageHeader
          title='Analyse Environnementale'
          description='Registre des Aspects et Impacts Environnementaux (ISO 14001)'
        />
        {report && (
          <ExportButtons
            onExportPdf={exportEnvironmentalPdf}
            onExportExcel={exportEnvironmentalExcel}
            pdfFilename='Analyse_Environnementale.pdf'
            excelFilename='Analyse_Environnementale.xlsx'
          />
        )}
      </div>

      {isLoading && <SkeletonTable rows={8} columns={9} />}

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
              {report.totalAspects} aspect{report.totalAspects > 1 ? 's' : ''}
            </span>
            {report.significantAspectsCount > 0 && (
              <Badge variant='error'>
                {report.significantAspectsCount} AES
              </Badge>
            )}
          </div>

          {report.sections.map((section: EnvironmentalSection) => (
            <ReportSection
              key={section.workUnitId}
              title={section.workUnitName}
              count={section.aspects.length}>
              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='border-b-2 border-gray-200 dark:border-gray-600'>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Code
                      </th>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Aspect
                      </th>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Impact
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Prob.
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Grav.
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Brut
                      </th>
                      <th className='px-3 py-2 text-xs font-semibold uppercase text-gray-500'>
                        Mesures prévention
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        Résiduel
                      </th>
                      <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-500'>
                        AES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.aspects.map((row: EnvironmentalRow) => (
                      <AspectRow key={row.riskId} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportSection>
          ))}

          {report.sections.length === 0 && (
            <p className='py-12 text-center text-gray-500'>
              Aucun aspect environnemental enregistré.
            </p>
          )}
        </>
      )}
    </div>
  );
}
