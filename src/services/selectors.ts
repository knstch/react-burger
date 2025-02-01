import {RootState} from "./store";
import {createSelector} from "reselect";

const selectFoodItems = (state: RootState) => state.constructorIngredientsReducer.foodItems;

export const selectItemsInConstructor = createSelector(
    [selectFoodItems, (state: RootState, id: string) => id],
    (foodItems, id) => foodItems.filter(item => item._id === id)
)