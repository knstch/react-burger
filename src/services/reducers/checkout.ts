import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface checkoutData {
    orderNumber: number,
    name: string,
}

const initialState: checkoutData = {
    orderNumber: 0,
    name: ""
}

interface Order {
    number: number
}

interface PlaceOrderApiResponse {
    name: string,
    order: Order,
    success: boolean
}

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState: initialState,
    reducers: {
        setApiResponse: (state, action: PayloadAction<PlaceOrderApiResponse>)=> {
            return {
                ...state,
                orderNumber: action.payload.order.number,
                name: action.payload.name,
            }
        }
    }
})

export default checkoutSlice.reducer