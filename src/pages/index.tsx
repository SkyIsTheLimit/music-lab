import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Music Lab | Welcome</title>
        <meta
          name='description'
          content='Collaborative music making for novice users.'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, max-scale=1'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h1>Welcome</h1>

        <Link href={'/stage1'}>
          <button className='px-8 py-8 bg-indigo-500'>Goto Stage 1</button>
        </Link>
      </main>
    </>
  );
}
