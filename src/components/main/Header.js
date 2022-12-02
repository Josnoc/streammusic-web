import React from 'react';
// import Logo from '../../assets/imgs/logo.png';
import backgr from '../../assets/imgs/registerBack.jpg';
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
    const userImg = localStorage.getItem('user_img');

    return (

        <nav className="navbar-expand navbar-dark sticky-top" id='nav_background' style={{ background: `linear-gradient(180deg, #ff6347, black)`, backgroundRepeat: 'no-repeat', opacity: 0.9, }}>
            <div className='d-flex' style={{ background: 'rgba(0,0,0,.5)' }}>

                {/* <div style={{ display: 'flex', alignItems: 'center'}}> */}
                <div className='d-flex'>
                    <Link to={'/perfil'} className=" text-decoration-none"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ir a mi perfil">
                    {(userImg && <img alt='' className='m-1 rounded-circle bg-secondary ms-5 fw-bold fs-2 text-center' src={userImg} style={{width: '60px', height: '60px'}} />) 
                    || <div style={{color: '#ff6347'}} className='w-75 m-2 rounded-circle bg-secondary ms-5 fw-bold fs-2 text-center'>{User.charAt(0)}</div>}
                    
                    </Link>

                </div>
                {/* </div> */}
                <div className="d-flex w-50 justify-content-end align-items-center text-white">
                    <Link to={'/'} className="nav-link text-decoration-none"><p className='fs-1 fw-bold'>StreamMusic</p>
                    </Link>
                </div>
                <div className="collapse navbar-collapse justify-content-end align-items-center" id="navbarNavDropdown">
                    <ul className="navbar-nav pe-4">

                    <li className="nav-item" ><Link className="nav-link" href="#">App</Link></li>
                    <li className="nav-item" ><Link className="nav-link" href="#">Ayuda</Link></li>
                        <li className="nav-item dropdown" >
                            <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {(User && User) || "User"}
                            </Link>
                            <ul className="dropdown-menu" style={{ color: 'white', background: '#595858' }}>
                                <li><Link className="dropdown-item"  to={"/perfil"}>Cuenta</Link></li>
                                <li><Link className="dropdown-item" to={"/"}>Artistas</Link></li>
                                <li><Link className="dropdown-item"  to={"/users"}>Usuarios</Link></li>
                                <li><Link className="dropdown-item"  href={"#"}
                                    onClick={() => { cerrarSesion() }}>Salir</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>


        </nav>

    );


}