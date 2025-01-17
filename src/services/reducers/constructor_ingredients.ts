import {createSlice} from "@reduxjs/toolkit";
import {FoodItem} from "../../components/Main/ApiContracts/Contracts";

interface burgerConstructorData {
    foodItems: FoodItem[],
    totalCost: number,
}

const initialState: burgerConstructorData = {
    foodItems: [],
    totalCost: 0,
}

const constructorIngredientsSlice = createSlice({
    name: "constructorIngredients",
    initialState: initialState,
    reducers: {
        addIngredient: (state, action) => {
            state.foodItems.push(action.payload)
        },
        getTotalCost: (state, _) => {
            const cost = state.foodItems.reduce((acc, val) => {
                return acc + val.price;
            }, 0)
            state = {
                ...state,
                totalCost: cost,
            }
        },
    }
})

export default constructorIngredientsSlice.reducer;