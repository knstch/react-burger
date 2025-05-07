import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./reducers";
import {thunk} from "redux-thunk";
import {socketMiddleware} from "./middleware/middleware";

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk,
        socketMiddleware('wss://norma.nomoreparties.space/orders'))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch