import {BurgerIcon, ListIcon, Logo, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from './header.module.css';
import React, {FC} from "react";
import {TIconProps} from "@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons/utils";

const Header = () => {
    const orderBtns: MenuItemProps[] = [
        {
            icon: BurgerIcon,
            text: "Конструктор",
            link: ""
        },
        {
            icon: ListIcon,
            text: "Лента заказов",
            link: ""
        },
    ]

    return (
        <header>
            <div className={`${styles.header} p-4`}>
                <div className={styles.btnGroup}>
                    {orderBtns.map((item, i) => (
                        <MenuItem key={i} icon={item.icon} link={item.link} text={item.text}/>
                    ))}
                </div>
                <Logo className={styles.logo}/>
                <MenuItem icon={ProfileIcon} text={"Личный кабинет"} link={""}/>
            </div>
        </header>
    )
}

interface MenuItemProps {
    icon: FC<TIconProps>;
    text: string;
    link: string;
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
    return (
        <button className={`${styles.headerBtn} text text_type_main-default p-4`}>
            <props.icon type={"primary"}></props.icon>
            <span>{props.text}</span>
        </button>
    )
}


export default Header;