import React, {useEffect, useRef, useState} from "react";
import {RootState} from "../../../services/store";
import styles from './Feed.module.css'
import {ordersSlice} from "../../../services/reducers/orders";
import {getAccessToken} from "../../../common/getAuthCookie";
import OrderStatuses from "./FeedOrderStatuses";
import UserOrder from "./FeedOrders";
import {useAppDispatch, useAppSelector} from "../../../services/hocs";

interface FeedProps {
    isPersonnelFeed?: boolean;
}

const Feed: React.FC<FeedProps> = ({isPersonnelFeed}) => {
    const {actions} = ordersSlice
    const hasConnected = useRef(false);
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!hasConnected.current) {
            if (isPersonnelFeed) {
                const accessToken = getAccessToken()
                if (accessToken) {
                    dispatch(actions.wsConnectionStart(`?token=${accessToken}`))
                    return
                }
                setError('Необходимо залогиниться')
                return
            }
            dispatch(actions.wsConnectionStart('/all'));
            hasConnected.current = true;
        }

        return () => {
            dispatch(actions.wsConnectionClosed());
        }
    }, [dispatch]);

    const orders = useAppSelector((state: RootState) => state.ordersReducer)

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

export default Feed