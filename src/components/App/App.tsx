import React, {useEffect} from 'react';
import './App.css';
import AppHeader from '../AppHeader/AppHeader'
import Main from "../Main/Main";
import {useDispatch, useSelector} from "react-redux";
import fetchIngredients from "../../services/actions/getIngredients";
import {RootState} from "../../services/store";
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import ForgotPassword from "../pages/Login/ForgotPassword";
import ResetPassword from "../pages/Login/ResetPassword";
import Profile from "../pages/Profile/Profile";
import IngredientDetails from "../pages/Ingredient/Ingredient";
import ModalOverlay from "../Main/Modal/ModalOverlay";
import BurgerIngredientModal from "../Main/BurgerIngredients/BurgerIngredientModal";
import {ingredientsSlice} from "../../services/reducers/ingredients";
import {getAuthCookie} from "../../common/getAuthCookie";
import {authStateSlice} from "../../services/reducers/auth";

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

    const location = useLocation()
    const navigate = useNavigate()
    const background = location.state && location.state.background

    const { actions } = ingredientsSlice

    const handleModalClose = () => {
        dispatch(actions.removeOpenedCard(''));
        navigate(-1)
    }

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchIngredients())

        if (getAuthCookie() && localStorage.getItem("refreshToken")) {
            dispatch(authStateSlice.actions.login(""))
        }
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
                  <>
                      <Routes>
                          <Route path={'/'} element={<Main />}/>
                          <Route path={'/login'} element={<Login />}/>
                          <Route path={'/register'} element={<Register />}/>
                          <Route path={'/forgot-password'} element={<ForgotPassword/>}/>
                          <Route path={'/reset-password'} element={<ResetPassword />}/>
                          <Route path={'/profile/:activeTabParam?'} element={<Profile/>}/>
                          <Route path={'/ingredients/:id'} element={<IngredientDetails/>} />
                      </Routes>
                      {
                          background && (
                              <Routes>
                                  <Route path={'/ingredients/:id'} element={
                                      <ModalOverlay CloseFunc={handleModalClose} Title={"Детали ингредиента"}>
                                          <BurgerIngredientModal/>
                                      </ModalOverlay>
                                  }/>
                              </Routes>
                          )
                      }
                  </>
              )
          }
      </div>
  );
}

export default App;
