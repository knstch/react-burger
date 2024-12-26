import {FoodItem} from "../Main/ApiContracts/Contracts";

export interface FoodItemsProps {
    FoodItems: FoodItem[];
}

export interface NutritionFacts {
    Calories: number
    Proteins: number
    Fat: number
    Carbohydrates: number
}