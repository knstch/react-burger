import {IngredientsApiResponse} from "../../components/Main/ApiContracts/Contracts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {apiErrorMsg} from "../../common/common";

const burgerApiHost = `${process.env.REACT_APP_FOOD_API_HOST}`

const fetchIngredients = createAsyncThunk<IngredientsApiResponse, void>(
    'ingredients/fetchIngredients',
    async () => {
        const response = await axios.get<IngredientsApiResponse>(burgerApiHost);
        if (!response.data.success) {
            throw new Error(apiErrorMsg);
        }

        return response.data;
    }
)

export default fetchIngredients;