import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface FeedResponse {
    orders: Order[];
    total: number;
    totalToday: number;
    message: string;
}

interface Order {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    number: number;
}

interface FeedState {
    FeedResponse: FeedResponse;
    WsConnState: string;
}

const initialState: FeedState = {
    FeedResponse: {
        orders: [],
        total: 0,
        totalToday: 0,
        message: "",
    },
    WsConnState: "",
}

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        wsConnectionStart: (state, _: PayloadAction<string>) => {
            state.FeedResponse = {
                orders: [],
                total: 0,
                totalToday: 0,
                message: "",
            };
            state.WsConnState = 'connecting';
        },
        wsConnectionSuccess: (state, _: PayloadAction) => {
            state.WsConnState = 'connected';
        },
        wsConnectionError: (state, _: PayloadAction<Event>) => {
            state.WsConnState = 'error';
        },
        wsGetMessage: (state, action: PayloadAction<FeedResponse>) => {
            if (action.payload.orders) {
                state.FeedResponse.orders = action.payload.orders
            }
            if (action.payload.total) {
                state.FeedResponse.total = action.payload.total
            }
            if (action.payload.totalToday) {
                state.FeedResponse.totalToday = action.payload.totalToday
            }
        },
        wsConnectionClosed: (state, _: PayloadAction) => {
            return {
                ...state,
                WsConnState: 'closed',
            }
        }
    },
})

export default ordersSlice.reducer;