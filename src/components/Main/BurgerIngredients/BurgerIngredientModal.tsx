import React from "react";
import styles from "./BurgerIngredients.module.css"
import {RootState} from "../../../services/store";
import {useAppSelector} from "../../../services/hocs";

const IngredientDetails = () => {
    const activeCardId = useAppSelector((state: RootState) => state.ingredientsReducer.activeOpenedCardId)

    const item = useAppSelector((state: RootState) => state.ingredientsReducer.ingredientsList.data.find(ingredient => ingredient._id === activeCardId))

    if (!item) {
        return null
    }

    return (
        <div className={styles.modalBurgerCard}>
            <img src={item.image} alt={item.name} className={styles.ingredientImage}></img>
            <h4 className={`text text_type_main-medium mt-4`}>{item.name}</h4>
            <div className={`defaultFlexRow ${styles.nutritionFacts} mt-8 mb-15`}>
                <div className={`defaultFlexCol text text_type_main-default`}>
                    <span className={`text_color_inactive`}>Калории,ккал</span>
                    <span className={`text_color_inactive`}>{item.calories}</span>
                </div>
                <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                    <span className={`text_color_inactive`}>Белки, г</span>
                    <span className={`text_color_inactive`}>{item.proteins}</span>
                </div>
                <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                    <span className={`text_color_inactive`}>Жиры, г</span>
                    <span className={`text_color_inactive`}>{item.fat}</span>
                </div>
                <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                    <span className={`text_color_inactive`}>Углеводы, г</span>
                    <span className={`text_color_inactive`}>{item.carbohydrates}</span>
                </div>
            </div>
        </div>
    )
}

export default IngredientDetails;