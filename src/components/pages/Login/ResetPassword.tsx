import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import styles from "./Login.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../services/store";
import {forgotPassword} from "./authStates";
import {authStateSlice} from "../../../services/reducers/auth";

const ResetPassword = () => {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { actions } = authStateSlice

    const authState = useSelector((state: RootState) => state.authReducer);
    useEffect(() => {
        if (authState.IsAuthorized) {
            navigate("/");
        } else if (authState.RegisterState !== forgotPassword) {
            navigate("/forgot-password");
        }
    }, [authState.IsAuthorized, authState.RegisterState, navigate])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('https://norma.nomoreparties.space/api/password-reset/reset', {
            token,
            password
        }).then(_ => {
            dispatch(actions.setAuthState(""));
            navigate("/login")
        }).catch((error: AxiosResponse) => {
            console.error(error);
            if (error.status === 404) {
                setErrorMessage("Неверный код из письма")
            } else {
                setErrorMessage("Ошибка при сбросе пароля")
            }
        })
    }

    return (
        <section className={styles.login}>
            <div className={styles.loginWrapper}>
                <h2 className={`${styles.loginTitle} text`}>Вход</h2>
                <form className={`${styles.loginForm} mt-6`} onSubmit={handleReset}>
                    <Input type={showPassword ? "text" : "password"}
                           placeholder={"Введите новый пароль"}
                           onChange={(e) => setPassword(e.target.value)} value={password}
                           onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                           icon={"ShowIcon"}
                           onIconClick={togglePasswordVisibility}
                    />
                    <Input
                        type={"text"}
                        placeholder={"Введите код из письма"}
                        value={token}
                        onChange={(e) => setToken(e.target.value)} onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}/>
                    <Button type={"primary"} size="medium" htmlType="submit">Сохранить</Button>
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

export default ResetPassword;