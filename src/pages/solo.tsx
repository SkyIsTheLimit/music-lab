import { Point } from '@/archive/GridPerformerCompanion';
import { useServer } from '@/context/ServerManager';
import { User, useSessionManager } from '@/context/SessionManager';
import { useStageManager } from '@/context/StageManager';
import { instrumentFor } from '@/instruments/instruments';
import { GestureRecognizer } from '@/layers/GestureRecognizer';
import { Stage } from '@/molecules/Stage';
import { UserSelector } from '@/molecules/UserSelector';
import { createDot } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { Transport, loaded } from 'tone';

export default function SoloStage() {
  const divRef = useRef<HTMLDivElement>(null);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  const { setStageColor, setPower } = useStageManager();
  const { selectedUserId } = useSessionManager();
  const { session, loadSession } = useServer();

  const perform = (user: User, points: Point[]) => {
    console.log('[PERFORM]', points);
    const { instrument, noteBed } = instrumentFor(user.id);

    if (instrument) {
      const notes = points.map((point) => noteBed().getNote(point));

      //   Transport.schedule(() => {
      // const notesToPlay = notes.filter(
      //   (note, index) => notes.indexOf(note) === index
      // );

      const notesToPlay = notes;
      instrument().triggerAttackRelease(notesToPlay, '8n', undefined, 0.7);
      //   }, 0);

      console.log('Playing', notesToPlay);
      if (Transport.state !== 'started') {
        Transport.start();
      }
    }
  };

  useEffect(() => {
    if (selectedUserId !== null && showInitialLoader) {
      instrumentFor(selectedUserId).load();

      loaded().then(() => setShowInitialLoader(false));
    }
  }, [selectedUserId, showInitialLoader]);

  useEffect(
    () => loadSession(`http://${location.hostname}:8000/session/1`),
    [loadSession]
  );

  useEffect(() => {
    if (selectedUserId !== null && session) {
      const color = session.users[selectedUserId].color;

      setStageColor([color]);
    }
  }, [session, selectedUserId, setStageColor]);

  function onNewPoints(points: Point[]) {
    if (selectedUserId !== null && session) {
      const user = session.users[+selectedUserId];

      points.forEach((point) => {
        if (divRef.current) {
          createDot(point, user, divRef.current);
        }
      });

      perform(user, points);
    }
  }

  function updatePower(power: boolean) {
    setPower(power);
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full' ref={divRef}>
      {selectedUserId === null && session && <UserSelector session={session} />}

      {selectedUserId !== null && showInitialLoader && (
        <div className='fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'>
          <div role='status' className='inline-block'>
            <svg
              aria-hidden='true'
              className='w-16 h-16 mr-2 text-gray-900 animate-spin fill-green-500'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='inline-block mt-2 text-neutral-400'>
              Loading...
            </span>
          </div>
        </div>
      )}
      {selectedUserId !== null && !showInitialLoader && session && (
        <GestureRecognizer onNewPoints={onNewPoints} />
      )}
      {selectedUserId !== null && !showInitialLoader && session && (
        <Stage onPower={updatePower} />
      )}
    </div>
  );
}
