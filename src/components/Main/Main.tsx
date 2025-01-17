import BurgerIngredients from "./BurgerIngredients/BurgerIngredients";
import BurgerConstructor from "./BurgerContractor/BurgerConstructor";
import React from "react";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const Main = () => {
    return (
        <main className="mb-20">
            <DndProvider backend={HTML5Backend}>
                <BurgerIngredients />
                <BurgerConstructor/>
            </DndProvider>
        </main>
    )
}

export default Main