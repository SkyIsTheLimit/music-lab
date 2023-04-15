import { useEffect, useRef } from 'react';
import { UserSelector } from '@/molecules/UserSelector';
import { Stage } from '@/molecules/Stage';
import { GestureRecognizer } from '@/layers/GestureRecognizer';
import { Grid, useStageManager } from '@/context/StageManager';
import { useServer } from '@/context/ServerManager';
import { Point, User, useSessionManager } from '@/context/SessionManager';
import { createDot, debounce } from '@/utils';
import { instrumentFor } from '@/instruments';

export default function Stage1() {
  const divRef = useRef<HTMLDivElement>(null);

  const { setStageColor, power, setPower } = useStageManager();
  const { selectedUserId } = useSessionManager();
  const {
    connect,
    disconnect,
    session,
    loadSession,
    subscribe,
    broadcastUserInput,
  } = useServer();

  useEffect(
    () => loadSession(`http://${location.hostname}:8000/session/1`),
    [loadSession]
  );

  useEffect(() => {
    if (session) setStageColor([session.stageColor]);
  }, [session, setStageColor]);

  useEffect(() => {
    if (power) {
      connect();
    } else {
      disconnect();
    }
  }, [power, connect, disconnect]);

  useEffect(() => {
    const quantizePointAndDisplay = debounce((user: User, point: Point) => {
      const { instrument, noteBed } = instrumentFor(user.id);

      if (instrument) {
        const note = noteBed.getNote(point);

        console.log('Playing', note);
        // instrument.triggerAttackRelease(note, '8n');
      }
    });

    subscribe((ev: string, data: Point[]) => {
      if (divRef.current && session && selectedUserId !== null) {
        data.forEach((point) => {
          if (divRef.current) {
            const [_, userId] = ev.split(':');
            const user = session.users[+userId];
            createDot(point, user, divRef.current);

            quantizePointAndDisplay(user, point);
          }
        });
      }
    });
  }, [subscribe, session, selectedUserId]);

  function onNewPoints(points: Point[]) {
    if (selectedUserId !== null) {
      broadcastUserInput(selectedUserId, points);
    }
  }

  function updatePower(power: boolean) {
    setPower(power);
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full' ref={divRef}>
      {selectedUserId === null && session && <UserSelector session={session} />}

      {selectedUserId !== null && session && (
        <GestureRecognizer onNewPoints={onNewPoints} />
      )}
      {selectedUserId !== null && session && <Stage onPower={updatePower} />}
    </div>
  );
}
