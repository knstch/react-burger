import React from "react";
import styles from "./BurgerIngredients.module.css";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";

interface IngredientsTabProps {
    activeTab: string
    setActiveTab: (activeTab: string) => void
}

const IngredientsTab: React.FC<IngredientsTabProps> = (props) => {
    return (
        <div className={`mt-5 ${styles.tabs}`}>
            <Tab value="Булки" active={props.activeTab === 'Булки'} onClick={() => props.setActiveTab("Булки")}>
                Булки
            </Tab>
            <Tab value="Соусы" active={props.activeTab === 'Соусы'} onClick={() => props.setActiveTab("Соусы")}>
                Соусы
            </Tab>
            <Tab value="Начинки" active={props.activeTab === 'Начинки'} onClick={() => props.setActiveTab("Начинки")}>
                Начинки
            </Tab>
        </div>)
}

export default  IngredientsTab;