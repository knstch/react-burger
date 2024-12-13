import React from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import axios from "axios";

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

const BurgerBuilder = () => {
    fetchFoodItems()
    return (
        <div className="mt-10">
            <h1 className={`text text_type_main-large`}>Собери бургер</h1>
            <IngredientsTab/>
        </div>
    )
}

const IngredientsTab = () => {
    const [current, setCurrent] = React.useState('one')
    return (
        <div style={{ display: 'flex' }} className="mt-10">
            <Tab value="one" active={current === 'one'} onClick={setCurrent}>
                Булки
            </Tab>
            <Tab value="two" active={current === 'two'} onClick={setCurrent}>
                Соусы
            </Tab>
            <Tab value="three" active={current === 'three'} onClick={setCurrent}>
                Начинки
            </Tab>
        </div>)
}

const fetchFoodItems = async (): Promise<IngredientsApiResponse | string> => {
    try {
        const resp = await axios.get<IngredientsApiResponse>(`${process.env.HOST}/api/ingredients`)
        if (!resp.data.success) {
            return apiErrorMsg;
        }
        console.log(resp.data);
        return resp.data
    } catch (error) {
        return apiErrorMsg
    }
}

export default BurgerBuilder