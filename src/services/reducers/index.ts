import {combineReducers} from "redux";
import ingredientsReducer from "./ingredients";
import constructorIngredientsReducer from "./constructor_ingredients"
import checkoutReducer from "./checkout";

export const rootReducer = combineReducers({
    ingredientsReducer,
    constructorIngredientsReducer,
    checkoutReducer,
})