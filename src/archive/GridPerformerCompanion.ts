import { Piano } from '@/context/piano';
import { TimeSignature } from '@/context/ToneManager';

export type Point = { x: number; y: number };
export type Cell = {
  row: number;
  ats: string;
  at: {
    measure: number;
    beat: number;
    subdivision: number;
  };
};

export interface Companion {
  consume(point: Point): boolean;

  getCell(point: Point): Cell;

  getNotesFor(measure: number, beat: number, subdivision: number): string[];

  play(cell: Cell, piano?: Piano): void;

  setScale(notes: string[]): void;

  setBoundingRect(boundingRect: DOMRect): void;
}

export class GridPerformerCompanion implements Companion {
  notes: Record<string, string>[];
  pitches: Record<string, string>[];
  hDivisionSize: number;
  vDivisionSize: number;
  scale: string[];

  constructor(
    private rows: number,
    private timeSignature: TimeSignature,
    private measures: number,
    private subdivisions: number
  ) {
    this.notes = [];
    this.pitches = [];
    this.hDivisionSize = 1;
    this.vDivisionSize = 1;
    this.scale = [];
  }

  setBoundingRect(boundingRect: DOMRect) {
    this.hDivisionSize = boundingRect.height / this.rows;
    this.vDivisionSize =
      boundingRect.width /
      (this.timeSignature[0] * this.measures * this.subdivisions);
  }

  private getTimeStringForSubdivision(quantizedSubdivision: number) {
    const measure = Math.floor(
      (quantizedSubdivision /
        (this.measures * this.timeSignature[0] * this.subdivisions)) *
        this.measures
    );
    const beat =
      Math.floor(quantizedSubdivision / this.subdivisions) -
      measure * this.timeSignature[0];

    const subdivision =
      quantizedSubdivision -
      beat * this.subdivisions -
      measure * this.timeSignature[0] * this.subdivisions;

    return { measure, beat, subdivision };
  }

  private detectGridCellForPoint(point: Point): Cell {
    const { measure, beat, subdivision } = this.getTimeStringForSubdivision(
      Math.floor(point.x / this.vDivisionSize)
    );

    return {
      row: Math.floor(point.y / this.hDivisionSize),
      ats: `${measure}:${beat}:${subdivision}`,
      at: {
        measure,
        beat,
        subdivision,
      },
    };
  }

  getCell(point: Point): Cell {
    return this.detectGridCellForPoint({
      x: point.x > 0 ? point.x : 0,
      y: point.y > 0 ? point.y : 0,
    });
  }

  consume(point: Point): boolean {
    const cell = this.detectGridCellForPoint(point);

    if (this.notes[cell.row] && this.notes[cell.row][cell.ats]) {
      console.warn('Notes already exist for cell. Skipping');
    } else {
      this.notes[cell.row] = this.notes[cell.row] || [];

      if (
        this.pitches &&
        this.pitches[cell.row] &&
        this.pitches[cell.row][cell.ats]
      ) {
        this.notes[cell.row][cell.ats] = this.pitches[cell.row][cell.ats];
      } else {
        console.error('Pitches not found. Skipping');
      }

      return true;
    }

    return false;
  }

  setScale(notes: string[]): void {
    this.scale = notes;
    let note = 0;
    const totalSubdivisions =
      this.measures * this.timeSignature[0] * this.subdivisions;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < totalSubdivisions; j++) {
        this.pitches[i] = this.pitches[i] || {};

        const { measure, beat, subdivision } =
          this.getTimeStringForSubdivision(j);

        this.pitches[i][`${measure}:${beat}:${subdivision}`] = `${
          this.scale[
            ((i === 0 ? 0 : Object.keys(this.pitches[i - 1]).length) * i + j) %
              this.scale.length
          ]
        }${4 + (Math.floor(note++ / this.scale.length) % 2)}`;
      }
    }
  }

  getNotesFor(measure: number, beat: number, subdivision: number): string[] {
    return this.notes
      .map((row) => row[`${measure}:${beat}:${subdivision}`])
      .filter((_) => _);
  }

  play(cell: Cell, piano?: Piano): void {
    if (piano) {
      piano.triggerAttackRelease(
        this.pitches[
          cell.row >= 0 && cell.row < this.pitches.length
            ? cell.row
            : cell.row < 0
            ? 0
            : this.pitches.length - 1
        ][cell.ats],
        '2n',
        undefined,
        0.75
      );
    } else {
      console.error('Piano was not initialized. Skipping playing notes on it.');
    }
  }
}
