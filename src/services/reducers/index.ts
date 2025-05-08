import {combineReducers} from "redux";
import ingredientsReducer from "./ingredients";
import constructorIngredientsReducer from "./constructor_ingredients"
import checkoutReducer from "./checkout";
import authReducer from "./auth";
import ordersReducer from "./orders";

export const rootReducer = combineReducers({
    ingredientsReducer,
    constructorIngredientsReducer,
    checkoutReducer,
    authReducer,
    ordersReducer,
})