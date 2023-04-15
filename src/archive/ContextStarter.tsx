import { start } from 'tone';
import { useToneManager } from '@/context/ToneManager';
import { Play } from '@/atoms/icons';

export function ContextStarter() {
  const { isStarted, markAsStarted } = useToneManager();

  async function startContext() {
    await start();
    markAsStarted();
  }

  return (
    <>
      {!isStarted && (
        <>
          <div className='fixed top-0 left-0 z-30 w-full h-full bg-black/80'></div>
          <div className='fixed z-50 rounded-full p-4 -translate-x-[50%] -translate-y-[50%] bg-neutral-800 shadow-lg left-1/2 top-1/2'>
            <button
              onClick={startContext}
              className='flex items-center justify-center w-48 h-48 p-4 rounded-full bg-neutral-900'
            >
              <Play className='text-neutral-500 hover:text-neutral-300 w-36' />
            </button>
          </div>
        </>
      )}
    </>
  );
}
