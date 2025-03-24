import React, { useState } from 'react';
import './App.css';
import Airpollution from './Airpollution';
import AirPollutionpoc from './AirPollutionpoc';
import BasicPie from './Basicpie';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
function App() {

  return (
    <>
     <ToastContainer />
    {/* <AirPollutionpoc/> */}
    <BasicPie/>
    </>

  );
}

export default App;
