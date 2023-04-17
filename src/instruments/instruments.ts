import { InstrumentBundle } from './Bundle';
import { instrument0 } from './instrument0';
import { instrument1 } from './instrument1';
import { instrument2 } from './instrument2';

const instruments: Record<number, InstrumentBundle> = {
  0: instrument0(),
  1: instrument1(),
  2: instrument2(),
  3: instrument0(),
};

export function instrumentFor(index: number): InstrumentBundle {
  if (!instruments[index]) {
    instruments[index] = instrument0();
  }

  return instruments[index];
}
