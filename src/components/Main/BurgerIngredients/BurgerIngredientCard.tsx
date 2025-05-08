import React from "react";
import styles from "./BurgerIngredients.module.css";
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {RootState} from "../../../services/store";
import {useDrag} from "react-dnd";
import {DROP_TYPE_INGREDIENT} from "../../../common/dropTypes";
import {selectItemsInConstructor} from "../../../services/selectors";
import {Link, useLocation} from "react-router-dom";
import {ingredientsSlice} from "../../../services/reducers/ingredients";
import {useAppDispatch, useAppSelector} from "../../../services/hocs";

interface cardProps {
    id: string,
}

const IngredientCard: React.FC<cardProps> = (props) => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { actions } = ingredientsSlice

    const item = useAppSelector((state: RootState) =>
        state.ingredientsReducer.ingredientsList.data.find(
            (ingredient) => ingredient._id === props.id
        )
    )

    const idOfBunInConstructor = useAppSelector(
        (state: RootState) => state.constructorIngredientsReducer.bun?.item._id
    )

    const initialCount = useAppSelector((state: RootState) =>
        selectItemsInConstructor(state, props.id)
    ).length

    const [itemsInConstructor, setItemsInConstructor] = React.useState(initialCount)

    React.useEffect(() => {
        if (item?.type === 'bun') {
            setItemsInConstructor(props.id === idOfBunInConstructor ? 1 : 0)
        } else {
            setItemsInConstructor(initialCount)
        }
    }, [idOfBunInConstructor, props.id, item, initialCount])

    const [, dragTarget] = useDrag({
        type: DROP_TYPE_INGREDIENT,
        item: { item },
        collect: (monitor) => ({
            isDrag: monitor.isDragging(),
        }),
    })

    const dragTargetRef = React.useRef<HTMLDivElement>(null)
    dragTarget(dragTargetRef)

    if (!item) {
        return null
    }

    return (
        <Link onClick={() => {
            dispatch(actions.setOpenedCard(props.id))
        }} to={`/ingredients/${props.id}`} state={{background: location}} className={`${styles.burgerCard} m-6 mb-8 pointer`}>
                <div className={styles.counter}>
                    <Counter count={itemsInConstructor}/>
                </div>
                <div
                    className={styles.burgerCardContent}
                    ref={dragTargetRef}
                >
                    <img src={item.image} alt={item.name} className={`mb-1`}/>
                    <div className={`mb-1 defaultFlexRow`}>
          <span className={`text text_type_main-default mr-1`}>
            {item.price}
          </span>
                        <CurrencyIcon type="primary"/>
                    </div>
                    <span
                        className={`text text_type_main-default ${styles.burgerCardTitle}`}
                    >
          {item.name}
        </span>
                </div>
        </Link>
    )
}


export default IngredientCard