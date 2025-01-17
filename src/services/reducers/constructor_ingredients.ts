import {createSlice} from "@reduxjs/toolkit";

export interface FoodItemShorten {
    image: string,
    name: string,
    price: number,
    type: string,
    _id: string,
}

interface burgerConstructorData {
    foodItems: FoodItemShorten[],
    totalCost: number,
}

const initialState: burgerConstructorData = {
    foodItems: [],
    totalCost: 0,
}

export const constructorIngredientsSlice = createSlice({
    name: "constructorIngredients",
    initialState: initialState,
    reducers: {
        addIngredient: (state, action) => {
            return {
                ...state,
                foodItems: [...state.foodItems, action.payload.item],
            }
        },
        getTotalCost: (state, _) => {
            const cost = state.foodItems.reduce((acc, val) => {
                return acc + val.price;
            }, 0)
            return {
                ...state,
                totalCost: cost,
            }
        },
    }
})

export default constructorIngredientsSlice.reducer;