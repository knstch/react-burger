import {IngredientsApiResponse} from "../../components/Main/ApiContracts/Contracts";
import fetchIngredients from "../actions/getIngredients";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {apiErrorMsg} from "../../common/common";

interface IngredientsState {
    ingredientsList: IngredientsApiResponse,
    activeOpenedCardId: string,
}

const initialState: IngredientsState = {
    ingredientsList: {
        success: true,
        data: [],
        loading: false,
        error: ""
    },
    activeOpenedCardId: "",
}

export const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        setOpenedCard: (state, action) => {
            state.activeOpenedCardId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.ingredientsList.loading = true;
                state.ingredientsList.error = '';
            })
            .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<IngredientsApiResponse>) => {
                state.ingredientsList.loading = false;
                state.ingredientsList.success = action.payload.success;
                state.ingredientsList.data = action.payload.data;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.ingredientsList.loading = false;
                state.ingredientsList.error = action.error.message || apiErrorMsg;
            });
    },
});

export default ingredientsSlice.reducer