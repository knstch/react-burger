import doneImg from "../../../assets/done.png"
import styles from "./BurgerContractor.module.css"

const CheckoutModal = () => {
    return (
        <div className={`defaultFlexCol mb-30`}>
            <h1 className={`text text_type_digits-large ${styles.orderNumber} mt-10`}>12345</h1>
            <span className={`text text_type_main-medium mt-8`}>идентификатор заказа</span>
            <img src={doneImg} alt={"done"} className={`mt-15`}></img>
            <span className={`text text_type_main-small mt-15 mb-2`}>Ваш заказ начали готовить</span>
            <span className={`text text_type_main-default text_color_inactive`}>Дождитесь готовности на орбитальной станции</span>
        </div>
    )
}

export default CheckoutModal