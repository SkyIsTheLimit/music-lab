import { Point } from '@/context/SessionManager';
import { Grid } from '@/context/StageManager';

export type Cell = { x: number; y: number };

export interface NoteBed {
  getGrid(): Grid;
  getCell(point: Point): Cell;
  getNote(point: Point): string;
  getNoteSet(): string[];
}

export class DefaultNoteBed implements NoteBed {
  viewportWidth = 844;
  viewportHeight = 390;
  vCellSize;
  hCellSize;
  noteGrid: string[][];

  constructor(
    private grid: Grid,
    private noteSet: string[],
    private minOctave: number,
    private maxOctave: number
  ) {
    if (window) {
      console.log(
        'Updated viewport dimensions',
        window.innerWidth,
        window.innerHeight
      );
      this.viewportWidth = window.innerWidth;
      this.viewportHeight = window.innerHeight;
    }

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
    let minOctave = this.minOctave;
    let maxOctave = this.maxOctave;

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
          minOctave +
          (Math.floor(noteCount / this.noteSet.length) %
            (maxOctave - minOctave));

        this.noteGrid[j][k] = `${note}${octave}`;
      }
    }

    console.log('Note Grid', this.noteGrid);
  }
}
