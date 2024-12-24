import React from "react";
import styles from "./BurgerIngredients.module.css";
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import BurgerIngredientModal from "./BurgerIngredientModal";
import ModalOverlay from "../Modal/ModalOverlay";
import {NutritionFacts} from "../../CommonInterfaces/interfaces";

interface cardData {
    imgLink: string,
    cost : number,
    title: string,
    nutritionFacts: NutritionFacts
}

const IngredientCard: React.FC<cardData> = (props) => {
    const [modalVisibility, setModalVisibility] = React.useState(false)

    const toggleModal = () => {
        setModalVisibility(!modalVisibility)
    }

    return (
        <ol className={`${styles.burgerCard} m-6 mb-8 pointer`}>
            <div className={styles.counter}>
                <Counter count={1}/>
            </div>
            <div onClick={toggleModal} className={styles.burgerCardContent}>
                <img src={props.imgLink} alt={props.title} className={`mb-1`}></img>
                <div className={`mb-1 defaultFlexRow`}>
                    <span className={`text text_type_main-default mr-1`}>{props.cost}</span>
                    <CurrencyIcon type="primary"/>
                </div>
                <span className={`text text_type_main-default ${styles.burgerCardTitle}`}>{props.title}</span>
            </div>
            {
                modalVisibility && (
                    <ModalOverlay Title={"Детали ингредиента"} CloseFunc={toggleModal}>
                        <BurgerIngredientModal Name={props.title} Image={props.imgLink}
                                               NutritionFacts={props.nutritionFacts}/>
                    </ModalOverlay>
                )
            }
        </ol>
    )
}

export default IngredientCard