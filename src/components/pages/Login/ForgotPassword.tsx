import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import styles from "./Login.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {authStateSlice} from "../../../services/reducers/auth";
import {forgotPassword} from "./authStates";
import {useAppDispatch} from "../../../services/hocs";

const passwordResetURL = 'https://norma.nomoreparties.space/api/password-reset'

interface ForgotPasswordProps {
    isAuthorized: boolean;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {
    const [email, setEmail] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (props.isAuthorized) {
            navigate("/");
        }
    }, [navigate, props.isAuthorized]);

    const dispatch = useAppDispatch()
    const { actions } = authStateSlice

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post(passwordResetURL, {
            email,
        }).then(_ => {
                dispatch(actions.setAuthState(forgotPassword));
                navigate("/reset-password");
        }).catch((error: AxiosResponse) => {
            console.error(error);
            if (error.status === 404) {
                setErrorMessage("Пользователь с такой почтой не найден")
            } else {
                setErrorMessage("Ошибка при отправке письма")
            }
        })
    }

    return (
        <section className={styles.login}>
            <div className={styles.loginWrapper}>
                <h2 className={`${styles.loginTitle} text`}>Восстановление пароля</h2>
                <form className={`${styles.loginForm} mt-6`} onSubmit={handlePasswordReset}>
                    <Input
                        type={"email"}
                        placeholder={"E-mail"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}/>
                    <Button type={"primary"} size="medium" htmlType="submit">Восстановить</Button>
                    {
                        errorMessage && <p>{errorMessage}</p>
                    }
                </form>
            </div>
            <div className={`mt-20 text text_type_main-default ${styles.loginOptions}`}>
                <span className={styles.loginOption}>Вспомнили пароль?<Link
                    className={styles.loginOptionLink}
                    to={"/login"}
                >Войти</Link></span>
            </div>
        </section>
    )
}

export default ForgotPassword;