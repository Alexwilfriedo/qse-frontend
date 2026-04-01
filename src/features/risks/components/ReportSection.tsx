import { Card } from '@/components/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ReportSectionProps {
  title: string;
  subtitle?: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * Section repliable pour les rapports automatisés.
 * Affiche un titre avec compteur et permet d'afficher/masquer le contenu.
 */
export default function ReportSection({
  title,
  subtitle,
  count,
  children,
  defaultOpen = true,
}: ReportSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className='mb-4'>
      <div className='p-4'>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          className='flex w-full items-center gap-2 text-left'>
          {open ? (
            <ChevronDown className='h-5 w-5 text-gray-500' />
          ) : (
            <ChevronRight className='h-5 w-5 text-gray-500' />
          )}
          <div className='flex-1'>
            <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
              {title}
            </h3>
            {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
          </div>
          <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
            {count} risque{count > 1 ? 's' : ''}
          </span>
        </button>
      </div>
      {open && <div className='px-4 pb-4'>{children}</div>}
    </Card>
  );
}
