import React, { useState } from 'react';
import { RutaApi } from '../../config/config';
import Logo from '../../assets/imgs/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { isEmail, requiredField } from '../../utils/validator'
import axiosClient from '../../config/axiosClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'


export default function Login() {
    const navigate = useNavigate();
    //HOKS paara iniciar sesion
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const MySwal = withReactContent(Swal);

    const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const [errors, setErrors] = useState({});

    //Capturamos cambios del formulario

    const handleChange = (e) => {
        e.preventDefault();

        setUser({
            ...user, [e.target.name]: e.target.value
        })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleValidate = (e) => {
        e.preventDefault();
        const validaciones = {};
        //apply validation to correspond field
        // console.log(`se debe validar ${[e.target.name]}`)
        //Validate correspond property
        // let validacion = validPassword(user.password, 8);
        // if (validacion) {
        //     validaciones.password = validacion;
        // }
        let validacion = requiredField(user.password);
        if (validacion) {
            validaciones.password = validacion;
        }
        //Validate email like required
        validacion = requiredField(user.email);
        if (validacion) {
            validaciones.email = validacion;
        }
        //Validate valid email
        validacion = isEmail(user.email);
        if (validacion) {
            validaciones.email = validacion;
        }

        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }

    //Envio de informacion
    const login = async e => {
        // console.log(API_URL);
        e.preventDefault();
        if (!errors.email && !errors.password) {
            // MySwal.fire({
            //     title: <strong>¡Actualizando!</strong>,
            //     // icon: 'success',
            //     html: <div><div class="spinner-grow" role="status">
            //         <span className="visually-hidden">Loading...</span>
            //     </div><div className="spinner-grow" role="status">
            //             <span className="visually-hidden">Loading...</span>
            //         </div><div className="spinner-grow" role="status">
            //             <span className="visually-hidden">Loading...</span>
            //         </div></div>,
            //     showCancelButton: false,
            //     showConfirmButton: false,
            //     allowOutsideClick: false,
            // });
            loginAPI(user).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Error durante el proceso!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: true
                    });
                } else {
                    // console.log(res);
                    if (res.data.user.role === "ADMIN") {
                        // MySwal.fire({
                        //     title: <strong>¡Login correcto!</strong>,
                        //     html: <i>Bienvenido {res.data.user.name}</i>,
                        //     icon: 'success',
                        //     showConfirmButton: true,
                        //     allowOutsideClick:false,
                        //     didClose(){
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("name", res.data.user.name);
                        localStorage.setItem("surname", res.data.user.surname);
                        localStorage.setItem("user", res.data.user._id);
                        localStorage.setItem("email", res.data.user.email);
                        localStorage.setItem("user_img", res.data.user.image);
                        navigate('/', { replace: true });
                        //     }
                        // });
                    } else {
                        MySwal.fire({
                            title: <strong>¡Lo sentimos!</strong>,
                            html: <i>{res.data.user.name} este espacio esta reservado para creadores</i>,
                            icon: 'warning',
                            showConfirmButton: true,
                            allowOutsideClick: false,
                            didClose() {
                            }
                        });
                    }

                }
            })
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Verifica tu información',
                position: 'top-end',
                timer: 3000,
            });
        }
    }

    let userImg = localStorage.getItem('user_img'), User = localStorage.getItem("name");


    return (

        <div className="login-page container-fluid justify-content-center align-items-center d-flex ">
            <div className="login-box" >

                <div className="card" >
                    <div className="login-logo mx-auto" >
                        {/* <img alt='' src={Logo} /> */}
                        {(userImg && <img alt='' className='rounded-circle mt-4' src={userImg} style={{width: '160px', height: '160px'}} />) 
                    || (User && <div style={{color: '#ff6347', width: '160px', height: '160px'}} className='rounded-circle bg-secondary fw-bold fs-1 text-center'>{User.charAt(0)}</div>) || <img alt='' src={Logo} />}
                    </div>
                    <div className="card-body login-card-body" >
                        <h5 className="card-title">Iniciar sesión</h5>

                        <form onChange={handleChange}
                            onSubmit={login}
                        >
                            <div className="input-group mb-3" >
                                <input type="email"
                                    className={(errors.email && 'form-control is-invalid') || 'form-control is-valid'}
                                    placeholder="Email*"
                                    name="email"
                                    onBlur={handleValidate}

                                />

                                <div className="input-group-text" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                    </svg>
                                </div>
                                <div className={(errors.email && 'invalid-feedback') || 'valid-feedback'}>
                                    {errors.email}
                                </div>
                            </div>

                            <div className="input-group mb-3" >
                                <input type="password"
                                    className={(errors.password && 'form-control is-invalid') || 'form-control is-valid'}
                                    placeholder="Contraseña*"
                                    name="password"
                                    onBlur={handleValidate} />

                                <div className="input-group-text" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z" />
                                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                </div>
                                <div className={(errors.password && 'invalid-feedback') || 'valid-feedback'}>
                                    {errors.password}
                                </div>
                            </div>

                            <button type="submit"
                                className="btn btn-primary btn-block border border-secondary">Ingresar</button>
                        </form>
                        {/* <div className='login_redes pt-2 text-center'>
                                <button className="btn btn-primary btn-block">Ingresar con Gmail</button>
                            </div> */}
                        <div className='text-center sesion-Text'>
                            <Link to="/register" className="link-primary ">Crear cuenta</Link>
                        </div>
                        <div className='text-center sesion-Text'>
                            <Link to="/recoverAccount" className="link-primary ">Recuperar Contraseña</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

// Peticion post login
const loginAPI = data => {
    return axiosClient.post(`${RutaApi}login`, { email: data.email.replace(/\s/g, ''), password: data.password })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}