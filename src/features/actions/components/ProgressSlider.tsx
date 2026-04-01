import { useState } from 'react';

interface ProgressSliderProps {
  value: number;
  disabled?: boolean;
  onSave: (value: number) => void;
  isLoading?: boolean;
}

export function ProgressSlider({ value, disabled, onSave, isLoading }: ProgressSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    setIsDirty(newValue !== value);
  };

  const handleSave = () => {
    onSave(localValue);
    setIsDirty(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsDirty(false);
  };

  const getProgressColor = (val: number) => {
    if (val === 100) return 'bg-green-500';
    if (val >= 75) return 'bg-blue-500';
    if (val >= 50) return 'bg-yellow-500';
    if (val >= 25) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all ${getProgressColor(localValue)}`}
              style={{ width: `${localValue}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={localValue}
            onChange={handleChange}
            disabled={disabled || isLoading}
            className="w-full mt-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
          {localValue}%
        </span>
      </div>

      {isDirty && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-brand-600 text-white rounded hover:bg-brand-700 disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      )}
    </div>
  );
}
