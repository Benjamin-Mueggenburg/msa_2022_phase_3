import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../store'

import { calculateSimilarity, FingerprintDocument} from '../../lib/winnow'
import { config } from '../../lib/config'

export interface ComparisonAppState {
    originalCodeInput: string,
    referenceCodeInput: string,
    similarityScore: number | undefined,
    isDebouncing: boolean
}

const initialState: ComparisonAppState = {
    originalCodeInput: '',
    referenceCodeInput: '',
    similarityScore: undefined,
    isDebouncing: false
}

export const ComparisonAppSlice = createSlice({
    name: 'comparisonApp',
    initialState,
    reducers: {
        setReferenceCodeInput: (state, action: PayloadAction<string>) => {
            state.referenceCodeInput = action.payload;
        },
        setOriginalCodeInput: (state, action: PayloadAction<string>) => {
            state.originalCodeInput = action.payload;
        },
        swapCodeInputFields: (state) => {
            const tempText = state.originalCodeInput;
            
            state.originalCodeInput = state.referenceCodeInput;
            state.referenceCodeInput = tempText;
        },
        setIsDebouncing: (state, action: PayloadAction<boolean>) => {
            state.isDebouncing = action.payload;
        },
        updateComparison: (state) => {
            if (state.originalCodeInput != '' && state.referenceCodeInput != '') {
                let [fingerprint1, docLen1] = FingerprintDocument(state.originalCodeInput, config.k, config.guarantee);
                let [fingerprint2, docLen2] = FingerprintDocument(state.referenceCodeInput, config.k, config.guarantee);
          
                
                if (docLen1 !== 0 && docLen2 !== 0) {
                  let score = calculateSimilarity(fingerprint1, fingerprint2, docLen1, docLen2, config.k);
                  state.similarityScore = score;
                }
              }
        }


    }
})

export const {setReferenceCodeInput, setOriginalCodeInput, swapCodeInputFields, setIsDebouncing, updateComparison} = ComparisonAppSlice.actions

export const selectReferenceCodeInput = (state: AppState) => state.comparisonApp.referenceCodeInput
export const selectOriginalCodeInput = (state: AppState) => state.comparisonApp.originalCodeInput
export const selectIsDebouncing = (state: AppState) => state.comparisonApp.isDebouncing
export const selectSimilarityScore = (state: AppState) => state.comparisonApp.similarityScore

export default ComparisonAppSlice.reducer
