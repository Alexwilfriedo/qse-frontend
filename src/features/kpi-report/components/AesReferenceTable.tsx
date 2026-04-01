import { AES_AXES } from '../aesTypes';

export function AesReferenceTable() {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200 dark:border-gray-700'>
            <th className='text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300'>
              Axe de la Norme
            </th>
            <th className='text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300'>
              Indicateurs Clés de Performance (KPI)
            </th>
            <th className='text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300'>
              Objectifs Cibles
            </th>
            <th className='text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300'>
              Justification Secteur Énergie
            </th>
          </tr>
        </thead>
        <tbody>
          {AES_AXES.map((axis) => (
            <tr
              key={axis.code}
              className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
              <td className='py-3 px-4 font-medium text-gray-900 dark:text-gray-100'>
                {axis.label}
              </td>
              <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>
                {axis.defaultIndicator}
              </td>
              <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>
                {axis.defaultTarget} {axis.defaultUnit === '%' ? '%' : ''}
              </td>
              <td className='py-3 px-4 text-gray-500 dark:text-gray-400 text-xs'>
                {axis.justification}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
