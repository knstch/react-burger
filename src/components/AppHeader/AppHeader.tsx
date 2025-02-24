import {BurgerIcon, ListIcon, Logo, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './AppHeader.module.css';
import React from "react";
import MenuItem, { MenuItemProps } from "./MenuItems";

const orderButtons: MenuItemProps[] = [
    {
        icon: BurgerIcon,
        text: "Конструктор",
        link: "/"
    },
    {
        icon: ListIcon,
        text: "Лента заказов",
        link: "/"
    },
]

const AppHeader = () => {
    return (
        <header>
            <div className={`${styles.header} p-4`}>
                <div className={styles.btnGroup}>
                    {orderButtons.map((item, i) => (
                        <MenuItem key={i} icon={item.icon} link={item.link} text={item.text}/>
                    ))}
                </div>
                <Logo className={styles.logo}/>
                <MenuItem icon={ProfileIcon} text={"Личный кабинет"} link={"/profile"}/>
            </div>
        </header>
    )
}


export default AppHeader;