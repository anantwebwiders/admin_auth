import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { RoutesPath } from "./constants/route_paths";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={RoutesPath.LOGIN} element={<Login />} />
        <Route path={RoutesPath.REGISTER} element={<Register />} />
        <Route path={RoutesPath.PROFILE} element={<Profile />} />
        <Route path={RoutesPath.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
