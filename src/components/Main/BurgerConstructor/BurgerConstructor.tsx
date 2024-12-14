import React, {useState, useEffect} from "react";
import {Tab, CurrencyIcon, Counter} from "@ya.praktikum/react-developer-burger-ui-components";
import axios from "axios";
import styles from './BurgerConstructor.module.css';

const ingredientsTitleToEnum = new Map<string, string>()
ingredientsTitleToEnum.set("Булки", "bun")
ingredientsTitleToEnum.set("Начинки", "main")
ingredientsTitleToEnum.set("Соусы", "sauce")

const burgerApiHost = `${process.env.REACT_APP_FOOD_API_HOST}/api/ingredients`

interface IngredientsApiResponse {
    success: boolean;
    data: FoodItem[];
}

interface FoodItem {
    _id: string;
    name: string;
    type: string;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

const apiErrorMsg = 'Упс! Космические тараканы сожрали интернет и я не могу получить ингредиенты'

const BurgerConstructor = () => {
    const [error, setError] = useState("");
    const [ingredients, setIngredients] = useState<FoodItem[]>([])
    const ingredientTypes: string[] = ["Булки", "Соусы", "Начинки"]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchFoodItems()

                if (typeof res === "string") {
                    setError(res)
                } else if (res.success) {
                    setIngredients(res.data)
                } else {
                    setError("Failed to fetch ingredients.")
                }
            } catch (error: any) {
                setError(error.message)
            }
        };

        fetchData()
    }, []);

    if (error) {
        return (
            <div className={`mt-10 ${styles.burgerModal}`}>
                <ErrorGettingBurgerIngredients Error={error} />
            </div>
        )
    }

    return (
        <div className={`mt-10 ${styles.burgerModal} p-4`}>
            <div className={styles.modalTitleWrapper}>
                <h1 className={`text text_type_main-large ${styles.modalTitle}`}>Собери бургер</h1>
            </div>
            <IngredientsTab/>
            <li className={`${styles.noNumbering} ${styles.ingredientsSectionContainer} mt-10`}>
                {
                    ingredientTypes.map((_, i) => (
                        <IngredientsSection key={i} ingredients={ingredients} title={ingredientTypes[i]} />
                    ))
                }
            </li>
        </div>
    )
}

interface GettingBurgerErrorProps {
    Error: string;
}

const ErrorGettingBurgerIngredients: React.FC<GettingBurgerErrorProps> = (props) => {
    return (
        <div>
            <h1 className={`text text_type_main-large`}>{props.Error}</h1>
        </div>
    )
}

const IngredientsTab = () => {
    const [current, setCurrent] = React.useState('Булки')
    return (
        <div className={`mt-5 ${styles.tabs}`}>
            <Tab value="Булки" active={current === 'Булки'} onClick={setCurrent}>
                Булки
            </Tab>
            <Tab value="Соусы" active={current === 'Соусы'} onClick={setCurrent}>
                Соусы
            </Tab>
            <Tab value="Начинки" active={current === 'Начинки'} onClick={setCurrent}>
                Начинки
            </Tab>
        </div>)
}

const fetchFoodItems = async (): Promise<IngredientsApiResponse | string> => {
    try {
        const resp = await axios.get<IngredientsApiResponse>(burgerApiHost)
        if (!resp.data.success) {
            return apiErrorMsg;
        }
        return resp.data
    } catch (error) {
        return apiErrorMsg
    }
}

interface cardData {
    imgLink: string,
    cost : number,
    title: string,
}

const IngredientCard: React.FC<cardData> = (props) => {
    return (
        <ol className={`${styles.burgerCard} m-6 mb-8`}>
            <div className={styles.counter}>
                <Counter count={1}/>
            </div>
            <img src={props.imgLink} alt={props.title} className={`mb-1`}></img>
            <div className={`mb-1 cost`}>
                <span className={`text text_type_main-default mr-1`}>{props.cost}</span>
                <CurrencyIcon type="primary" />
            </div>
            <span className={`text text_type_main-default ${styles.burgerCardTitle}`}>{props.title}</span>
        </ol>
    )
}

interface ingredientSectionData {
    title: string
    ingredients: FoodItem[]
}

const IngredientsSection: React.FC<ingredientSectionData> = (props) => {
    const filteredIngredients = props.ingredients.filter(ingredient => ingredient.type === ingredientsTitleToEnum.get(props.title))
    return (
        <ol className={`${styles.ingredientsSection} mt-10`}>
            <div className={``}>
                <h2 className={`text text_type_main-medium`}>{props.title}</h2>
            </div>
            <li className={`${styles.noNumbering} ${styles.ingredientsContainer} pt-6 pl-4 mb-10`}>
                {
                    filteredIngredients.map((ingredient: FoodItem, i) => (
                        <IngredientCard key={i} imgLink={ingredient.image} cost={ingredient.price} title={ingredient.name}/>
                    ))
                }
            </li>
        </ol>
    )
}

export default BurgerConstructor;