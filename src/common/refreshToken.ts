import axios, {AxiosError, AxiosResponse} from "axios";
import {SetAuthCookie} from "../components/pages/Login/Cookie";

interface RefreshTokenResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
}

export const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken')
    await axios.post("https://norma.nomoreparties.space/api/auth/token", {
        token,
    }).then((response: AxiosResponse<RefreshTokenResponse>)=> {
        SetAuthCookie(() => {}, response.data.refreshToken, response.data.accessToken)
    }).catch((error: AxiosError) => {
        if (error.status === 401) {
            window.location.pathname = '/login';
        }
        console.error(error);
    })
}