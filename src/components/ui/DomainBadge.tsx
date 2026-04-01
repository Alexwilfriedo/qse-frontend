type Domain = 'qualite' | 'securite' | 'environnement';

interface DomainBadgeProps {
  domain: Domain;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const domainConfig: Record<
  Domain,
  { label: string; bgClass: string; textClass: string; icon: string }
> = {
  qualite: {
    label: 'Qualité',
    bgClass: 'bg-qualite-50 dark:bg-qualite-900/20',
    textClass: 'text-qualite-700 dark:text-qualite-400',
    icon: 'Q',
  },
  securite: {
    label: 'Sécurité',
    bgClass: 'bg-securite-50 dark:bg-securite-900/20',
    textClass: 'text-securite-700 dark:text-securite-400',
    icon: 'S',
  },
  environnement: {
    label: 'Environnement',
    bgClass: 'bg-environnement-50 dark:bg-environnement-900/20',
    textClass: 'text-environnement-700 dark:text-environnement-400',
    icon: 'E',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function DomainBadge({
  domain,
  size = 'sm',
  showIcon = true,
}: DomainBadgeProps) {
  const config = domainConfig[domain];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgClass} ${config.textClass} ${sizeClasses[size]}`}>
      {showIcon && (
        <span className='flex h-4 w-4 items-center justify-center rounded-full bg-current/10 text-[10px] font-bold'>
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );
}

export function getDomainFromCode(code: string): Domain | null {
  const lowerCode = code.toLowerCase();
  if (lowerCode.includes('qualit')) return 'qualite';
  if (lowerCode.includes('secur')) return 'securite';
  if (lowerCode.includes('enviro')) return 'environnement';
  return null;
}
