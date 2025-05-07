import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import styles from './Feed.module.css'
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {createSelector} from "reselect";
import {ordersSlice} from "../../../services/reducers/orders";
import {Link, useLocation} from "react-router-dom";
import {formatDate, getStatus} from "../../../common/common";
import {getAccessToken} from "../../../common/getAuthCookie";

const iconsOverlap = 15

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

interface FeedProps {
    isPersonnelFeed?: boolean;
}

const Feed: React.FC<FeedProps> = ({isPersonnelFeed}) => {
    const {actions} = ordersSlice
    const dispatch = useDispatch();
    const hasConnected = useRef(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!hasConnected.current) {
            if (isPersonnelFeed) {
                const accessToken = getAccessToken()
                if (accessToken) {
                    dispatch(actions.wsSecureConnectionStart(accessToken))
                    return
                }
                setError('Необходимо залогиниться')
                return
            }
            dispatch(actions.wsConnectionStart());
            hasConnected.current = true;
        }

        return () => {
            dispatch(actions.wsConnectionClosed());
        }
    }, [dispatch]);

    const orders = useSelector((state: RootState) => state.ordersReducer)

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    const readyOrders = orders.FeedResponse?.orders.filter((order) => {
        return order.status === "done"
    })
    const readyOrderNumbers = readyOrders?.map((order) => order.number)

    const inProgressOrders = orders.FeedResponse?.orders.filter((order) => {
        return order.status !== "done"
    })
    const inProgressOrderNumbers = inProgressOrders?.map((order) => order.number)
    return (
        <section className={`${styles.feed} ${isPersonnelFeed ? styles.feedPersonnel : ''}`}>
            <div className={styles.feedPersonnel}>
                {orders.FeedResponse === null ? (
                    <div>Loading...</div>
                ) : (
                    <div className={`${styles.feedWrapper}`}>
                        {!isPersonnelFeed && <h1 className={`text text_type_main-large ${styles.feedTitle}`}>Лента заказов</h1>}
                        <div className={`${styles.feedContainer}`}>
                            <div className={`${styles.ordersList} ${isPersonnelFeed ? styles.ordersListShorten : ''}`}>
                                <div className={`${styles.ordersContainer} ${isPersonnelFeed ? styles.ordersContainerPersonnel : ''}`}>
                                    {
                                        orders.FeedResponse.orders.map((order) => (
                                                <UserOrder
                                                    key={order._id}
                                                    _id={order._id}
                                                    status={order.status}
                                                    number={order.number}
                                                    ingredients={order.ingredients}
                                                    name={order.name}
                                                    createdAt={order.createdAt}
                                                    updatedAt={order.updatedAt}
                                                    isPersonnel={isPersonnelFeed}
                                                />
                                        ))
                                    }
                                </div>
                            </div>
                            {
                                !isPersonnelFeed && (<OrderStatuses readyOrderNumbers={readyOrderNumbers}
                                                                    inProcessOrderNumbers={inProgressOrderNumbers}
                                                                    total={orders.FeedResponse.total}
                                                                    totalToday={orders.FeedResponse.totalToday}
                                />)
                            }
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};


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


export default Feed

interface OrderStatuesProps {
    readyOrderNumbers?: number[],
    inProcessOrderNumbers?: number[],
    total: number,
    totalToday: number,
}

const OrderStatuses: React.FC<OrderStatuesProps> = (props) => {
    return (
        <div>
            <div className={`${styles.orderNumbersContainer} mb-15`}>
                <div className={styles.orderNumberListContainer}>
                    <span className={`text text_type_main-medium mb-6`}>Готовы</span>
                    <div className={styles.orderNumberList}>
                        {
                            props.readyOrderNumbers?.slice(0, 10).map((orderNumber, idx) => (
                                <span key={idx} className={`text text_type_digits-default text_color_success`}>{orderNumber}</span>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.orderNumberListContainer}>
                    <span className={`text text_type_main-medium mb-6`}>В работе</span>
                    <div className={styles.orderNumberList}>
                        {
                            props.inProcessOrderNumbers?.slice(0, 10).map((orderNumber, idx) => (
                                <span key={idx} className={`text text_type_digits-default`}>{orderNumber}</span>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={`${styles.countContainer} mb-15`}>
                <span className={`text text_type_main-medium`}>Выполнено за все время</span>
                <span className={`text_type_digits-large ${styles.countGlow}`}>{props.total}</span>
            </div>
            <div className={styles.countContainer}>
                <span className={`text text_type_main-medium`}>Выполнено за сегодня</span>
                <span className={`text_type_digits-large ${styles.countGlow}`}>{props.totalToday}</span>
            </div>
        </div>
    )
}