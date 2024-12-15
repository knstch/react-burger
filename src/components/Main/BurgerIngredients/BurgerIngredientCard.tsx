import React from "react";
import styles from "./BurgerIngredients.module.css";
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";

interface cardData {
    imgLink: string,
    cost : number,
    title: string,
}

const IngredientCard: React.FC<cardData> = (props) => {
    return (
        <ol className={`${styles.burgerCard} m-6 mb-8`}>
            <div className={styles.counter}>
                <Counter count={1}/>
            </div>
            <img src={props.imgLink} alt={props.title} className={`mb-1`}></img>
            <div className={`mb-1 cost`}>
                <span className={`text text_type_main-default mr-1`}>{props.cost}</span>
                <CurrencyIcon type="primary" />
            </div>
            <span className={`text text_type_main-default ${styles.burgerCardTitle}`}>{props.title}</span>
        </ol>
    )
}

export default IngredientCard