import { PluckSynth, PolySynth } from 'tone';
import {
  Instrument as ToneInstrument,
  InstrumentOptions as ToneInstrumentOptions,
} from 'tone/build/esm/instrument/Instrument';

export class Instrument {
  private _toneInstrument: ToneInstrument<ToneInstrumentOptions>;

  constructor() {
    this._toneInstrument = new PolySynth({
      maxPolyphony: 4,
    });
  }
}
