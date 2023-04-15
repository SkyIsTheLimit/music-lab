import { HTMLAttributes, useEffect, useState } from 'react';

export interface ToggleProps {
  value?: boolean;
  onUpdate?: (value: boolean) => void;
}
export function Toggle({
  value,
  onUpdate,
}: ToggleProps & HTMLAttributes<HTMLInputElement>) {
  const [checked, setChecked] = useState(value || false);

  function onChange() {
    setChecked((checked) => !checked);
  }

  useEffect(() => {
    if (onUpdate) onUpdate(checked);
  }, [checked, onUpdate]);
  return (
    <div className='flex items-center gap-2 px-3 py-2 rounded-full bottom-4 left-4 bg-neutral-950'>
      <span className='ml-2 font-bold text-gray-400 text-smmdfont-medium'>
        Power
      </span>
      <label className='relative inline-flex items-center cursor-pointer'>
        <input
          type='checkbox'
          value={value ? 'checked' : ''}
          className='sr-only peer'
          onChange={onChange}
        />

        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-800"></div>
      </label>
    </div>
  );
}
