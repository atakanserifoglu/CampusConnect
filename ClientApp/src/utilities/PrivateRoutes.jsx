import { Outlet, Navigate } from "react-router-dom";
import React from "react";


const PrivateRoutes = () => {


//   localStorage.setItem("yourAuthTokenKey", token);
// localStorage.getItem("yourAuthTokenKey");
  return localStorage.getItem("yourAuthTokenKey") ? <Outlet /> : <Navigate to="/" />;
};
export default PrivateRoutes;
