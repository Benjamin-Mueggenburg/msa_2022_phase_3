import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>You_Copy? - Code Plagerism Detection</title>
        <meta name="description" content="Code Plagerism Detection" />
        <link rel="icon" href="/favicon.ico" />
        <link 
            href="https://fonts.googleapis.com/css2?family=Oswald&display=optional"
            rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}> 
            YOU_COPY?
          </h1>
        </div>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <SwapHorizIcon className={styles.arrowIcon} />
            <div className={styles.tile}>
              <h3>ORIGINAL CODE</h3>
              <textarea className={styles.textarea} />
            </div>

            <div className={styles.tile}>
              <h3>REFERENCE CODE</h3>
              <textarea className={styles.textarea} />
            </div>
          </div>

          <h1>SIMILARITY: 100%</h1>

        </div>
      </main>

      <footer className={styles.footer}>
      ©2022 Benjamin Mueggenburg
      </footer>
    </div>
  )
}

export default Home
