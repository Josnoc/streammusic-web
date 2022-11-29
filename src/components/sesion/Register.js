import '../../assets/StreamStyle.css';
import React, {useState} from "react";
import { RutaApi } from '../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../config/axiosClient";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { requiredField, isEmail } from '../../utils/validator'
// import ImageAlbum from '../../assets/imgs/albums.jpg';

export default function Register() {
    const [user, setUser] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

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

  const navigate = useNavigate();

    const handleValidate = (e) => {
        e.preventDefault();
        const validaciones = {};
        let validacion = requiredField(user.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        // validacion = longCadena(songEdit.name, 300, null);
        // if (validacion) {
        //     validaciones.name = validacion;
        // }
        validacion = requiredField(user.surname);
        if (validacion) {
            validaciones.surname = validacion;
        }
        validacion = requiredField(user.email);
        if (validacion) {
            validaciones.email = validacion;
        }
        validacion = isEmail(user.email);
        if (validacion) {
            validaciones.email = validacion;
        }
        validacion = requiredField(user.password);
        if (validacion) {
            validaciones.password = validacion;
        }
        if (Object.keys(validaciones).length > 0) {
          setErrors({ ...validaciones });
          return
        }
      }

    //Capturamos cambios del formulario
    const handleChange = e => {
        e.preventDefault();
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleSave = async e => {
        e.preventDefault();
    if (!errors.name && !errors.surname && !errors.email && !errors.password) {
      postData(user).then((res) => {
        if (res.error) {
          MySwal.fire({
            title: <strong>¡Error al crear cuenta!</strong>,
            html: <i>{res.error}</i>,
            icon: 'error',
            allowOutsideClick: true
          });
        } else {
          MySwal.fire({
            title: <strong>¡Cuenta creada correctamente!</strong>,
            html: <i>Verifica tu cuenta a través de tu correo Gmail</i>,
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            didClose() {
            //   document.getElementById("SongForm").reset();
            //   gettingData();
              
              navigate('/Login', { replace: true });
            }
          });

        }
        console.log(res);
      })
    }else {
        Toast.fire({
            icon: 'error',
            title: 'Debes rellenar correctamente la información',
            position: 'top-end',
            timer: 3000,
        });
    }
    }

    return (
        <div className="register-page container-fluid justify-content-center align-items-center d-flex" style={{ minHeight: "494px" }}>
            <div className="register-box">
                <div className="card" style={{ padding: '0 30px 20px 30px' }}>
                    <div className="card-body login-card-body" >
                        <h5 className="card-title">Registrarse</h5>
                        <form
                        onSubmit={handleSave}
                        onChange={handleChange}
                        noValidate className="needs-validation"
                        >
                            <div className="form-group">

                                <label className="small text-secondary" htmlFor="Nombre">Nombre</label>
                                <div className="input-group mb-3">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        // defaultValue={user.name}
                                        className={(errors.name && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                        placeholder="Nombre*"
                                        onBlur={handleValidate}
                                        // onChange={handleChange}
                                    />
                                    <div className={(errors.name && 'invalid-feedback') || 'valid-feedback'}>
                                        {errors.name}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="Nombre">Apellidos</label>
                                <div className="input-group mb-3">

                                    <input
                                        id="surname"
                                        name="surname"
                                        type="text"
                                        // defaultValue={user.surname}
                                        className={(errors.surname && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                        placeholder="Apellidos*"
                                        onBlur={handleValidate}
                                        // onChange={handleChange}
                                    />
                                    <div className={(errors.surname && 'invalid-feedback') || 'valid-feedback'}>
                                        {errors.surname}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="email">Correo Electrónico</label>

                                <div className="input-group mb-3">
                                    <input
                                        id="email"
                                        type="email"
                                        // defaultValue={user.email}
                                        name="email"
                                        className={(errors.email && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                        placeholder="Correo electronico*"
                                        onBlur={handleValidate}
                                        // onChange={handleChange}
                                    />
                                    <div className={(errors.email && 'invalid-feedback') || 'valid-feedback'}>
                                        {errors.email}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="small text-secondary" htmlFor="password">Contraseña</label>

                                <div className="input-group mb-3">
                                    <input
                                        id="password"
                                        type="password"
                                        // defaultValue={user.password}
                                        className={(errors.password && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                        name="password"
                                        placeholder="Contraseña*"
                                        onBlur={handleValidate}
                                        // onChange={handleChange}
                                    />
                                    <div className={(errors.password && 'invalid-feedback') || 'valid-feedback'}>
                                        {errors.password}
                                    </div>
                                </div>
                            </div>
                            <div className='text-center sesion-Text'>
                                <div>
                                <button type='submit' className="btn btn-primary ps-4 pe-4 border border-secondary">Enviar</button></div>
                                <Link to="/login" className="link-primary ">Recordé mi contraseña</Link>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

//Post request 
const postData = data => {
    return axiosClient.post(`${RutaApi}new-user`, { name: data.name, surname: data.surname, email: data.email.replace(/\s/g, ''), password: data.password })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}
