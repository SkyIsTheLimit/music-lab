import { Scale } from 'tonal';
import { InstrumentBundle } from './Bundle';
import { DefaultNoteBed, NoteBed } from './DefaultNoteBed';
import { Filter, Reverb, Sampler } from 'tone';
const TJS = require('./tonejs-instruments-master/Tonejs-Instruments');

export function instrument1(): InstrumentBundle {
  let instrument: Sampler,
    noteBed: NoteBed,
    isLoaded = false;

  function load() {
    if (!isLoaded) {
      instrument = new Sampler(
        TJS.SampleLibrary['bass-electric'],
        () => {
          // this code will be executed when the sampler has finished loading
          console.log('Bass Electric loaded');
        },
        '/samples/bass-electric/'
      );

      const filter = new Filter({
        type: 'lowpass',
        frequency: 500,
      });
      instrument.connect(filter);

      const reverb = new Reverb().toDestination();
      filter.connect(reverb);
      reverb.wet.value = 0.75;

      noteBed = new DefaultNoteBed(
        // { rows: 10, columns: 24 },
        { rows: 2, columns: 7 },
        Scale.get('E lydian').notes,
        0,
        2
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
