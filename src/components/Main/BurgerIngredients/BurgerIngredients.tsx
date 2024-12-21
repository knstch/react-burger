import React from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './BurgerIngredients.module.css';
import IngredientsSection from './BurgerIngredientsSection'
import {FoodItemsProps} from "../../CommonInterfaces/interfaces";

const ingredientTypes: string[] = ["Булки", "Соусы", "Начинки"]

const BurgerIngredients: React.FC<FoodItemsProps> = (props) => {
    return (
        <section className={`mt-10 ${styles.burgerModal} p-4`}>
            <div className={styles.modalTitleWrapper}>
                <h1 className={`text text_type_main-large ${styles.modalTitle}`}>Собери бургер</h1>
            </div>
            <IngredientsTab/>
            <li className={`${styles.noNumbering} ${styles.ingredientsSectionContainer} mt-10`}>
                {
                    ingredientTypes.map((title, idx) => (
                        <IngredientsSection key={idx} ingredients={props.FoodItems} title={title} />
                    ))
                }
            </li>
        </section>
    )
}

const IngredientsTab = () => {
    const [current, setCurrent] = React.useState('Булки')
    return (
        <div className={`mt-5 ${styles.tabs}`}>
            <Tab value="Булки" active={current === 'Булки'} onClick={setCurrent}>
                Булки
            </Tab>
            <Tab value="Соусы" active={current === 'Соусы'} onClick={setCurrent}>
                Соусы
            </Tab>
            <Tab value="Начинки" active={current === 'Начинки'} onClick={setCurrent}>
                Начинки
            </Tab>
        </div>)
}

export default BurgerIngredients;