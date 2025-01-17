import {
    Button,
    ConstructorElement,
    CurrencyIcon,
    DragIcon
} from "@ya.praktikum/react-developer-burger-ui-components";
import React from "react";
import styles from './BurgerContractor.module.css';
import ModalOverlay from "../Modal/ModalOverlay";
import CheckoutModal from "./CheckoutModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../services/store";

const BurgerConstructor = () => {
    return (
        <div className={`mt-25 ${styles.cartContainer}`}>
            <ConstructorContainer/>
            <CheckOutBox/>
        </div>
    )
}

const ConstructorContainer= () => {
    const ingredients = useSelector((state: RootState) => state.constructorIngredientsReducer.foodItems)

    const bun = ingredients.find(ingredient => ingredient.type === "bun")
    const constructorIngredients = ingredients.filter(ingredient => ingredient.type !== "bun");
    return (
        <section className={styles.cartItemsContainer}>
            {
                bun && (
                    <ConstructorElement text={bun.name} price={bun.price} thumbnail={bun.image} type={"top"} isLocked={true} extraClass={`ml-8 mr-4 ${styles.constructorElement}`}/>
                )
            }
            <li className={styles.cartIngredientsContainer}>
                {
                    constructorIngredients.map((item, idx) => (
                        <CartItem key={idx} id={item._id}/>
                    ))
                }
            </li>
            {
                bun && (
                    <ConstructorElement text={bun.name} price={bun.price} thumbnail={bun.image} type={"bottom"} isLocked={true} extraClass={`ml-8 mr-4 ${styles.constructorElement}`}/>
                )
            }
        </section>
    )
}

interface CartItemProps {
    id: string
}

const CartItem: React.FC<CartItemProps> = (props) => {
    const item = useSelector((state: RootState) => state.constructorIngredientsReducer.foodItems.find(ingredient => ingredient._id === props.id))

    if (!item) {
        return null
    }

    return (
        <ol className={styles.cartItemContainer}>
            <DragIcon type={"primary"}/>
            <ConstructorElement text={item.name} thumbnail={item.image} price={item.price} extraClass={styles.constructorElement} />
        </ol>
    )
}

const CheckOutBox = () => {
    const [modalVisibility, setModalVisibility] = React.useState(false)

    const toggleModal = () => {
        setModalVisibility(!modalVisibility)
    }

    const totalCost = useSelector((state: RootState) => state.constructorIngredientsReducer.totalCost)

    return (
        <div className={`mt-10 ${styles.checkOutBox}`}>
            <div className={`defaultFlexRow mr-10`}>
                <span className={`text text_type_main-large mr-1`}>{totalCost}</span>
                <CurrencyIcon type="primary"/>
            </div>
            <Button htmlType="button" type="primary" size="medium" onClick={toggleModal}>
                Оформить заказ
            </Button>
            {
                modalVisibility && (
                    <ModalOverlay Title={""} CloseFunc={toggleModal}>
                        <CheckoutModal/>
                    </ModalOverlay>
                )
            }
        </div>
    )
}

export default BurgerConstructor;