import {createSlice} from "@reduxjs/toolkit";

interface checkoutData {
    orderNumber: number,
    name: string,
}

const initialState: checkoutData = {
    orderNumber: 0,
    name: ""
}

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState: initialState,
    reducers: {
        setApiResponse: (state, action)=> {
            return {
                ...state,
                orderNumber: action.payload.order.number,
                name: action.payload.name,
            }
        }
    }
})

export default checkoutSlice.reducer