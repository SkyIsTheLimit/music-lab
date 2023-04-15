import { ContextStarter } from '@/archive/ContextStarter';
import { GridPerformer } from '@/archive/GridPerformer';
import { Play, Stop } from '@/atoms/icons';
import Head from 'next/head';
import { useState } from 'react';
import { Scale } from 'tonal';

export default function Draw() {
  const [isPlaying, setIsPlaying] = useState(false);

  function startTone(playing?: boolean) {
    setIsPlaying((isPlaying) => playing ?? !isPlaying);
  }

  const scale = Scale.get('Db mixolydian').notes;
  const customScale = [
    scale[0],
    scale[4],
    scale[1],
    scale[5],
    scale[2],
    scale[6],
    scale[3],
    scale[4],
  ];

  return (
    <>
      <Head>
        <title>Music Lab</title>
      </Head>
      <main>
        <ContextStarter />

        <div className='relative z-10 inline-block'>
          <button
            className='flex items-center justify-center p-8 text-white bg-pink-400 border-2 border-black rounded-full'
            onClick={() => startTone()}
          >
            {isPlaying && <Stop className='w-24 h-24' />}
            {!isPlaying && <Play className='w-24 h-24' />}
          </button>
        </div>
        <GridPerformer
          timeSignature={[4, 4]}
          measures={4}
          subdivisions={1}
          scale={customScale}
          play={isPlaying}
          className='w-[100vw] h-[100vh] fixed left-0 top-0'
          rows={14}
        />
      </main>
    </>
  );
}
