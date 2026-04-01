import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  pageSize = 20,
}: PaginationProps) {
  const startItem = totalElements > 0 ? currentPage * pageSize + 1 : 0;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className='flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700'>
      <div className='text-sm text-gray-500 dark:text-gray-400'>
        <span className='font-medium'>{startItem}</span>
        {' - '}
        <span className='font-medium'>{endItem}</span>
        {' sur '}
        <span className='font-medium'>{totalElements}</span>
        {' résultat'}
        {totalElements > 1 ? 's' : ''}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center gap-2'>
          <Button
            variant='secondary'
            size='sm'
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft className='w-4 h-4 mr-1' />
            Précédent
          </Button>

          <div className='flex items-center gap-1'>
            {generatePageNumbers(currentPage, totalPages).map((page, index) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className='px-2 text-gray-400 dark:text-gray-500'>
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`
                    min-w-[32px] h-8 px-2 text-sm font-medium rounded-md transition-colors
                    ${
                      page === currentPage
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}>
                  {(page as number) + 1}
                </button>
              ),
            )}
          </div>

          <Button
            variant='secondary'
            size='sm'
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange(currentPage + 1)}>
            Suivant
            <ChevronRight className='w-4 h-4 ml-1' />
          </Button>
        </div>
      )}
    </div>
  );
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;

  if (!showEllipsis) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Toujours afficher la première page
  pages.push(0);

  if (currentPage > 2) {
    pages.push('...');
  }

  // Pages autour de la page courante
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages - 2, currentPage + 1);
    i++
  ) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (currentPage < totalPages - 3) {
    pages.push('...');
  }

  // Toujours afficher la dernière page
  if (!pages.includes(totalPages - 1)) {
    pages.push(totalPages - 1);
  }

  return pages;
}
