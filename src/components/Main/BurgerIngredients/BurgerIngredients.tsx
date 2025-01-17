import React from "react";
import styles from './BurgerIngredients.module.css';
import IngredientsSection from './BurgerIngredientsSection'
import IngredientsTab from "./BurgerIngredientTab";

const ingredientTypes: string[] = ["Булки", "Соусы", "Начинки"]

const BurgerIngredients = () => {
    return (
        <section className={`mt-10 ${styles.ingredientsSectionContainer} p-4`}>
            <div className={styles.modalTitleWrapper}>
                <h1 className={`text text_type_main-large ${styles.modalTitle}`}>Собери бургер</h1>
            </div>
            <IngredientsTab/>
            <li className={`${styles.noNumbering} ${styles.ingredientsSectionContainer} mt-10`}>
                {
                    ingredientTypes.map((title, idx) => (
                        <IngredientsSection key={idx} title={title} />
                    ))
                }
            </li>
        </section>
    )
}

export default BurgerIngredients;