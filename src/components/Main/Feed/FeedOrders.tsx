import React, {useEffect, useRef} from "react";
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import styles from "./Feed.module.css";
import {formatDate, getStatus} from "../../../common/common";
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {createSelector} from "reselect";

interface Order {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    number: number;
    isPersonnel?: boolean;
}

const iconsOverlap = 15

const selectIngredients = (state: RootState) =>
    state.ingredientsReducer.ingredientsList.data;

const selectOrderIngredients = (state: RootState, orderIngredients: string[]) =>
    orderIngredients;


const memoizedIngredientsSelector = createSelector(
    [selectIngredients, selectOrderIngredients],
    (ingredients, orderIngredients) => {
        return ingredients.filter(
            (ingredient) => ingredient._id && orderIngredients.includes(ingredient._id)
        );
    }
);

const UserOrder: React.FC<Order> = (props) => {
    const location = useLocation();

    const ingredients = useSelector((state: RootState) =>
        memoizedIngredientsSelector(state, props.ingredients)
    )

    const totalCost = ingredients.reduce((total, ingredient) => total + ingredient.price, 0);

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef != null) {
            // @ts-ignore
            const icons = containerRef.current.children;

            for (let idx = 0; idx < icons.length; idx++) {
                const icon = icons[idx];
                const position = idx * (icon.offsetWidth - iconsOverlap);
                icon.style.left = `${position}px`;
                icon.style.position = 'absolute';
            }
        }
    }, [ingredients])

    return (
        <Link to={`/${props.isPersonnel ? 'profile/orders' : 'feed'}/${props.number}`} state={{background: location}} className={`pointer ${styles.feedLink}`}>
            <div className={`p-6 ${styles.order} ${props.isPersonnel ? styles.orderPersonnel : ''}`}>
                <div className={styles.orderTitle}>
                    <span className={`text text_type_digits-default`}>#{props.number}</span>
                    <span className={`text text_type_main-default text_color_inactive`}>{formatDate(props.createdAt)}</span>
                </div>
                <span className={`text text_type_main-medium mt-6`}>{props.name}</span>
                {props.isPersonnel && <span
                    className={`${props.status === 'done' ? 'orderSuccessStatusColor' : ''} mt-2`}>{getStatus(props.status)}</span>}
                <div className={`${styles.ingredientsContainer} mt-6`}>
                    <div className={styles.ingredientIconsContainer} ref={containerRef}>
                        {
                            ingredients.map((ingredient, idx) => (
                                <div className={styles.ingredientIcon} key={idx}>
                                    <img src={ingredient.image} alt={`ingredient-${ingredient}`}
                                         className={styles.ingredientIconImg}/>
                                </div>
                            ))
                        }
                    </div>
                    <div className={`${styles.cost} ml-6`}>
                        <CurrencyIcon type="primary"/>
                        <span className={`text text_type_digits-default`}>{totalCost}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserOrder
