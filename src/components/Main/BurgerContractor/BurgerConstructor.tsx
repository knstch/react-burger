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
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {constructorIngredientsSlice, FoodItem} from "../../../services/reducers/constructor_ingredients";
import {DROP_TYPE_CART_ITEM, DROP_TYPE_INGREDIENT} from "../../../common/dropTypes";
import axios from "axios";
import {apiErrorMsg} from "../../../common/common";
import {checkoutSlice} from "../../../services/reducers/checkout";
import {HTML5Backend} from "react-dnd-html5-backend";
import type { Identifier, XYCoord } from 'dnd-core';
import {useNavigate} from "react-router-dom";

const burgerApiHost = `${process.env.REACT_APP_FOOD_API_HOST+"/orders"}`

const BurgerConstructor = () => {
    const {actions} = constructorIngredientsSlice
    const dispatch = useDispatch()

    const [, dropTarget] = useDrop({
        accept: DROP_TYPE_INGREDIENT,
        drop(item: FoodItem) {
            dispatch(actions.addIngredient(item))
            dispatch(actions.getTotalCost(''))
        },
        collect: monitor => ({
            isHover: monitor.isOver(),
        })
    })

    const dropTargetRef = React.useRef<HTMLDivElement>(null);
    dropTarget(dropTargetRef)

    return (
        <div className={`mt-25 ${styles.cartContainer}`} ref={dropTargetRef}>
            <DndProvider backend={HTML5Backend}>
                <ConstructorContainer/>
            </DndProvider>
            <CheckOutBox/>
        </div>
    )
}

const ConstructorContainer= () => {
    const ingredients = useSelector((state: RootState) => state.constructorIngredientsReducer.foodItems)
    const bun = useSelector((state: RootState) => state.constructorIngredientsReducer.bun)

    const constructorIngredients = ingredients.filter(ingredient => ingredient.item.type !== "bun");

    const dropTargetRef = React.useRef<HTMLDivElement>(null);

    return (
        <section className={styles.cartItemsContainer}>
            {
                bun && (
                    <ConstructorElement
                        text={bun.item.name}
                        price={bun.item.price}
                        thumbnail={bun.item.image}
                        type={"top"}
                        isLocked={true}
                        extraClass={`ml-8 mr-4 ${styles.constructorElement}`}
                    />
                )
            }
            <div ref={dropTargetRef} className={styles.cartIngredientsContainer}>
                {
                    constructorIngredients.map((item, idx) => (
                        <CartItem key={item.uniqueId} id={item.item._id} index={idx} />
                    ))
                }
            </div>
            {
                bun && (
                    <ConstructorElement
                        text={bun.item.name}
                        price={bun.item.price}
                        thumbnail={bun.item.image}
                        type={"bottom"}
                        isLocked={true}
                        extraClass={`ml-8 mr-4 ${styles.constructorElement}`}
                    />
                )
            }
        </section>
    )
}

interface CartItemProps {
    id: string
    index: number
}

interface DragItem {
    index: number
    id: string
    type: string
}

const CartItem: React.FC<CartItemProps> = ({id, index}) => {
    const dispatch = useDispatch()
    const {actions} = constructorIngredientsSlice

    const ingredient = useSelector((state: RootState) => state.constructorIngredientsReducer.foodItems.find(ingredient => ingredient.item._id === id))
    const itemIdx = useSelector((state: RootState) =>
        state.constructorIngredientsReducer.foodItems.findIndex(
            ingredient => ingredient.item._id === id
        )
    )

    const ref = React.useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: DROP_TYPE_CART_ITEM,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover: (item: DragItem, monitor) => {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) {
                return
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            const clientOffset = monitor.getClientOffset()

            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            dispatch(actions.moveIngredient({dragIndex, hoverIndex}))

            item.index = hoverIndex
        },
    })

    const [, drag] = useDrag({
        type:DROP_TYPE_CART_ITEM,
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    if (!ingredient) {
        return null
    }

    const handleRemove = () => {
        dispatch(actions.removeIngredient(itemIdx))
    }

    drag(drop(ref))
    return (
        <div className={styles.cartItemContainer} ref={ref} data-handler-id={handlerId}>
            <DragIcon type={"primary"}/>
            <ConstructorElement text={ingredient.item.name} thumbnail={ingredient.item.image} price={ingredient.item.price} extraClass={styles.constructorElement} handleClose={handleRemove} />
        </div>
    )
}

const CheckOutBox = () => {
    const dispatch = useDispatch()
    const {actions: checkoutActions} = checkoutSlice
    const {actions: constructorActions} = constructorIngredientsSlice
    const navigate = useNavigate()

    const foodItems = useSelector((state: RootState) => state.constructorIngredientsReducer.foodItems)
    const bun = useSelector((state: RootState) => state.constructorIngredientsReducer.bun)

    const [modalVisibility, setModalVisibility] = React.useState(false)

    const toggleModal = () => {
        setModalVisibility(!modalVisibility)
    }

    const extractIds = (): string[] => {
        let ids: string[] = []

        if (bun) {
            ids.push(bun.item._id)
        }

        foodItems.forEach((foodItem, _) => {
            ids.push(foodItem.item._id)
        })

        return ids
    }

    const totalCost = useSelector((state: RootState) => state.constructorIngredientsReducer.totalCost)

    const placeOrder = async () => {
        const response = await axios.post(burgerApiHost, {
            "ingredients": extractIds(),
        })

        if (!response.data.success || response.status !== 200) {
            throw new Error(apiErrorMsg);
        }

        return response.data
    }

    const isAuthorized = useSelector((state: RootState) => state.authReducer.IsAuthorized);

    return (
        <div className={`mt-10 ${styles.checkOutBox}`}>
            <div className={`defaultFlexRow mr-10`}>
                <span className={`text text_type_main-large mr-1`}>{totalCost}</span>
                <CurrencyIcon type="primary"/>
            </div>
            <Button htmlType="button" type="primary" size="medium" onClick={() => {
                if (!isAuthorized) {
                    navigate('/login')
                    return
                }

                if (foodItems.length > 0 && bun) {
                    placeOrder().then(res => {
                        dispatch(checkoutActions.setApiResponse(res))
                        toggleModal()
                    }).then(_ => dispatch(constructorActions.clearCart('')))
                }
            }}>
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