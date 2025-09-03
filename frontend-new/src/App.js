import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import FORGET_PASSWORD from "./pages/Forget_Password";
import RESET_PASSWORD from "./pages/Reset_Password";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { RoutesPath } from "./constants/route_paths";
import axios from "axios";
import { fetchUserData } from "./services/authService";
import RsendVerifyEmail from "./pages/RsendVerifyEmail";
import Products from "./pages/Products";
import AllProducts from "./pages/AllProducts"; // Add this import
import CreateCategory from "./pages/CreateCategory"; // Add this import
import AllCategories from "./pages/AllCategories"; // Add this import
import EcommerceProducts from "./pages/EcommerceProducts"; // Add this import
import AllOrders from "./pages/AllOrders"; // Add this import

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
        <Route path={RoutesPath.VERIFY_EMAIL} element={<VerifyEmailPage />} />
       <Route path={RoutesPath.RESEND_VERIFY_EMAIL} element={<RsendVerifyEmail />} />
        <Route path={RoutesPath.PRODUCTS} element={<Products />} />
        <Route path="/products" element={<Products />} /> {/* Add this line for direct /products route */}
        <Route path={RoutesPath.ALL_PRODUCTS} element={<AllProducts />} /> {/* Add this line */}
        <Route path={RoutesPath.CREATE_CATEGORY} element={<CreateCategory />} /> {/* Add this line */}
        <Route path={RoutesPath.ALL_CATEGORIES} element={<AllCategories />} /> {/* Add this line */}
        <Route path={RoutesPath.ECOMMERCE_PRODUCTS} element={<EcommerceProducts />} /> {/* Add this line */}
        <Route path={RoutesPath.ALL_ORDERS} element={<AllOrders />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;
