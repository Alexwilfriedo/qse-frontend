interface ProgressProps {
  value: number;
  className?: string;
  max?: number;
}

export function Progress({ value, className = '', max = 100 }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${className}`}>
      <div
        className="bg-brand-600 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%`, height: '100%' }}
      />
    </div>
  );
}
