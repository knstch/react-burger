import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import styles from "./Login.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import {authStateSlice} from "../../../services/reducers/auth";
import {forgotPassword} from "./authStates";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>();

    const navigate = useNavigate();

    const isAuthorized = useSelector((state: RootState) => state.authReducer.IsAuthorized);
    if (isAuthorized) {
        navigate("/");
    }

    const dispatch = useDispatch()
    const { actions } = authStateSlice

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('https://norma.nomoreparties.space/api/password-reset', {
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