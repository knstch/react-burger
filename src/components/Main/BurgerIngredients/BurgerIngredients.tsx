import React from "react";
import styles from './BurgerIngredients.module.css';
import IngredientsSection from './BurgerIngredientsSection'
import IngredientsTab from "./BurgerIngredientTab";
import {useInView} from "react-intersection-observer";

const BurgerIngredients = () => {
    const [currentActiveTab, setCurrentActiveTab] = React.useState('Булки')

    const [bunRef, bunInView] = useInView({ threshold: 0.01 })
    const [sauceRef, sauceInView] = useInView({ threshold: 0.3 })
    const [fillingRef, fillingInView] = useInView({ threshold: 0.3 })

    React.useEffect(() => {
        if (bunInView) {
            setCurrentActiveTab('Булки')
        } else if (sauceInView) {
            setCurrentActiveTab('Соусы')
        } else if (fillingInView) {
            setCurrentActiveTab('Начинки')
        }
    }, [bunInView, sauceInView, fillingInView])

    return (
        <section className={`${styles.ingredientsSectionContainer} p-4`}>
            <div className={styles.modalTitleWrapper}>
                <h1 className={`text text_type_main-large ${styles.modalTitle}`}>Собери бургер</h1>
            </div>
            <IngredientsTab setActiveTab={setCurrentActiveTab} activeTab={currentActiveTab} />
            <li className={`${styles.noNumbering} ${styles.ingredientsSectionContainer} mt-10`}>
                <div ref={bunRef}>
                    <IngredientsSection title="Булки"/>
                </div>
                <div ref={sauceRef}>
                    <IngredientsSection title="Соусы"/>
                </div>
                <div ref={fillingRef}>
                    <IngredientsSection title="Начинки"/>
                </div>
            </li>
        </section>
    )
}

export default BurgerIngredients;