import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import session from '../utils/sessionStorage';

export default function PrivateRoute({ children, ...rest }) {
    const sesion = localStorage.getItem("token");
  let location = useLocation();
  return sesion ? children : <Navigate to="/login" state={{ from: rest.location || location }} replace/>;
}

