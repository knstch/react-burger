import React, {useEffect} from 'react';
import './App.css';
import AppHeader from '../AppHeader/AppHeader'
import Main from "../Main/Main";
import {useDispatch, useSelector} from "react-redux";
import fetchIngredients from "../../services/actions/getIngredients";
import {RootState} from "../../services/store";

interface GettingBurgerErrorProps {
    Error: string;
}

const ErrorGettingBurgerIngredients: React.FC<GettingBurgerErrorProps> = (props) => {
    return (
        <div>
            <h1 className={`text text_type_main-large`}>{props.Error}</h1>
        </div>
    )
}

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchIngredients())
    }, [dispatch]);

    const { loading, error } = useSelector((state: RootState) => state.ingredientsReducer.ingredientsList)

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
                  <Main/>
              )
          }
      </div>
  );
}

export default App;
