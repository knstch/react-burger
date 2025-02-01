import React from "react";
import styles from "./BurgerIngredients.module.css";
import IngredientCard from './BurgerIngredientCard'
import {FoodItem, ingredientSectionData} from "../ApiContracts/Contracts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import ModalOverlay from "../Modal/ModalOverlay";
import BurgerIngredientModal from "./BurgerIngredientModal";
import {ingredientsSlice} from "../../../services/reducers/ingredients";

const ingredientsTitleToEnum = new Map<string, string>()
ingredientsTitleToEnum.set("Булки", "bun")
ingredientsTitleToEnum.set("Начинки", "main")
ingredientsTitleToEnum.set("Соусы", "sauce")

const IngredientsSection: React.FC<ingredientSectionData> = (props) => {
    const { data } = useSelector((state: RootState) => state.ingredientsReducer.ingredientsList)
    const filteredIngredients = data.filter(ingredient => ingredient.type === ingredientsTitleToEnum.get(props.title))

    const [modalVisibility, setModalVisibility] = React.useState(false)

    const toggleModal = () => {
        setModalVisibility(!modalVisibility)
    }

    const dispatch = useDispatch()
    const { actions } = ingredientsSlice

    return (
        <ol className={`${styles.ingredientsSection} mt-10`}>
            <div className={``}>
                <h2 className={`text text_type_main-medium`}>{props.title}</h2>
            </div>
            <li className={`${styles.noNumbering} ${styles.ingredientsContainer} pt-6 pl-4 mb-10`}>
                {
                    filteredIngredients.map((ingredient: FoodItem, i) => (
                        <IngredientCard key={i} id={ingredient._id} onClick={() => {
                            toggleModal()
                            dispatch(actions.setOpenedCard(ingredient._id))
                        }}/>
                    ))
                }
            </li>
            {
                modalVisibility && (
                    <ModalOverlay Title={"Детали ингредиента"} CloseFunc={() => {
                        toggleModal()
                        dispatch(actions.removeOpenedCard(''))
                    }}>
                        <BurgerIngredientModal/>
                    </ModalOverlay>
                )
            }
        </ol>
    )
}

export default IngredientsSection