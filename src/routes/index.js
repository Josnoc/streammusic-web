import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Login from '../components/sesion/Login';
import Header from '../components/main/Header';
import Footer from '../components/main/Footer';
import Register from '../components/sesion/Register';
import PrivateRoute from './PrivateRoute';
import Main from '../components/main/main';
import Album from '../components/main/Album';
import Albums from '../components/main/Albums';
import Perfil from '../components/sesion/Perfil';
import EditAndDelete from '../components/Card/EditAndDelete';
import Users from '../components/Users/Users';
import Error404 from '../components/Error404/Error404';
import ConfirmEmail from '../components/sesion/ConfirmEmail';
import RecoverAccount from '../components/sesion/RecoverAccount';
import ResetPassword from '../components/sesion/RecoverPassword';
// import Nav from '../components/main/Nav';
// import Reproductor from '../components/ui/Reproductor';


const Router = () => (
  <Routes>
    <Route path="/login" element={<><Login /></>} />
    <Route path="/register" element={<><Register /></>} />
    {/* <Route path="/" element={<><Header /><h1>Hola mundo</h1> <Footer /></>} /> */}
    {/* <Route element={<Layout />}> */}

    {/* <Route path="/" element={<PrivateRoute><Header /><div  style={{height: '900px'}}><h1>Hola mundo</h1></div><Footer /></PrivateRoute>}/> */}
    <Route path="/" element={<PrivateRoute><Header /><Main /><Footer /></PrivateRoute>}/>
    <Route path="/perfil" element={<PrivateRoute><Header /><Perfil /><Footer /></PrivateRoute>}/>
    <Route path="/users" element={<PrivateRoute><Header /><Users /></PrivateRoute>}/>
    <Route path="/albums/:name/:_id" element={<PrivateRoute><Header /><Albums /><Footer /></PrivateRoute>}/>
    <Route path="/album/:name/:_id/:artist" element={<PrivateRoute><Header /><Album />
    {/* <Reproductor /> */}
    <Footer /></PrivateRoute>}/>
    <Route path="/EditData/:name/:collection/:_id" element={<PrivateRoute><Header /><EditAndDelete /><Footer /></PrivateRoute>}/>
    <Route path="/confirm-Email/:token" element={<ConfirmEmail />}/>
    <Route path="/recoverAccount" element={<RecoverAccount />}/>
    <Route path="/reset-Password/:token" element={<ResetPassword />}/>
    <Route path='*' element={<Error404 />} />

  </Routes>
);

// <Route path="/personal" element={<PrivateRoute><Employees /></PrivateRoute>}/>

export default Router;
