import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import update from 'immutability-helper';
import {v4 as uuid} from 'uuid';

export interface FoodItem {
    item: FoodItemShorten,
    uniqueId: string
}

interface FoodItemShorten {
    image: string,
    name: string,
    price: number,
    type: string,
    _id: string,
}

interface burgerConstructorData {
    foodItems: FoodItem[],
    bun: FoodItem | null,
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
        addIngredient: {
            reducer: (state, action: PayloadAction<any>) => {
                    if (action.payload.item.type === 'bun') {
                        return {
                            ...state,
                            bun: action.payload,
                        }
                    }
                    console.log(action.payload.item)
                    return {
                        ...state,
                        foodItems: [...state.foodItems, action.payload],
                    }
                    },
            prepare: (ingredient: any) => {
                return {
                    payload: {
                        ...ingredient,
                        uniqueId: uuid()
                    }
                }
            },
},
        getTotalCost: (state, _) => {
            const cost = state.foodItems.reduce((acc, val) => {
                return acc + val.item.price
            }, 0)

            let bunCost: number = 0
            if (state.bun !== null) {
                bunCost = state.bun.item.price * 2
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
                return acc + val.item.price
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
        clearCart: (state, _) => {
            return initialState
        }
    }
})

export default constructorIngredientsSlice.reducer;