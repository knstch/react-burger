import React from "react";
import styles from "./Feed.module.css";

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

export default OrderStatuses