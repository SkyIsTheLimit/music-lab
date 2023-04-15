import { HTMLAttributes, createContext, useContext, useState } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface User {
  id: number;
  name: string;
  color: string;
  points: Point[];
}

export interface Session {
  name: string;
  stageColor: string;
  users: User[];
}

const defaultSession: Session = {
  name: 'Default Session',
  stageColor: 'bg-green-400',
  users: [],
};

export interface SessionManager {
  activeSession: Session;
  selectedUserId: number | null;
}

export interface SessionManagerApi {
  setActiveSession(session: Session): void;
  setSelectedUserId(id: number): void;
}

export const SessionManagerContext = createContext<
  SessionManager & SessionManagerApi
>({
  activeSession: defaultSession,
  selectedUserId: null,

  setActiveSession: (_) => {},
  setSelectedUserId: (_) => {},
});

export function SessionManager({ children }: HTMLAttributes<HTMLElement>) {
  const [activeSession, setActiveSession] = useState<Session>(defaultSession);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <SessionManagerContext.Provider
      value={{
        activeSession,
        selectedUserId,

        setActiveSession,
        setSelectedUserId,
      }}
    >
      {children}
    </SessionManagerContext.Provider>
  );
}

export const useSessionManager = () => useContext(SessionManagerContext);
