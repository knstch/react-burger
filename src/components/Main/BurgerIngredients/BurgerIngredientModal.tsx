import React from "react";
import {NutritionFacts} from "../../CommonInterfaces/interfaces";
import styles from "./BurgerIngredients.module.css"

interface BurgerIngredientModalProps {
    Name: string,
    Image: string,
    NutritionFacts: NutritionFacts,
}

const IngredientDetails: React.FC<BurgerIngredientModalProps> = (props) => {
    return (
        <div className={styles.modalBurgerCard}>
            <img src={props.Image} alt={props.Name} className={styles.ingredientImage}></img>
            <h4 className={`text text_type_main-medium mt-4`}>{props.Name}</h4>
            <div className={`defaultFlexRow ${styles.nutritionFacts} mt-8 mb-15`}>
                <div className={`defaultFlexCol text text_type_main-default`}>
                    <span className={`text_color_inactive`}>Калории,ккал</span>
                    <span className={`text_color_inactive`}>{props.NutritionFacts.Calories}</span>
                </div>
                <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                    <span className={`text_color_inactive`}>Белки, г</span>
                    <span className={`text_color_inactive`}>{props.NutritionFacts.Proteins}</span>
                </div>
                <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                    <span className={`text_color_inactive`}>Жиры, г</span>
                    <span className={`text_color_inactive`}>{props.NutritionFacts.Fat}</span>
                </div>
                <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                    <span className={`text_color_inactive`}>Углеводы, г</span>
                    <span className={`text_color_inactive`}>{props.NutritionFacts.Carbohydrates}</span>
                </div>
            </div>
        </div>
    )
}

export default IngredientDetails;