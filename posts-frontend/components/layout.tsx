import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Layout.module.scss';

/**
 * @deprecated Use PageLayout instead.
 * @param props 
 * @returns 
 */
export default function Layout(props: { children: any }): JSX.Element {
  // https://nextjs.org/docs/basic-features/layouts
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <header>
        <h1 className={styles.title}>
          Your ♥ HeartBook ♥
        </h1>
      </header>

      <main className={styles.main}>
        {props.children}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}