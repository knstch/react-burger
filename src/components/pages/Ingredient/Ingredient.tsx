import {useParams} from "react-router-dom";
import {RootState} from "../../../services/store";
import styles from "./Ingredient.module.css";
import React from "react";
import {useAppSelector} from "../../../services/hocs";

const Ingredient = () => {
    const { id } = useParams()

    const ingredient = useAppSelector((state: RootState) => {
        return state.ingredientsReducer.ingredientsList.data.find(ingredient => ingredient._id === id)
    })

    return (
        <section className={styles.ingredientSection}>
            {
                ingredient ? (
                    <div className={`${styles.ingredientContainer} mt-10`}>
                        <span className={`text text_type_main-large`}>Детали ингредиента</span>
                        <img src={ingredient.image_large} alt={ingredient.name} className={`mb-4`}/>
                        <span className={`text_type_main-medium`}>{ingredient.name}</span>
                        <div className={`defaultFlexRow ${styles.nutritionFacts} mt-8 mb-15`}>
                            <div className={`defaultFlexCol text text_type_main-default`}>
                                <span className={`text_color_inactive`}>Калории,ккал</span>
                                <span className={`text_type_digits-default text_color_inactive`}>{ingredient.calories}</span>
                            </div>
                            <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                                <span className={`text_color_inactive`}>Белки, г</span>
                                <span className={`text_type_digits-default text_color_inactive`}>{ingredient.proteins}</span>
                            </div>
                            <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                                <span className={`text_color_inactive`}>Жиры, г</span>
                                <span className={`text_type_digits-default text_color_inactive`}>{ingredient.fat}</span>
                            </div>
                            <div className={`defaultFlexCol text text_type_main-default text_color_inactive`}>
                                <span className={`text_color_inactive`}>Углеводы, г</span>
                                <span className={`text_type_digits-default text_color_inactive`}>{ingredient.carbohydrates}</span>
                            </div>
                        </div>
                    </div>
                ) : (<span className={`text text_type_main-large mt-30`}>Ничего не найдено!</span>)
            }
        </section>
    )
}

export default Ingredient;