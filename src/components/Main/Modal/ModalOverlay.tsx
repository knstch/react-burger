import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import React, {useEffect} from "react";
import styles from "./Modal.module.css"
import ReactDOM from "react-dom";

interface ModalProps {
    Title: string
    CloseFunc: () => void
    children: React.ReactNode;
}

const modalRoot = document.getElementById('modal');

const ModalOverlay: React.FC<ModalProps> = (props) => {
    if (!modalRoot) {
        return null
    }

    const handleOverlayClick = () => {
        props.CloseFunc();
    };

    return ReactDOM.createPortal(
        (
            <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                <Modal {...props}/>
            </div>
        ), modalRoot
    )
}

const Modal: React.FC<ModalProps> = (props) => {
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.CloseFunc()
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [props])

    return (
        <div className={styles.modalContainer} onClick={handleModalClick}>
            <div className={`${styles.modalHeadline} text text_type_main-medium ml-10 mr-10 mt-15`}>
                <h3 className={styles.modalTitle}>{props.Title}</h3>
                <CloseIcon type="primary" onClick={() => props.CloseFunc()} className={`pointer`}/>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default ModalOverlay;