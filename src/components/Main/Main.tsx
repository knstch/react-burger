import BurgerIngredients from "./BurgerIngredients/BurgerIngredients";
import BurgerConstructor from "./BurgerContractor/BurgerConstructor";
import React from "react";
import {FoodItemsProps} from "../CommonInterfaces/interfaces";

const Main: React.FC<FoodItemsProps> = (props) => {
    return (
        <main>
            <BurgerIngredients FoodItems={props.FoodItems} />
            <BurgerConstructor/>
        </main>
    )
}

export default Main