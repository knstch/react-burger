import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./reducers";
import {thunk} from "redux-thunk";

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export type RootState = ReturnType<typeof store.getState>