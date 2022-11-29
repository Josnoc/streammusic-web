import React from 'react';
import Logo from '../../assets/imgs/logo.png';
import backgr from '../../assets/imgs/fondo.jpg';
import { Link } from "react-router-dom";


export default function Header() {
    /*=============================================
    CERRAR LA SESIÓN
    =============================================*/
    const cerrarSesion = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("user");
        localStorage.removeItem("surname");
        localStorage.removeItem("email");

    }
    const User = localStorage.getItem("name");

    return (

        <nav className="navbar-expand navbar-dark sticky-top" style={{ background: ' url(' + backgr + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', opacity: 0.9, }}>
            <div className='d-flex' style={{ background: 'rgba(0,0,0,.5)' }}>

                {/* <div style={{ display: 'flex', alignItems: 'center'}}> */}
                <div className='d-flex'>
                    <Link to={'/'}>
                    <img src={Logo} width={'14%'} /></Link>

                </div>
                {/* </div> */}
                <div className="collapse navbar-collapse  justify-content-end align-items-start" id="navbarNavDropdown">
                    <ul className="navbar-nav pe-4">

                    <li className="nav-item" ><a className="nav-link" href="#">App</a></li>
                    <li className="nav-item" ><a className="nav-link" href="#">Ayuda</a></li>
                        <li className="nav-item dropdown" >
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {User && User || "User"}
                            </a>
                            <ul className="dropdown-menu" style={{ color: 'white', background: '#f9f9f9a4' }}>
                                <li><Link className="dropdown-item"  to={"/perfil"}>Cuenta</Link></li>
                                <li><Link className="dropdown-item" to={"/"}>Artistas</Link></li>
                                <li><Link className="dropdown-item"  to={"/users"}>Usuarios</Link></li>
                                <li><a className="dropdown-item"  href={"#"}
                                    onClick={() => { cerrarSesion() }}>Salir</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>


        </nav>

    );


}