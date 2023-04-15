import {
  createContext,
  HTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Destination, Reverb, Sampler } from 'tone';
import { Frequency, NormalRange, Time } from 'tone/build/esm/core/type/Units';

export interface PianoContext {
  piano?: Piano;
}

const PianoContext = createContext<PianoContext>({});

export function PianoProvider({ children }: HTMLAttributes<HTMLElement>) {
  const [piano, setPiano] = useState<Piano | undefined>();

  useEffect(() => {
    setPiano(new Piano());
  }, []);

  return (
    <PianoContext.Provider value={{ piano }}>{children}</PianoContext.Provider>
  );
}

export const usePiano = () => useContext(PianoContext);

export class Piano {
  private piano?: Sampler;

  constructor() {
    this.load();
  }

  triggerAttackRelease(
    notes: Frequency[] | Frequency,
    duration: Time | Time[],
    time?: Time,
    velocity?: NormalRange
  ) {
    return this.piano?.triggerAttackRelease(notes, duration, time, velocity);
  }
  async load() {
    this.piano = new Sampler({
      urls: {
        A0: 'A0.mp3',
        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',
        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',
        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',
        C7: 'C7.mp3',
        'D#7': 'Ds7.mp3',
        'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',
        C8: 'C8.mp3',
      },

      release: 10,

      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).chain(new Reverb(2), Destination);

    return new Promise((resolve, reject) => {
      const wait = () => {
        setTimeout(() => {
          if (this.piano?.loaded) {
            resolve(true);
          } else {
            wait();
          }
        }, 500);
      };

      wait();
    });
  }

  isLoaded() {
    return this.piano?.loaded;
  }
}
