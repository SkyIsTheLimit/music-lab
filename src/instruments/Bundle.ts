import { NoteBed } from './DefaultNoteBed';
import { Sampler } from 'tone';

export interface InstrumentBundle {
  instrument(): Sampler;
  noteBed(): NoteBed;
  load(): void;
}
