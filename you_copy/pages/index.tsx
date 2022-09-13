import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {IconButton, Slider} from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import {Accordion} from '@mui/material'
import {AccordionSummary, AccordionDetails} from '@mui/material'

import { calculateSimilarity, Fingerprint, FingerprintDocument} from '../winnow';
import React, { useState, useRef} from 'react'  

const config = {
  k: 4,
  guarantee: 4
}

const Home: NextPage = () => {
  //Component state
  const [originalCodeInput, setOriginalCodeInput] = useState('');
  const [referenceCodeInput, setReferenceCodeInput] = useState('');
  const [similarityScore, setSimilarityScore] = useState<number | undefined>(undefined);
  
  const [isDebouncing, setIsDebouncing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //const [fingerprint1, setFingerprint1] = useState<Fingerprint | undefined>(undefined);
 // const [fingerprint2, setFingerprint2] = useState<Fingerprint | undefined>(undefined);

 // const [fingerprint1DocLen, setFingerprint1DocLen] = useState<number>(0);
  //const [fingerprint2DocLen, setFingerprint2DocLen] = useState<number>(0);


  const updateComparison = () => {
    if (originalCodeInput != '' && referenceCodeInput != '') {
      let [fingerprint1, docLen1] = FingerprintDocument(originalCodeInput, config.k, config.guarantee);
      let [fingerprint2, docLen2] = FingerprintDocument(referenceCodeInput, config.k, config.guarantee);
      //let score = CompareDocuments(originalCodeInput, referenceCodeInput);
      let score = calculateSimilarity(fingerprint1, fingerprint2, docLen1, docLen2, config.k);
      setSimilarityScore(score);
    }
  };

  const updateDebouce = () => {

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    setIsDebouncing(true);

    timerRef.current = setTimeout(() => {
      updateComparison();
      setIsDebouncing(false);
    }, 1000);

  }

  //Handler function for text area
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(event.target.value);
    
    updateDebouce();
  };

  //Swap code input fields
  const swapCodeInputFields = () => {
    const tempText = originalCodeInput;
    setOriginalCodeInput(referenceCodeInput);
    setReferenceCodeInput(tempText);
    updateComparison();
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
            <IconButton color="inherit" className={styles.arrowIcon} onClick={swapCodeInputFields}>
              <SwapHorizIcon  />
            </IconButton>
            <div className={styles.tile}>
              <h3>ORIGINAL CODE</h3>
              <textarea className={styles.textarea} value={originalCodeInput} onChange={(e) => handleChange(e, setOriginalCodeInput)} />
            </div>

            <div className={styles.tile}>
              <h3>REFERENCE CODE</h3>
              <textarea className={styles.textarea} value={referenceCodeInput} onChange={(e) => handleChange(e, setReferenceCodeInput)} />
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
