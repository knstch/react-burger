import styles from "./Login.module.css"
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {AuthResponse} from "./ApiResponse";
import {SetAuthCookie} from "./Cookie";
import {useDispatch, useSelector} from "react-redux";
import {authStateSlice} from "../../../services/reducers/auth";
import {RootState} from "../../../services/store";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const dispatch = useDispatch()
    const { actions } = authStateSlice

    const isAuthorized = useSelector((state: RootState) => state.authReducer.IsAuthorized);
    useEffect(() => {
        if (isAuthorized) {
            navigate("/");
        }
    }, [isAuthorized, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('https://norma.nomoreparties.space/api/auth/login', {
            email,
            password
        }).then((response: AxiosResponse<AuthResponse>) => {
            SetAuthCookie(() => setErrorMessage(''), response.data.refreshToken, response.data.accessToken)
            dispatch(actions.login(""))
            navigate("/")
        }).catch((error: AxiosResponse) => {
            console.error(error);
            if (error.status === 401) {
                setErrorMessage("Неверный логин или пароль")
            } else {
                setErrorMessage("Ошибка при авторизации")
            }
        })
    }

    return (
        <section className={styles.login}>
            <div className={styles.loginWrapper}>
                <h2 className={`${styles.loginTitle} text`}>Вход</h2>
                <form className={`${styles.loginForm} mt-6`} onSubmit={handleLogin}>
                    <Input
                        type={"email"}
                        placeholder={"E-mail"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}/>
                    <Input type={showPassword ? "text" : "password"}
                           placeholder={"Пароль"}
                           onChange={(e) => setPassword(e.target.value)} value={password}
                           onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                           icon={"ShowIcon"}
                           onIconClick={togglePasswordVisibility}
                    />
                    <Button type={"primary"} size="medium" htmlType="submit">Войти</Button>
                    {
                        errorMessage && <p>{errorMessage}</p>
                    }
                </form>
            </div>
            <div className={`mt-20 text text_type_main-default ${styles.loginOptions}`}>
                <span className={styles.loginOption}>Вы — новый пользователь?<Link
                    className={styles.loginOptionLink}
                    to={"/register"}
                >Зарегистрироваться</Link></span>
                <span className={styles.loginOption}>Забыли пароль?<Link
                    className={styles.loginOptionLink}
                    to={"/forgot-password"}
                >Восстановить пароль</Link></span>
            </div>
        </section>
)
}

export default Login