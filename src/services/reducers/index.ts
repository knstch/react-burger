import {combineReducers} from "redux";
import ingredientsReducer from "./ingredients";
import constructorIngredientsReducer from "./constructor_ingredients"

export const rootReducer = combineReducers({
    ingredientsReducer,
    constructorIngredientsReducer,
})