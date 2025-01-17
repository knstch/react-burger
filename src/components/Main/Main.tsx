import BurgerIngredients from "./BurgerIngredients/BurgerIngredients";
import BurgerConstructor from "./BurgerContractor/BurgerConstructor";
import React from "react";

const Main = () => {
    return (
        <main className="mb-20">
            <BurgerIngredients />
            <BurgerConstructor/>
        </main>
    )
}

export default Main