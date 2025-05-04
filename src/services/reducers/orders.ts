import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface FeedResponse {
    orders: Order[];
    total: number;
    totalToday: number;
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
        totalToday: 0
    },
    WsConnState: "",
}

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        wsConnectionStart: (state, _: PayloadAction<string>) => {
            state.WsConnState = 'connecting';
        },
        setOrdersData: (state, action: PayloadAction<FeedResponse>) => {
            state.FeedResponse = action.payload
            state.WsConnState = "connected"
        },
        wsConnectionSuccess: (state, _: PayloadAction<Event>) => {
            state.WsConnState = 'connected';
        },
        wsConnectionError: (state, _: PayloadAction<Event>) => {
            state.WsConnState = 'error';
        },
        wsGetMessage: (state, action: PayloadAction<FeedResponse>) => {
            state.FeedResponse.orders = action.payload.orders
            state.FeedResponse.total = action.payload.total;
            state.FeedResponse.totalToday = action.payload.totalToday;
        },
        wsConnectionClosed: (state, _: PayloadAction<CloseEvent>) => {
            state.WsConnState = 'closed';
        }
    },
})

export default ordersSlice.reducer;