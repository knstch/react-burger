export interface User {
    email: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}