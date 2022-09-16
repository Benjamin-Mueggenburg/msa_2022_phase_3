import type { NextPage } from 'next'
import Head from 'next/head'

import {IconButton} from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

import styles from '../styles/Home.module.css'
import { config } from '../lib/config'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import {setReferenceCodeInput, setOriginalCodeInput, swapCodeInputFields, setIsDebouncing, updateComparison, selectReferenceCodeInput, selectOriginalCodeInput, selectIsDebouncing, selectSimilarityScore} from '../store/slices/comparisonAppSlice'

import CodeEditor from '../components/CodeEditor'



import React, {useRef} from 'react'  


const Home: NextPage = () => {

  const dispatch = useAppDispatch();
  
  const originalCodeInput = useAppSelector(selectOriginalCodeInput);
  const referenceCodeInput = useAppSelector(selectReferenceCodeInput);
  const isDebouncing = useAppSelector(selectIsDebouncing);
  const similarityScore = useAppSelector(selectSimilarityScore);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateDebounce = () => {

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    dispatch(setIsDebouncing(true));

    timerRef.current = setTimeout(() => {
      dispatch(updateComparison())
      dispatch(setIsDebouncing(false));
    }, config.comparisonDebounceTime);

  }

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
            <IconButton color="inherit" className={styles.arrowIcon} onClick={() => dispatch(swapCodeInputFields())}>
              <SwapHorizIcon  />
            </IconButton>
            <div className={styles.tile}>
              <h3>ORIGINAL CODE</h3>
              <CodeEditor className={styles.codeEditor} 
                          value={originalCodeInput} 
                          onChange={(e) => {dispatch(setOriginalCodeInput(e.target.value)); updateDebounce()}}
                    />
            </div>

            <div className={styles.tile}>
              <h3>REFERENCE CODE</h3>
              <CodeEditor className={styles.codeEditor} 
                          value={referenceCodeInput} 
                          onChange={(e) => {dispatch(setReferenceCodeInput(e.target.value)); updateDebounce()}}
                    />
            </div>

          </div>
            


          { similarityScore === undefined ? (
              <div></div>
            ) : (
              <h1 className={styles.similarityScore} style={{opacity: isDebouncing ? 0.5 : 1.0}}>SIMILARITY: {similarityScore.toLocaleString(undefined, {maximumFractionDigits: 2})}%</h1>
            )
          }

        </div>
      </main>

      <footer className={styles.footer}>
      ©2022 Benjamin Mueggenburg
      </footer>
    </div>
  )
}

export default Home
