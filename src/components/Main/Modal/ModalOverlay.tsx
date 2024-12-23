import {CloseIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import React, {useEffect} from "react";
import styles from "./Modal.module.css"
import ReactDOM from "react-dom";

interface ModalProps {
    Title: string
    Child: React.ReactNode
    CloseFunc: () => void
}

const modalRoot = document.getElementById('modal');

const ModalOverlay: React.FC<ModalProps> = (props) => {
    if (!modalRoot) {
        return null
    }

    return ReactDOM.createPortal(
        (
            <div className={styles.modalOverlay}>
                <Modal {...props}/>
            </div>
        ), modalRoot
    )
}

const Modal: React.FC<ModalProps> = (props) => {
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
        <div className={styles.modalContainer}>
            <div className={`${styles.modalHeadline} text text_type_main-medium ml-10 mr-10 mt-15`}>
                <h3 className={styles.modalTitle}>{props.Title}</h3>
                <CloseIcon type="primary" onClick={() => props.CloseFunc()} className={`pointer`}/>
            </div>
            <div>
                {props.Child}
            </div>
        </div>
    )
}

export default ModalOverlay;