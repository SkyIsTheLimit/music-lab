import { Scale } from 'tonal';
import { InstrumentBundle } from './Bundle';
import { DefaultNoteBed, NoteBed } from './DefaultNoteBed';
import { Filter, Reverb, Sampler } from 'tone';
const TJS = require('./tonejs-instruments-master/Tonejs-Instruments');

export function instrument2(): InstrumentBundle {
  let instrument: Sampler,
    noteBed: NoteBed,
    isLoaded = false;

  function load() {
    if (!isLoaded) {
      instrument = new Sampler(
        TJS.SampleLibrary['cello'],
        () => {
          // this code will be executed when the sampler has finished loading
          console.log('Cello loaded');
        },
        '/samples/cello/'
      );
      instrument.set({
        attack: 0.5,
        release: 1,
      });

      const filter = new Filter({
        type: 'lowpass',
        frequency: 1000,
      });
      instrument.connect(filter);

      const reverb = new Reverb().toDestination();
      filter.connect(reverb);
      reverb.wet.value = 0.75;

      noteBed = new DefaultNoteBed(
        // { rows: 10, columns: 24 },
        { rows: 4, columns: 10 },
        Scale.get('E major').notes,
        3,
        4
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
