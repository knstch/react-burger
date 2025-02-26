import styles from "./Login.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {AuthResponse} from "./ApiResponse";
import {SetAuthCookie} from "./Cookie";

interface RegisterProps {
    isAuthorized: boolean;
}

const Register: React.FC<RegisterProps> = (props) => {
    const [errorMessage, setErrorMessage] = useState("");

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!props.isAuthorized) {
            navigate("/");
        }
    }, [props.isAuthorized, navigate]);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('https://norma.nomoreparties.space/api/auth/register', {
            email,
            password,
            name,
        }).then((response: AxiosResponse<AuthResponse>) => {
            SetAuthCookie(() => setErrorMessage(""), response.data.refreshToken, response.data.accessToken)

            navigate("/")
        }).catch((error: AxiosResponse) => {
            console.error(error);
            setErrorMessage("Ошибка при регистрации")
        })
    }

    return (
        <section className={styles.login}>
            <div className={styles.loginWrapper}>
                <h2 className={`${styles.loginTitle} text`}>Регистрация</h2>
                <form className={`${styles.loginForm} mt-6`} onSubmit={handleRegister}>
                    <Input
                        type={"text"}
                        placeholder={"Имя"}
                        value={name}
                        onChange={(e) => setName(e.target.value)} onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}/>
                    <Input
                        type={"email"}
                        placeholder={"E-mail"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}/>
                    <Input type={showPassword ? "text" : "password"}
                           placeholder={"Пароль"}
                           onChange={(e) => setPassword(e.target.value)} value={password}
                           onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                           icon={"ShowIcon"}
                           onIconClick={togglePasswordVisibility}
                    />
                    <Button type={"primary"} size="medium" htmlType="submit">Зарегистрироваться</Button>
                    {
                        errorMessage && <p>{errorMessage}</p>
                    }
                </form>
            </div>
            <div className={`mt-20 text text_type_main-default ${styles.loginOptions}`}>
                <span className={styles.loginOption}>Уже зарегистрированы?<Link
                    className={styles.loginOptionLink}
                    to={"/login"}
                >Войти</Link></span>
            </div>
        </section>
    )
}

export default Register;