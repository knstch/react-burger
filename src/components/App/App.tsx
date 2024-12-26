import React, {useEffect, useState} from 'react';
import './App.css';
import AppHeader from '../AppHeader/AppHeader'
import Main from "../Main/Main";
import axios from "axios";
import {FoodItem, IngredientsApiResponse} from "../Main/ApiContracts/Contracts";

const burgerApiHost = `${process.env.REACT_APP_FOOD_API_HOST}`
const apiErrorMsg = 'Упс! Космические тараканы сожрали интернет и я не могу получить ингредиенты'

interface GettingBurgerErrorProps {
    Error: string;
}

const fetchFoodItems = async (): Promise<IngredientsApiResponse | string> => {
    try {
        const resp = await axios.get<IngredientsApiResponse>(burgerApiHost)
        if (!resp.data.success) {
            console.error(resp.data)
            return apiErrorMsg;
        }
        return resp.data
    } catch (error) {
        console.error(error)
        return apiErrorMsg
    }
}

const ErrorGettingBurgerIngredients: React.FC<GettingBurgerErrorProps> = (props) => {
    return (
        <div>
            <h1 className={`text text_type_main-large`}>{props.Error}</h1>
        </div>
    )
}

const App = () => {
    const [error, setError] = useState("");
    const [ingredients, setIngredients] = useState<FoodItem[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchFoodItems()

                if (typeof res === "string") {
                    setError(res)
                } else if (res.success) {
                    setIngredients(res.data)
                } else {
                    setError("Failed to fetch ingredients.")
                }
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false);
            }
        };

        fetchData()
    }, []);

    if (loading) {
        return <div className="mt-10">Loading...</div>;
    }

  return (
      <div className="App">
        <AppHeader/>
          {
              error && (
                  <div className={`mt-10 burgerErrorWindow`}>
                      <ErrorGettingBurgerIngredients Error={error}/>
                  </div>
              )
          }
          {
              !error && (
                  <Main FoodItems={ingredients}/>
              )
          }
      </div>
  );
}

export default App;
