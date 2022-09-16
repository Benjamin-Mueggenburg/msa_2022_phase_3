import { configureStore } from "@reduxjs/toolkit";
import ComparisonAppSlice from "./slices/comparisonAppSlice";




const store = configureStore({
    reducer: {
        comparisonApp: ComparisonAppSlice,
    },
});

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch



export default store