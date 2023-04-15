import {
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Point, Session } from './SessionManager';
import { Socket, io } from 'socket.io-client';

export interface ServerState {
  session?: Session;
}

export interface ServerApi {
  setSession: Dispatch<SetStateAction<Session>>;
  loadSession(url: string): void;
  broadcastUserInput(userId: number, points: Point[]): void;
  connect(): void;
  disconnect(): void;

  subscribe(callback: (ev: string, data: Point[]) => void): void;
}

const ServerContext = createContext<ServerState & ServerApi>({
  loadSession(url: string) {},

  broadcastUserInput(userId: number, points: Point[]) {},
  setSession() {},
  connect() {},
  disconnect() {},
  subscribe() {},
});

export function ServerManager({ children }: HTMLAttributes<HTMLElement>) {
  const ioRef = useRef<Socket | null>(null);
  const [session, setSession] = useState<Session>({
    name: 'Loading',
    stageColor: 'transparent',
    users: [],
  });

  function broadcastUserInput(userId: number, points: Point[]) {
    if (points.length && ioRef.current) {
      ioRef.current.emit(`USER:${userId}`, points);
    }
  }

  const callbacks = useMemo(
    () => [] as ((ev: string, data: Point[]) => void)[],
    []
  );

  const subscribe = useCallback(
    (callback: (ev: string, data: Point[]) => void) => {
      callbacks.push(callback);
    },
    [callbacks]
  );

  const connect = useCallback(() => {
    if (ioRef.current === null) {
      ioRef.current = io(`http://${location.hostname}:8000`);

      ioRef.current.onAny((msg, data: Point[]) => {
        callbacks.forEach((cb) => cb(msg, data));
      });
    }
  }, [callbacks]);

  const disconnect = useCallback(() => {
    if (ioRef.current) {
      ioRef.current.disconnect();
      ioRef.current = null;
    }
  }, []);

  const loadSession = useCallback((url: string) => {
    fetch(url)
      .then((data) => data.json() as unknown as Session)
      .then(setSession);
  }, []);

  return (
    <ServerContext.Provider
      value={{
        session,

        setSession,
        loadSession,
        connect,
        disconnect,
        broadcastUserInput,

        subscribe,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

export const useServer = () => useContext(ServerContext);
