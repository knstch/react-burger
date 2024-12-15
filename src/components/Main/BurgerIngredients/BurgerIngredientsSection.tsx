import React from "react";
import styles from "./BurgerIngredients.module.css";
import IngredientCard from './BurgerIngredientCard'

const ingredientsTitleToEnum = new Map<string, string>()
ingredientsTitleToEnum.set("Булки", "bun")
ingredientsTitleToEnum.set("Начинки", "main")
ingredientsTitleToEnum.set("Соусы", "sauce")

interface ingredientSectionData {
    title: string
    ingredients: FoodItem[]
}

export interface FoodItem {
    _id: string;
    name: string;
    type: string;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

const IngredientsSection: React.FC<ingredientSectionData> = (props) => {
    const filteredIngredients = props.ingredients.filter(ingredient => ingredient.type === ingredientsTitleToEnum.get(props.title))
    return (
        <ol className={`${styles.ingredientsSection} mt-10`}>
            <div className={``}>
                <h2 className={`text text_type_main-medium`}>{props.title}</h2>
            </div>
            <li className={`${styles.noNumbering} ${styles.ingredientsContainer} pt-6 pl-4 mb-10`}>
                {
                    filteredIngredients.map((ingredient: FoodItem, i) => (
                        <IngredientCard key={i} imgLink={ingredient.image} cost={ingredient.price} title={ingredient.name}/>
                    ))
                }
            </li>
        </ol>
    )
}

export default IngredientsSection