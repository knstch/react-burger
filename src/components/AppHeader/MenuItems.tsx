import React, {FC} from "react";
import styles from "./AppHeader.module.css";
import {TIconProps} from "@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons/utils";

export interface MenuItemProps {
    icon: FC<TIconProps>;
    text: string;
    link: string;
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
    return (
        <button className={`${styles.headerBtn} text text_type_main-default p-4`}>
            <a href={props.link} target="_blank" rel="noopener noreferrer" className={styles.headerBtnLine}>
                <props.icon type={"primary"}></props.icon>
                <span>{props.text}</span>
            </a>
        </button>
    )
}

export default MenuItem