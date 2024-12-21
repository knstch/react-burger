import {
    Button,
    ConstructorElement,
    CurrencyIcon,
    DragIcon
} from "@ya.praktikum/react-developer-burger-ui-components";
import React from "react";
import styles from './BurgerContractor.module.css';

const BurgerConstructor = () => {
    const mockData: CartItemProps[] = [
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/bun-02.png",
            name: "Краторная булка N-200i",
            cost: 228,
            type: "bun",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
        {
            image: "https://code.s3.yandex.net/react/code/salad.png",
            name: "Мини-салат Экзо-Плантаго",
            cost: 228,
            type: "main",
        },
    ]

    const totalCost = mockData.reduce((acc, val) => {
        return acc + val.cost;
    }, 0)

    return (
        <div className={`mt-25 ${styles.cartContainer}`}>
            <ConstructorContainer items={mockData} />
            <CheckOutBox totalAmount={totalCost}/>
        </div>
    )
}

const ConstructorContainer: React.FC<CartItemsContainerProps> = (props) => {
    const bun: CartItemProps | undefined = props.items.find(ingredient => ingredient.type === "bun")
    const ingredientsWithNoBun: CartItemProps[] = props.items.filter(ingredient => ingredient.type !== "bun");
    return (
        <section className={styles.cartItemsContainer}>
            {
                bun && (
                    <ConstructorElement text={bun.name} price={bun.cost} thumbnail={bun.image} type={"top"} isLocked={true} extraClass={`ml-8 mr-4 ${styles.constructorElement}`}/>
                )
            }
            <li className={styles.cartIngredientsContainer}>
                {
                    ingredientsWithNoBun.map((item, idx) => (
                        <CartItem key={idx} image={item.image} name={item.name} cost={item.cost} type={item.type}/>
                    ))
                }
            </li>
            {
                bun && (
                    <ConstructorElement text={bun.name} price={bun.cost} thumbnail={bun.image} type={"bottom"} isLocked={true} extraClass={`ml-8 mr-4 ${styles.constructorElement}`}/>
                )
            }
        </section>
    )
}

const CartItem: React.FC<CartItemProps> = (props) => {
    return (
        <ol className={styles.cartItemContainer}>
            <DragIcon type={"primary"}/>
            <ConstructorElement text={props.name} thumbnail={props.image} price={props.cost} extraClass={styles.constructorElement} />
        </ol>
    )
}

interface CheckOutBoxProps {
    totalAmount: number
}

const CheckOutBox: React.FC<CheckOutBoxProps> = (props) => {
    return (
        <div className={`mt-10 ${styles.checkOutBox}`}>
            <div className={`cost mr-10`}>
                <span className={`text text_type_main-large mr-1`}>{props.totalAmount}</span>
                <CurrencyIcon type="primary"/>
            </div>
            <Button htmlType="button" type="primary" size="medium">
                Оформить заказ
            </Button>
        </div>
    )
}

interface CartItemsContainerProps {
    items: CartItemProps[]
}

interface CartItemProps {
    image: string,
    name: string,
    cost: number,
    type: string,
}

export default BurgerConstructor;