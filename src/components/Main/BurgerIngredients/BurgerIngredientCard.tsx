import React from "react";
import styles from "./BurgerIngredients.module.css";
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import {useDrag} from "react-dnd";
import {DROP_TYPE_INGREDIENT} from "../../../services/dropTypes";

interface cardProps {
    onClick: () => void,
    id: string,
}

const IngredientCard: React.FC<cardProps> = (props) => {
    const item = useSelector((state: RootState) => state.ingredientsReducer.ingredientsList.data.find(ingredient => ingredient._id === props.id))

    const [{isDrag}, dragTarget] = useDrag({
        type: DROP_TYPE_INGREDIENT,
        item: {item},
        collect: monitor => ({
            isDrag: monitor.isDragging()
        })
    })

    const dragTargetRef = React.useRef<HTMLDivElement>(null);
    dragTarget(dragTargetRef)

    if (!item) {
        return null
    }

    return (
        <ol className={`${styles.burgerCard} m-6 mb-8 pointer`}>
            <div className={styles.counter}>
                <Counter count={1}/>
            </div>
            <div onClick={props.onClick} className={styles.burgerCardContent} ref={dragTargetRef}>
                <img src={item.image} alt={item.name} className={`mb-1`}></img>
                <div className={`mb-1 defaultFlexRow`}>
                    <span className={`text text_type_main-default mr-1`}>{item.price}</span>
                    <CurrencyIcon type="primary"/>
                </div>
                <span className={`text text_type_main-default ${styles.burgerCardTitle}`}>{item.name}</span>
            </div>
        </ol>
    )
}

export default IngredientCard