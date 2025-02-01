import {createSlice} from "@reduxjs/toolkit";
import update from 'immutability-helper';

export interface FoodItemShorten {
    image: string,
    name: string,
    price: number,
    type: string,
    _id: string,
}

interface burgerConstructorData {
    foodItems: FoodItemShorten[],
    bun: FoodItemShorten | null,
    totalCost: number,
}

const initialState: burgerConstructorData = {
    foodItems: [],
    bun: null,
    totalCost: 0,
}

export const constructorIngredientsSlice = createSlice({
    name: "constructorIngredients",
    initialState: initialState,
    reducers: {
        addIngredient: (state, action) => {
            if (action.payload.item.type === 'bun') {
                return {
                    ...state,
                    bun: action.payload.item,
                }
            }

            return {
                ...state,
                foodItems: [...state.foodItems, action.payload.item],
            }
        },
        getTotalCost: (state, _) => {
            const cost = state.foodItems.reduce((acc, val) => {
                return acc + val.price
            }, 0)

            let bunCost: number = 0
            if (state.bun !== null) {
                bunCost = state.bun.price * 2
            }
            return {
                ...state,
                totalCost: cost + bunCost,
            }
        },
        removeIngredient: (state, action) => {
            const foodItems = [...state.foodItems]

            if (action.payload >= 0 && action.payload < foodItems.length) {
                foodItems.splice(action.payload, 1)
            }

            const cost = foodItems.reduce((acc, val) => {
                return acc + val.price
            }, 0)

            return {
                ...state,
                foodItems: foodItems,
                totalCost: cost,
            }
        },
        moveIngredient: (state, action) => {
            const { dragIndex, hoverIndex } = action.payload

            if (
                dragIndex < 0 ||
                dragIndex >= state.foodItems.length ||
                hoverIndex < 0 ||
                hoverIndex >= state.foodItems.length
            ) {
                return state
            }

            const updatedFoodItems = update(state.foodItems, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, state.foodItems[dragIndex]],
                ],
            })

            return {
                ...state,
                foodItems: updatedFoodItems,
            }
        },


    }
})

export default constructorIngredientsSlice.reducer;