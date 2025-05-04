import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import styles from './Feed.module.css'
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {createSelector} from "reselect";
import {ordersSlice} from "../../../services/reducers/orders";

const ordersApiHost = "wss://norma.nomoreparties.space/orders/all"
const iconsOverlap = 15

interface FeedResponse {
    success: boolean;
    orders: Order[];
    total: number;
    totalToday: number;
}

interface Order {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    number: number;
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

const Feed = () => {
    const [feedData, setFeedData] = useState<FeedResponse | null>(null);
    const {actions} = ordersSlice
    const dispatch = useDispatch();
    dispatch(actions.wsConnectionStart(""))

    useEffect(() => {
        const ws = new WebSocket(ordersApiHost);

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data: FeedResponse = JSON.parse(event.data);
                setFeedData(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        return () => {
            ws.close();
        };
    }, []);
    console.log(feedData)
    const readyOrders = feedData?.orders.filter((order) => {
        return order.status === "done"
    })
    const readyOrderNumbers = readyOrders?.map((order) => order.number)

    const inProgressOrders = feedData?.orders.filter((order) => {
        return order.status !== "done"
    })
    const inProgressOrderNumbers = inProgressOrders?.map((order) => order.number)
    return (
        <section className={`${styles.feed} mt-10`}>
            <div>
                {feedData === null ? (
                    <div>Loading...</div>
                ) : (
                    <div className={styles.feedWrapper}>
                        <h1 className={`text text_type_main-large ${styles.feedTitle}`}>Лента заказов</h1>
                        <div className={styles.feedContainer}>
                            <div className={styles.ordersList}>
                                <div className={styles.ordersContainer}>
                                    {
                                        feedData.orders.map((order) => (
                                            <UserOrder
                                                key={order._id}
                                                _id={order._id}
                                                status={order.status}
                                                number={order.number}
                                                ingredients={order.ingredients}
                                                name={order.name}
                                                createdAt={order.createdAt}
                                                updatedAt={order.updatedAt}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            <OrderStatuses readyOrderNumbers={readyOrderNumbers}
                                           inProcessOrderNumbers={inProgressOrderNumbers}
                                           total={feedData.total}
                                           totalToday={feedData.totalToday}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};


const UserOrder: React.FC<Order> = (props) => {
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
        <div className={`p-6 ${styles.order}`}>
            <div className={styles.orderTitle}>
                <span className={`text text_type_digits-default`}>#{props.number}</span>
                <span className={`text text_type_main-default text_color_inactive`}>{formatDate(props.createdAt)}</span>
            </div>
            <span className={`text text_type_main-medium`}>{props.name}</span>
            <div className={styles.ingredientsContainer}>
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
    )
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const time = date.toLocaleTimeString('ru-RU', options);
    const today = 'Сегодня,';

    return `${today} ${time}`;
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