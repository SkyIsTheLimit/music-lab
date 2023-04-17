import { Scale } from 'tonal';
import { InstrumentBundle } from './Bundle';
import { DefaultNoteBed, NoteBed } from './DefaultNoteBed';
import { Reverb, Sampler } from 'tone';
const TJS = require('./tonejs-instruments-master/Tonejs-Instruments');

export function instrument0(): InstrumentBundle {
  let instrument: Sampler,
    noteBed: NoteBed,
    isLoaded = false;

  function load() {
    if (!isLoaded) {
      instrument = new Sampler(
        TJS.SampleLibrary.piano,
        () => {
          // this code will be executed when the sampler has finished loading
          console.log('Piano loaded');
        },
        '/samples/piano/'
      );
      instrument.volume.value = 0.1;

      const reverb = new Reverb().toDestination();
      instrument.connect(reverb);
      reverb.wet.value = 0.75;

      noteBed = new DefaultNoteBed(
        // { rows: 10, columns: 24 },
        { rows: 4, columns: 8 },
        Scale.get('E lydian').notes,
        4,
        6
      );

      isLoaded = true;
    }
  }

  return {
    instrument: () => instrument,
    noteBed: () => noteBed,
    load,
  };
}
