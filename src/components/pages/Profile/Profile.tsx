import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import React, {useCallback, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {getAuthCookie} from "../../../common/getAuthCookie";
import {refreshToken} from "../../../common/refreshToken";
import styles from "./Profile.module.css"
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../services/store";

interface UserResponse {
    success: boolean;
    user: User;
}

interface User {
    email: string;
    name: string;
}

interface UserUpdatePayload {
    name: string;
    email: string;
    password?: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const { activeTabParam } = useParams()

    const isAuthorized = useSelector((state: RootState) => state.authReducer.IsAuthorized);

    const [isProfileEdited, setIsProfileEdited] = useState<boolean>(false)
    const [name, setName] = useState<string>("");
    const [isNameFieldDisabled, setIsNameFieldDisabled] = useState<boolean>(true);
    const toggleEditName = () => {
        setIsNameFieldDisabled(!isNameFieldDisabled);
        setIsProfileEdited(true);
    }

    const [login, setLogin] = useState<string>("");
    const [isLoginFieldDisabled, setIsLoginFieldDisabled] = useState<boolean>(true);
    const toggleEditLogin = () => {
        setIsLoginFieldDisabled(!isLoginFieldDisabled);
        setIsProfileEdited(true);
    }

    const [password, setPassword] = useState<string>("");
    const [isPasswordFieldDisabled, setIsPasswordFieldDisabled] = useState<boolean>(true);
    const toggleEditPassword = () => {
        setIsPasswordFieldDisabled(!isPasswordFieldDisabled);
        setIsProfileEdited(true);
    }

    const [activeTab, setActiveTab] = useState<string>("Профиль")
    useEffect(() => {
        if (activeTabParam === "orders") {
            setActiveTab("История заказов")
        }
    }, [activeTabParam]);

    const fetchUserData = useCallback(async () => {
        let cookie = getAuthCookie()
        if (!cookie) {
            await refreshToken()
            cookie = getAuthCookie()
        }

        await axios.get('https://norma.nomoreparties.space/api/auth/user', {
            headers: {
                Authorization: cookie
            }
        }).then((response: AxiosResponse<UserResponse>) => {
            setLogin(response.data.user.email)
            setName(response.data.user.name)
        }).catch((error: AxiosResponse) => {
            if (error.status === 401) {
                refreshToken()
                fetchUserData()
            } else {
                console.error(error);
            }
        })
    }, [])

    const editUserData = async () => {
        let cookie = getAuthCookie()
        if (!cookie) {
            await refreshToken()
            cookie = getAuthCookie()
        }

        const payload: UserUpdatePayload = {
            name: name,
            email: login,
        }

        if (password !== "") {
            payload.password = password;
        }

        await axios.patch('https://norma.nomoreparties.space/api/auth/user', payload,
            {
            headers: {
                Authorization: cookie
            }
        }).then((response: AxiosResponse<UserResponse>) => {
            setLogin(response.data.user.email)
            setName(response.data.user.name)
        }).catch((error: AxiosResponse) => {
            if (error.status === 401) {
                refreshToken()
                editUserData()
            } else {
                console.error(error);
            }
        })
    }

    const returnToInitialState = () => {
        setIsProfileEdited(false)
        setIsNameFieldDisabled(true)
        setIsLoginFieldDisabled(true)
        setIsPasswordFieldDisabled(true)
    }

    useEffect(() => {
        if (!isAuthorized) {
            navigate("/login");
        }

        fetchUserData()
    }, [fetchUserData, isAuthorized, navigate])

    return (
        <section className={`${styles.profile} mt-30`}>
            <div className={styles.tabGroup}>
                <span
                    className={`${styles.tabText} text text_type_main-large ${activeTab === "Профиль" ? styles.activeTabText : ""}`}
                    onClick={() => {
                        setActiveTab("Профиль")
                        navigate("/profile")
                    }}>
                    Профиль
                </span>
                <span className={`${styles.tabText} text text_type_main-large ${activeTab === "История заказов" ? styles.activeTabText : ""}`}
                      onClick={() => {
                          setActiveTab("История заказов")
                          navigate("/profile/orders")
                      }}>
                    История заказов
                </span>
                <span className={`${styles.tabText} text text_type_main-large ${activeTab === "Выход" ? styles.activeTabText : ""}`} onClick={() => setActiveTab("Выход")}>
                    Выход
                </span>
                <span className={`text text_type_main-default ${styles.tabGroupComment} mt-20`}>В этом разделе вы можете изменить свои персональные данные</span>
            </div>
                {activeTab === "Профиль" && (
                        <form onSubmit={() => {
                            editUserData()
                            returnToInitialState()
                        }} className={styles.editProfile}>
                            <Input
                                value={name} onChange={e => {
                                setName(e.target.value)
                            }}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                icon={"EditIcon"}
                                placeholder={"Имя"}
                                disabled={isNameFieldDisabled}
                                onIconClick={toggleEditName}
                            />
                            <Input
                                value={login} onChange={e => {
                                setLogin(e.target.value)
                            }}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                icon={"EditIcon"}
                                placeholder={"Логин"}
                                disabled={isLoginFieldDisabled}
                                onIconClick={toggleEditLogin}
                            />
                            <Input
                                value={password}
                                onChange={e => {
                                    setPassword(e.target.value)
                                }}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                                icon={"EditIcon"}
                                placeholder={"Пароль"}
                                disabled={isPasswordFieldDisabled}
                                onIconClick={toggleEditPassword}
                                type={"password"}
                            />
                            {
                                isProfileEdited && (
                                    <div className={styles.editProfileButtonGroup}>
                                        <Button type={"primary"} htmlType={"submit"}>Сохранить</Button>
                                        <Button type={"primary"} htmlType={"button"} onClick={() => {
                                            fetchUserData()
                                            returnToInitialState()
                                        }}>Отменить</Button>
                                    </div>
                                )
                            }
                        </form>)}
        </section>
    )
}

export default Profile