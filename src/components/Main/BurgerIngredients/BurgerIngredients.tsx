import React, {useState, useEffect} from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import axios from "axios";
import styles from './BurgerIngredients.module.css';
import IngredientsSection, {FoodItem} from './BurgerIngredientsSection'

const burgerApiHost = `${process.env.REACT_APP_FOOD_API_HOST}`

interface IngredientsApiResponse {
    success: boolean;
    data: FoodItem[];
}

const apiErrorMsg = 'Упс! Космические тараканы сожрали интернет и я не могу получить ингредиенты'
const ingredientTypes: string[] = ["Булки", "Соусы", "Начинки"]

const BurgerIngredients = () => {
    const [error, setError] = useState("");
    const [ingredients, setIngredients] = useState<FoodItem[]>([])
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
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

    if (loading) {
        return <div className="mt-10">Loading...</div>;
    }

    return (
        <section className={`mt-10 ${styles.burgerModal} p-4`}>
            <div className={styles.modalTitleWrapper}>
                <h1 className={`text text_type_main-large ${styles.modalTitle}`}>Собери бургер</h1>
            </div>
            <IngredientsTab/>
            <li className={`${styles.noNumbering} ${styles.ingredientsSectionContainer} mt-10`}>
                {
                    ingredientTypes.map((title, idx) => (
                        <IngredientsSection key={idx} ingredients={ingredients} title={title} />
                    ))
                }
            </li>
        </section>
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

export default BurgerIngredients;