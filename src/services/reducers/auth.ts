import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    IsAuthorized: boolean;
    RegisterState: string;
}

const initialState: AuthState = {
    IsAuthorized: false,
    RegisterState: ""
}

export const authStateSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, _) => {
            state.IsAuthorized = true;
        },
        logOut: (state, _) => {
            state.IsAuthorized = false;
            state.RegisterState = "";
        },
        setAuthState: (state, action: PayloadAction<string>) => {
            state.RegisterState = action.payload;
        }
    }
})

export default authStateSlice.reducer;