import {useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import {useParams} from "react-router-dom";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import styles from "./FeedPiece.module.css"
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {formatDate, getStatus} from "../../../common/common";
import axios from "axios";

interface Ingredient {
    id: string
    img: string
    name: string
    price: number
    qty: number
}

interface Order {
    _id: string;
    ingredients: string[];
    status: string;
    name: string;
    createdAt: string;
    number: number;
}

interface FetchOrderResp {
    success: boolean;
    orders: Order[];
}

interface FeedPieceProps {
    isAuthorized?: boolean;
}

const FeedPiece: React.FC<FeedPieceProps> = ({isAuthorized}) => {
    const { number } = useParams()

    const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const orderFromStore  = useSelector((state: RootState) => state.ordersReducer.FeedResponse.orders.find((order) => String(order.number) === number));
    const allIngredients = useSelector(
        (state: RootState) => state.ingredientsReducer.ingredientsList.data
    );

    const order = orderFromStore || fetchedOrder

    const ingredients: Ingredient[] = useMemo(() => {
        if (!order) {
            return [];
        }

        const counts: Record<string, number> = {};
        for (const id of order.ingredients) {
            counts[id] = (counts[id] || 0) + 1;
        }

        return Object.entries(counts).map(([id, qty]) => {
            const master = allIngredients.find(i => i._id === id);
            if (master) {
                return {
                    id,
                    qty,
                    name: master.name,
                    price: master.price,
                    img: master.image,
                };
            } else {
                return {
                    id,
                    qty,
                    name: 'Неизвестный ингредиент',
                    price: 0,
                    img: '',
                };
            }
        });
    }, [order, allIngredients]);

    const fetchOrder = useCallback(async () => {
        if (!number) return;
        setIsLoading(true);
        setFetchError(null);

        try {
            const resp = await axios.get<FetchOrderResp>(
                `https://norma.nomoreparties.space/api/orders/${number}`
            );
            if (resp.data.success && resp.data.orders.length > 0) {
                setFetchedOrder(resp.data.orders[0]);
            } else {
                setFetchError('Заказ не найден на сервере');
            }
        } catch (err) {
            console.error(err);
            setFetchError('Ошибка при загрузке заказа');
        } finally {
            setIsLoading(false);
        }
    }, [number]);

    useEffect(() => {
        if (!orderFromStore) {
            fetchOrder();
        }
    }, [orderFromStore, fetchOrder]);

    if (isAuthorized !== undefined) {
        if (!isAuthorized) {
            return <span>Доступ запрещен</span>
        }
    }

    if (!order) {
        return (
            <section>
                <span>Заказ не найден</span>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section>
                <span>Загрузка...</span>
            </section>
        )
    }

    if (fetchError) {
        return (
            <section>
                <span>Ошибка: {fetchError}</span>
            </section>
        )
    }

    const total = ingredients.reduce(
        (acc: number, ingredient: Ingredient) => acc + ingredient.price * ingredient.qty,
        0
    );

    return (
        <section className={styles.order}>
            <span className={`mb-10 text text_type_digits-default ${styles.orderNumber}`}>#{order.number}</span>
            <span className={`text_type_main-medium mb-3`}>{order.name}</span>
            <span className={`mb-15 text_type_main-default ${order.status === 'done' ? 'orderSuccessStatusColor' : ''}`}>{getStatus(order.status)}</span>
            <span className={`text_type_main-medium mb-6`}>Состав:</span>
            <div className={`${styles.ingredientsList}`}>
                {ingredients.map((ingredientData, idx) => (
                    <div key={idx} className={`${styles.ingredient} mr-4`}>
                        <div className={styles.ingredientWrapper}>
                            <div className={`${styles.ingredientImgWrapper}`}>
                                <img src={ingredientData.img} alt={ingredientData.name} className={styles.ingredientImg} />
                            </div>
                            <span className={`text_type_main-default`}>{ingredientData.name}</span>
                        </div>
                        <div className={styles.ingredientWrapper}>
                            <span className={`${styles.ingredientPrice} text_type_digits-default`}>{ingredientData.qty} x {ingredientData.price}</span>
                            <CurrencyIcon type={"primary"}/>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${styles.ingredient} mt-20 mb-10`}>
                <span className={`text_type_main-default text_color_inactive`}>{formatDate(order.createdAt)}</span>
                <div className={styles.ingredientWrapper}>
                    <span className={`${styles.ingredientPrice} text_type_digits-default`}>{total}</span>
                    <CurrencyIcon type={"primary"}/>
                </div>
            </div>
        </section>
    )
}

export default FeedPiece;