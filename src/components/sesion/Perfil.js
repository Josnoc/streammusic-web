import React, { useState, useEffect } from 'react';
import { RutaApi } from '../../config/config';
import axiosClient from '../../config/axiosClient';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { longCadena, requiredField, isEmail } from '../../utils/validator';
import ImageDefault from '../../assets/imgs/albums.jpg';
import { useNavigate } from "react-router-dom";

export default function Perfil() {
    const navigate = useNavigate();

    let user = localStorage.getItem("user");
    const [perfil, setPerfil] = useState({
        name: localStorage.getItem("name"),
        surname: localStorage.getItem("surname"),
        email: localStorage.getItem("email"),
        image: '',
        birth: 'DD/MM/YYYY',
    });

    const [updateInfo, setUpdateInfo] = useState({
        _id: user,
        name: perfil.name,
        surname: perfil.surname,
        email: perfil.email,
    });
    const [password, setPassword] = useState({
        password: '',
        newPassword: '',
        currentPassword: ''
    });

    const [image, setImage] = useState({
        file: ''
    })

    const [errors, setErrors] = useState({});
    const MySwal = withReactContent(Swal);

    const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const getUser = async () => {
        const getData = await getInfo(user);

        let userData = getData.data.user;
        // console.log(userData);
        //change state of Artist
        setPerfil({ name: userData.name, surname: userData.surname, email: userData.email, image: userData.image });
        localStorage.setItem("user_img", userData.image);
    }
    useEffect(() => {
        //execute async function to get data
        getUser();
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        setUpdateInfo({
            ...updateInfo, [e.target.name]: e.target.value
        })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleChangePass = (e) => {
        e.preventDefault();
        setPassword({
            ...password, [e.target.name]: e.target.value
        })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleChangeImage = (e) => {
        e.preventDefault();
        setImage({ ...image, [e.target.name]: e.target.files[0] })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const handleValidate = (e) => {
        e.preventDefault();
        const validaciones = {};
        //apply validation to correspond field
        //Validate correspond property
        let validacion = requiredField(updateInfo.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = longCadena(updateInfo.name, 150, null);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = requiredField(updateInfo.surname);
        if (validacion) {
            validaciones.surname = validacion;
        }
        validacion = longCadena(updateInfo.surname, 150, null);
        if (validacion) {
            validaciones.surname = validacion;
        }
        validacion = requiredField(updateInfo.email);
        if (validacion) {
            validaciones.email = validacion;
        }
        validacion = isEmail(updateInfo.email);
        if (validacion) {
            validaciones.email = validacion;
        }
        validacion = requiredField(password.password);
        if (validacion) {
            validaciones.password = validacion;
        }
        validacion = requiredField(password.newPassword);
        if (validacion) {
            validaciones.newPassword = validacion;
        }
        validacion = requiredField(password.currentPassword);
        if (validacion) {
            validaciones.currentPassword = validacion;
        }
        validacion = requiredField(image.file);
        if (validacion) {
            validaciones.file = validacion;
        }
        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }

    const updatePerfil = (e) => {
        e.preventDefault();
        // console.log('entro');
        if (!errors.email && !errors.name && !errors.surname) {
            MySwal.fire({
                // title: <strong>¡Actualizando!</strong>,
                // icon: 'success',
                html: <div><div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div><div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div><div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div></div>,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            putPerfil(updateInfo, user).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Error al actualizar!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: true
                    });
                } else if (res.data) {
                    MySwal.fire({
                        title: <strong>¡Perfil Actualizado!</strong>,
                        html: <i>{res.data.message}</i>,
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        didClose() {
                            getUser()
                        }
                    });
                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Estamos presentando problemas',
                        position: 'top-end',
                    });
                }
                console.log(res);
            })
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Debes rellenar correctamente la información',
                position: 'top-end',
                timer: 3000,
            });
        }
    }

    const updatePassword = (e) => {
        e.preventDefault();

        if (!errors.password && !errors.newPassword && !errors.currentPassword) {
            if (password.password === password.newPassword) {
                MySwal.fire({
                    title: <strong>¡Actualizando!</strong>,
                    // icon: 'success',
                    html: <div><div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div><div className="spinner-grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div><div className="spinner-grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div>,
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
                putPass(password, user).then((res) => {
                    if (res.error) {
                        MySwal.fire({
                            title: <strong>¡Error al guardar!</strong>,
                            html: <i>{res.error}</i>,
                            icon: 'error',
                            allowOutsideClick: true
                        });
                    } else if (res.data) {
                        MySwal.fire({
                            title: <strong>¡Contraseña Actualizada!</strong>,
                            html: <i>{res.data.message}</i>,
                            icon: 'success',
                            showConfirmButton: true,
                            allowOutsideClick: false,
                            didClose() {
                                getUser()
                            }
                        });
                    } else {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Estamos presentando problemas',
                            position: 'top-end',
                        });
                    }
                    console.log(res);
                })
            } else if (password.password !== password.newPassword) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Las contraseñas deben coincidir',
                    position: 'top-end',
                });
            } else {
                Toast.fire({
                    icon: 'warning',
                    title: 'Estamos presentando problemas',
                    position: 'top-end',
                });
            }
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Debes rellenar correctamente la información',
                position: 'top-end',
                timer: 3000,
            });
        }
    }

    const uploadImage = (e) => {
        e.preventDefault();
        if (!errors.file) {
            MySwal.fire({
                title: <strong>¡Actualizando!</strong>,
                // icon: 'success',
                html: <div><div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div><div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div><div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div></div>,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            updateImage(image, user).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Error al subir la imagen!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: true
                    });
                } else if (res.data) {
                    MySwal.fire({
                        title: <strong>¡Imagen subida correctamente!</strong>,
                        html: <i>{res.data.message}</i>,
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        didClose() {
                            getUser()
                        }
                    });

                } else {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Estamos presentando problemas',
                        position: 'top-end',
                        timer: 2000,
                    });
                }
                // console.log(res);
            })
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Debes añadir una imagen',
                position: 'top-end',
                timer: 3000,
            });
        }
    }

    const deleteAcount = (id) => {
        Swal.fire({
            title: '¿Seguro que quiere eliminar su cuenta? Perderá toda su información almacenada.',
            // inputValue: inputValue,
            confirmButtonText: 'Sí, eliminar',
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              deleteData(id).then((res) => {
                if (res.error || res.errorCode) {
                  MySwal.fire({
                    title: <strong>¡Error al eliminar!</strong>,
                    html: <i>{res.error}</i>,
                    icon: 'error',
                    allowOutsideClick: true
                  });
                } else if (res.data) {
                  MySwal.fire({
                    title: <strong>¡Eliminado correctamente!</strong>,
                    html: <i>{res.data.message}</i>,
                    icon: 'success',
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    didClose() {
                        localStorage.setItem("token", '');
                    localStorage.setItem("name", '');
                    localStorage.setItem("surname", '');
                    localStorage.setItem("user", '');
                    localStorage.setItem("email", '');
                    localStorage.setItem("user_img", '');
                    navigate('/', { replace: true });
                    }
                  });
                } else {
                  Toast.fire({
                    icon: 'warning',
                    title: 'Estamos presentando problemas',
                    position: 'top-end',
                    timer: 2000,
                });
                }
                console.log(res);
              }).catch(error => { console.log(error); })
            }
          })
    }

    return (
        <div className="container justify-content-center bg-light" id="Main_main">
            <div className=" row mt-2" id="">
                <div className="d-flex align-items-start menu_perfil_back" style={{ background: 'linear-gradient(0deg, #ff6347, rgb(87, 87, 87)' }}>
                    <div className="nav flex-column nav-pills me-3 align-items-center  mt-3" id="v-pills-tab" role="tablist" aria-orientation="vertical" style={{ height: '100%' }}>
                        <div className='position-relative' id='perfilImage_container'>
                            <div id='perfil__User' className='position-absolute end-0 start-0'><img alt='' src={(perfil.image && perfil.image) || ImageDefault} /></div>
                            <button className='position-absolute end-0 start-0 top-0 btn-ChangeImage ' style={{ color: 'white' }} data-bs-toggle="modal" data-bs-target="#ImageModal">Cambiar Imagen</button>
                        </div>
                        <div className='mt-3'>

                            <button className="nav-link align-self-center active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">General</button>
                            <button className="nav-link align-self-center" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Editar Perfil</button>
                            <button className="nav-link align-self-center" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Cambiar contraseña</button>
                            <button className="nav-link align-self-center" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Cuenta</button>
                        </div>
                    </div>
                    <div className="tab-content  pt-2" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex="0">
                            <div className='container text-dark'>
                                <h1 className='card-title text-light'>Perfil</h1>
                                <div className='d-flex justify-content-center'>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td className='text-light'>Nombre</td>
                                                <td className='fw-bold text-white'>{`${perfil.name} ${perfil.surname}`}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-light'>Email</td>
                                                <td className='fw-bold text-white'>{perfil.email}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-light'>Fecha de nacimiento</td>
                                                <td className='fw-bold  text-muted'>{perfil.birth}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabIndex="0">
                            <div ><h1 className='card-title mb-1 text-center'>Edita tu Perfil</h1></div>
                            <div className='container'>
                                <form
                                    onChange={handleChange}
                                    onSubmit={updatePerfil}
                                    noValidate
                                    className="needs-validation"
                                    id='PerfilForm'
                                >
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className={(errors.name && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                            name='name'
                                            id="name"
                                            placeholder="Nombre *"
                                            defaultValue={updateInfo.name}
                                            onBlur={handleValidate} />
                                        <div className={(errors.name && 'invalid-feedback') || 'valid-feedback'}>
                                            {errors.name}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="surname" className="form-label">Apellido </label>
                                        <input
                                            type="text"
                                            className={(errors.surname && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                            name='surname'
                                            id="surname"
                                            placeholder="Apellido *"
                                            defaultValue={updateInfo.surname}
                                            onBlur={handleValidate} />
                                        <div className={(errors.surname && 'invalid-feedback') || 'valid-feedback'}>
                                            {errors.surname}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className={(errors.email && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                            name="email"
                                            id="email"
                                            placeholder="Email *"
                                            defaultValue={updateInfo.email}
                                            onBlur={handleValidate} />
                                        <div className={(errors.email && 'invalid-feedback') || 'valid-feedback'}>
                                            {errors.email}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <button type="submit" className="btn btn-primary mb-3">Actualizar información</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabIndex="0">
                            <div ><h1 className='card-title mb-1 text-center'>Actualizar contraseña</h1></div>
                            <div className='container'>
                                <form
                                    onChange={handleChangePass}
                                    onSubmit={updatePassword}
                                >
                                    <div className='mb-3'>
                                        <label htmlFor="currentPassword" className="form-label">Contraseña actual</label>
                                        <input
                                            type="password"
                                            className={(errors.currentPassword && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                            placeholder="Contraseña Actual"
                                            name="currentPassword"
                                            onBlur={handleValidate} />
                                        <div className={(errors.currentPassword && 'invalid-feedback') || 'valid-feedback'}>
                                            {errors.currentPassword}
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="password" className="form-label">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            className={(errors.password && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                            placeholder="Contraseña"
                                            name="password"
                                            onBlur={handleValidate} />
                                        <div className={(errors.password && 'invalid-feedback') || 'valid-feedback'}>
                                            {errors.password}
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="newPassword" className="form-label">Confirmar nueva contraseña</label>
                                        <input
                                            type="password"
                                            className={(errors.newPassword && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                            placeholder="Confirme Contraseña"
                                            name="newPassword"
                                            onBlur={handleValidate} />
                                        <div className={(errors.newPassword && 'invalid-feedback') || 'valid-feedback'}>
                                            {errors.newPassword}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" >Actualizar contraseña</button>
                                </form>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabIndex="0">
                        <div className='container text-center'>
                            <button type="button" className="btn btn-danger btn-lg mt-5" id='deleteAcount' onClick={()=>{deleteAcount(user)}}>Eliminar Cuenta</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal UpdateImage */}
            <div className="modal fade" id="ImageModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="ImageBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="ImageBackdropLabel">Cambiar Imagen de usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body  ">
                            <div className=' p-0 border-light d-flex align-items-center' >

                                <div className="body-Modal">
                                    <form onChange={handleChangeImage}
                                        onSubmit={uploadImage}
                                        noValidate
                                        className="needs-validation"
                                        id="ImageForm"
                                        encType="multipart/form-data"
                                    >
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.file && 'form-control form-control-lg w-75 is-invalid') || 'form-control form-control-lg w-75 is-valid'}
                                                placeholder="Seleccionar archivo"
                                                name="file"
                                                id="file"
                                                type="file"
                                                // defaultValue={album.description}
                                                onBlur={handleValidate}
                                            />
                                            <div className={errors.file && 'invalid-feedback'}>
                                                Selecciona el archivo
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary" data-bs-target="#EditUserModal" data-bs-toggle="modal">Cambiar imagen</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-target="#EditUserModal" data-bs-toggle="modal">Close</button>
                        </div> */}
                    </div>
                </div>
            </div>
            {/* ENd modal ChangeImage */}
        </div>
    )
}

const getInfo = (params) => {
    return axiosClient.get(`${RutaApi}user/${params}`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const putPerfil = (params, id) => {
    return axiosClient.put(`${RutaApi}update-user/${id}`, { name: params.name, surname: params.surname, email: params.email })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const putPass = (params, id) => {
    return axiosClient.post(`${RutaApi}update-password/${id}`, { password: params.currentPassword, newPassword: params.newPassword, confirmPassword: params.password })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const updateImage = (Image, id) => {
    var formData = new FormData();
    formData.append("file", Image.file);

    return axiosClient.put(`${RutaApi}users/${id}`, formData,
        { headers: { "Content-Type": "multipart/form-data", } })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const deleteData = (id) =>{
    return axiosClient.delete(`${RutaApi}delete-user/${id}`)
    .then((response) => {
      return { ...response };
    })
    .catch((error) => {
      return { errorCode: error.code, error: error.message };
    });
}