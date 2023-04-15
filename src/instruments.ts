import { Reverb, Synth } from 'tone';
import { Grid } from './context/StageManager';
import { Point } from './context/SessionManager';
import {
  Instrument,
  InstrumentOptions,
} from 'tone/build/esm/instrument/Instrument';
import { Scale } from 'tonal';

const instruments: Record<string, InstrumentBundle> = {};

export class DefaultNoteBed implements NoteBed {
  readonly viewportWidth = 844;
  readonly viewportHeight = 390;
  vCellSize;
  hCellSize;
  noteGrid: string[][];

  constructor(private grid: Grid, private noteSet: string[]) {
    this.vCellSize = this.viewportHeight / grid.rows;
    this.hCellSize = this.viewportWidth / grid.columns;
    this.noteGrid = [];

    this.createNotes();
  }

  getGrid() {
    return this.grid;
  }

  getCell(point: Point): Cell {
    return {
      x: Math.floor(point.x / this.hCellSize),
      y: Math.floor(point.y / this.vCellSize),
    };
  }

  getNote(point: Point): string {
    const cell = this.getCell(point);

    return this.noteGrid[cell.y][cell.x];
  }

  getNoteSet() {
    return this.noteSet;
  }

  private createNotes() {
    this.noteSet;
    this.grid;

    let noteCount = 0;
    let minOctave = 2;
    let maxOctave = 6;

    for (let i = this.grid.rows - 1; i >= 0; i--) {
      for (
        let j = i, k = 0;
        j < this.grid.rows && k < this.grid.columns;
        j++, k++
      ) {
        this.noteGrid[j] = this.noteGrid[j] || [];
        const note = this.noteSet[noteCount++ % this.noteSet.length];
        const octave =
          minOctave +
          (Math.floor(noteCount / this.noteSet.length) %
            (maxOctave - minOctave));
        this.noteGrid[j][k] = `${note}${octave}`;
      }
    }

    for (let i = 1; i < this.grid.columns; i++) {
      for (
        let j = 0, k = i;
        j < this.grid.rows && k < this.grid.columns;
        j++, k++
      ) {
        this.noteGrid[j] = this.noteGrid[j] || [];
        const note = this.noteSet[noteCount++ % this.noteSet.length];
        const octave =
          (minOctave + Math.floor(noteCount / this.noteSet.length)) % maxOctave;
        this.noteGrid[j][k] = `${note}${octave}`;
      }
    }

    console.log('Note Grid', this.noteGrid);
  }
}

export function instrumentFor(index: number): InstrumentBundle {
  if (!instruments[index]) {
    instruments[index] = instrument0();
  }

  return instruments[index];
}
export type Cell = { x: number; y: number };

export interface NoteBed {
  getGrid(): Grid;
  getCell(point: Point): Cell;
  getNote(point: Point): string;
  getNoteSet(): string[];
}

export interface InstrumentBundle {
  instrument: Instrument<InstrumentOptions>;
  noteBed: NoteBed;
}

export function instrument0(): InstrumentBundle {
  // Create a new synth with a "sine" waveform
  const synth = new Synth({
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.005,
      decay: 1,
      sustain: 0,
      release: 0.5,
    },
  });

  // Create a new reverb effect with a longer decay time and more wetness
  const reverb = new Reverb({
    decay: 5,
    wet: 0.5,
  }).toDestination();

  // Connect the synth to the reverb and start it
  synth.connect(reverb);

  // Trigger the synth with a bell-like pattern
  // synth.triggerAttackRelease(['C4', 'G4', 'E5', 'G5'], '4n');

  // Connect the reverb to the master output
  reverb.toDestination();

  return {
    instrument: synth,

    noteBed: new DefaultNoteBed(
      { rows: 10, columns: 24 },
      Scale.get('C major').notes
    ),
  };
}
