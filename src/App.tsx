import React from 'react';
import './App.css';
import Header from './components/Header/header'
import Main from "./components/Main/Main";
import dotenv from 'dotenv';

const App = () => {
    dotenv.config()
  return (
      <>
        <Header/>
        <Main/>
      </>
  );
}

export default App;
