import { StageManager } from '@/context/StageManager';
import { PianoProvider } from '@/context/piano';
import { ServerManager } from '@/context/ServerManager';
import { SessionManager } from '@/context/SessionManager';
import { ToneManager } from '@/context/ToneManager';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToneManager>
      {/* <PianoProvider> */}
      <ServerManager>
        <SessionManager>
          <StageManager>
            <Component {...pageProps} />
          </StageManager>
        </SessionManager>
      </ServerManager>
      {/* </PianoProvider> */}
    </ToneManager>
  );
}
