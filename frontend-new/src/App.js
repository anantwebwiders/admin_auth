import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import FORGET_PASSWORD from "./pages/Forget_Password";
import RESET_PASSWORD from "./pages/Reset_Password";
import { RoutesPath } from "./constants/route_paths";
import axios from "axios";
import { fetchUserData } from "./services/authService";

function App() {
     const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData(setUser); 
  }, []);
  return (

    <Router>
      <Routes>
        {/* Redirect from / to /login */}
        {/* <Route path="/" element={<Navigate to={RoutesPath.LOGIN} />} /> */}
        <Route path="/" element={<Login />} />
        <Route path={RoutesPath.LOGIN} element={<Login />} />
        <Route path={RoutesPath.REGISTER} element={<Register />} />
        <Route path={RoutesPath.PROFILE} element={<Profile />} /> 
        <Route path={RoutesPath.DASHBOARD} element={<Dashboard />} />
        <Route path={RoutesPath.FORGET_PASSWORD} element={<FORGET_PASSWORD />} />
        <Route path={RoutesPath.RESET_PASSWORD} element={<RESET_PASSWORD />} />
       
      </Routes>
    </Router>
  );
}

export default App;
