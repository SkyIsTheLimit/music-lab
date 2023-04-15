import {
  createContext,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Transport, PlaybackState } from 'tone';

export type TimeSignature = [number, number];

export type RootNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export const rootNotes: RootNote[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export type Mode = 'major' | 'minor' | 'mixolydian' | 'lydian' | 'phrygian';
export const modes: Mode[] = [
  'major',
  'minor',
  'mixolydian',
  'lydian',
  'phrygian',
];

export interface KeySignature {
  root: RootNote;
  mode: Mode;
}

export interface ToneState {
  isStarted: boolean;
  transportState: PlaybackState;
  currentBeat: number;
  scaleNotes: string[];
}

export interface ToneControlApi {
  markAsStarted(): void;

  toggleTransport(): void;

  setTempo(tempo: number): void;
  setTimeSignature(timeSignature: TimeSignature): void;
  setCurrentBeat: Dispatch<SetStateAction<number>>;
  setScaleNotes: Dispatch<SetStateAction<string[]>>;
}

// const defaultToneCtx: ToneContext & ToneContextApi = {

// };

const defaultToneCtx: ToneState = {
  isStarted: false,
  transportState: 'stopped',
  currentBeat: 0,
  scaleNotes: [],
};

export const ToneContext = createContext<ToneState & ToneControlApi>({
  ...defaultToneCtx,

  markAsStarted: () => {},

  toggleTransport: () => {},

  setTempo: (_) => {},
  setTimeSignature: (_) => {},
  setCurrentBeat: (_) => {},
  setScaleNotes: (_) => {},
});

export function ToneManager({ children }: HTMLAttributes<HTMLElement>) {
  const [currentBeat, setCurrentBeat] = useState(defaultToneCtx.currentBeat);
  const [isStarted, setIsStarted] = useState(defaultToneCtx.isStarted);
  const [transportState, setTransportState] = useState<PlaybackState>(
    defaultToneCtx.transportState
  );
  const [scaleNotes, setScaleNotes] = useState<string[]>([]);

  function markAsStarted() {
    setIsStarted(true);
  }

  function setTempo(tempo: number) {
    Transport.bpm.value = tempo;
  }

  function setTimeSignature(timeSignature: TimeSignature) {
    Transport.timeSignature = timeSignature;
  }

  function toggleTransport() {
    Transport.toggle();

    setTransportState(Transport.state);
  }

  return (
    <ToneContext.Provider
      value={{
        isStarted,
        transportState,
        currentBeat,
        scaleNotes,

        toggleTransport,

        markAsStarted,

        setTempo,
        setTimeSignature,
        setCurrentBeat,
        setScaleNotes,
      }}
    >
      {children}
    </ToneContext.Provider>
  );
}

export const useToneManager = () => useContext(ToneContext);
