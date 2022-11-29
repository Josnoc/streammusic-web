import { useState, useEffect } from "react";
import { RutaApi } from '../../config/config';
// import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from "../../config/axiosClient";
import Back from "../ui/Back";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { longCadena, requiredField, isEmail, isBoolean } from '../../utils/validator'
import ImageUsers from '../../assets/imgs/users.png';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({
        _id: '',
        name: '',
        surname: '',
        email: '',
        role: 'USER',
        active: '',
        status: '',
        image: ''
    });

    const [image, setImage] = useState({
        file: ''
    })

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

    //Obtener las 
    const gettingUsers = async () => {

        const getInfo = await getData();
        //Array 
        let dataSet = []
        // let number = 1;
        getInfo.data.users.forEach((user, index) => {
            dataSet[index] = { _id: user._id, name: user.name, surname: user.surname, email: user.email, role: user.role, active: user.active, status: user.status, image: user.image }
            // number++;
        });

        //change state of Artist
        setUsers(dataSet);
    }

    //Mapping users
    const renderInformation = () => (
        users.map((user, index) => (
            <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-capitalize">{`${user.name} ${user.surname}`}</td>
                <td className="text-capitalize">{user.email}</td>
                <td>{user.role}</td>
                <td className="text-capitalize">{user.status}</td>
                <td className="text-capitalize">{`${user.active}`}</td>
                <td><button className="btn btn-primary" onClick={() => { settingEditUser(user._id) }} data-bs-toggle="modal" data-bs-target="#EditUserModal">Editar</button><button className="btn btn-danger" onClick={() => { deleteThis(user._id) }}>Eliminar</button></td>
            </tr>

        ))
    )

    useEffect(() => {
        //execute async function to get data
        gettingUsers();
        // console.log(user);
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        setUser({ ...user, [e.target.name]: e.target.value })

        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const deleteThis = (id) => {
        Swal.fire({
            title: '¿Seguro que quiere eliminar a este usuario?',
            // inputValue: inputValue,
            confirmButtonText: 'Sí, eliminar',
            showCancelButton: true,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              deleteUser(id).then((res) => {
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
                      gettingUsers();
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

    const handleValidate = (e) => {
        e.preventDefault();
        const validaciones = {};
        let validacion = requiredField(user.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = longCadena(user.name, 300, null);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = requiredField(user.surname);
        if (validacion) {
            validaciones.surname = validacion;
        }
        validacion = longCadena(user.surname, 300, null);
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
        validacion = requiredField(user.active);
        if (validacion) {
            validaciones.active = validacion;
        }
        validacion = isBoolean(user.active);
        if (validacion) {
            validaciones.active = validacion;
        }
        validacion = requiredField(user.status);
        if (validacion) {
            validaciones.status = validacion;
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

    const handleChangeImage = (e) => {
        e.preventDefault();
        setImage({ ...image, [e.target.name]: e.target.files[0] })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const settingEditUser = async(id) => {
        setUser({
            _id: '',
            name: '',
            surname: '',
            email: '',
            role: 'USER',
            active: '',
            status: '',
            image: ''
        })
        // console.log(user);
        await users.forEach((user)=>{
          if (user._id === id) {
            setUser({ _id: user._id, name: user.name, surname: user.surname, email: user.email, role: user.role, active: user.active, status: user.status, image: user.image })
          }
        })
        // console.log(user);
      }

    const saveUser = (e) => {
        e.preventDefault();
    if (!errors.name && !errors.surname && !errors.email && !errors.password) {
      setNewUser(user).then((res) => {
        if (res.error) {
          MySwal.fire({
            title: <strong>¡Error al guardar!</strong>,
            html: <i>{res.error}</i>,
            icon: 'error',
            allowOutsideClick: true
          });
        } else if(res.data) {
          MySwal.fire({
            title: <strong>¡Guardado correctamente!</strong>,
            html: <i>{res.data.message}</i>,
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            didClose() {
              document.getElementById("UserForm").reset();
              gettingUsers();
            }
          });

        }else{
          Toast.fire({
            icon: 'warning',
            title: 'Estamos presentando problemas',
            position: 'top-end',
        });
        }
        // console.log(res);
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

    const updateUser = (e) => {
        e.preventDefault();
        if (!errors.name && !errors.surname && !errors.email ) {
          putUser(user).then((res) => {
            if (res.error) {
              MySwal.fire({
                title: <strong>¡Error al actualizar!</strong>,
                html: <i>{res.error}</i>,
                icon: 'error',
                allowOutsideClick: true
              });
            } else if(res.data) {
              MySwal.fire({
                title: <strong>¡Actualizado correctamente!</strong>,
                html: <i>{res.data.message}</i>,
                icon: 'success',
                showConfirmButton: true,
                allowOutsideClick: false,
                didClose() {
                  gettingUsers();
                  settingEditUser(user._id);
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

    const uploadImage = (e) => {
        e.preventDefault();
        if (!errors.file) {
            updateImage(image, user._id).then((res) => {
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
                          gettingUsers();
                          settingEditUser(user._id);
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
                //   console.log(res);
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

    return (
        <div className="p-3" id="Album_main">
            <Back />
            <div className="users__header d-flex text-center ">
                <div>
                    <img alt="" src={ImageUsers} />
                </div>

                <div className="pt-5">
                    <h1>Usuarios</h1>
                </div>
            </div>
            <div className="album__controls">
                <div className="album__controls--buttons">
                <button className="button_addSong" data-bs-toggle="modal" data-bs-target="#AddUserModal">Agregar Usuario</button>
                </div>
            </div>
            <div className="album_songs d-flex justify-content-center mt-3 text-center">
                <table className="table" id="usersTable">
                    <thead >
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Estatus</th>
                            <th scope="col">Activo</th>
                            <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderInformation()}

                    </tbody>
                </table>
            </div>
            {/* Start Modal AddUser */}
            <div className="modal modal-lg fade" id="AddUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="UserBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="UserBackdropLabel">Agregar Usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body ">
                            <div className=' p-0 border-light d-flex align-items-center' >
                                <div className="card-img-cont ">
                                    <img alt="" src={ImageUsers} />
                                </div>
                                <div className="body-Modal p-2">
                                    <form
                                        onChange={handleChange}
                                        onSubmit={saveUser}
                                        noValidate
                                        className="needs-validation"
                                        id="UserForm"
                                    >
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.name && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Nombre"
                                                name="name"
                                                type="text"
                                                id="name"
                                                // defaultValue={album.name}
                                                // onChange
                                            onBlur={handleValidate}
                                            />
                                            <div className={(errors.name && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.name}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.surname && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Apellido"
                                                name="surname"
                                                type="text"
                                                id="surname"
                                                // defaultValue={album.name}
                                                // onChange
                                            onBlur={handleValidate}
                                            />
                                            <div className={(errors.surname && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.surname}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.email && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Email"
                                                name="email"
                                                type="email"
                                                id="email"
                                                // defaultValue={album.name}
                                                // onChange
                                                onBlur={handleValidate}
                                            />
                                            <div className={(errors.email && 'invalid-feedback' )|| 'valid-feedback'}>
                                                {errors.email}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.password && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Password"
                                                name="password"
                                                type="password"
                                                id="password"
                                                // defaultValue={album.name}
                                                // onChange
                                                onBlur={handleValidate}
                                            />
                                            <div className={(errors.password && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.password}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <select
                                                className="form-select"
                                                aria-label="Seleccionar rol"
                                                id="role"
                                                name="role"
                                                >
                                                <option value="ADMIN">Administrador</option>
                                                <option value="USER">Normal</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary" >Guardar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Modal AddSong */}

            {/* Start Modal Edit User */}
            <div className="modal modal-lg fade" id="EditUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="EditUserBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="EditUserBackdropLabel" style={{color: 'black'}}>Editar Usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body  ">
                            <div className=' p-0 border-light d-flex align-items-center' >
                                <div className="card-img-cont ">
                                    <img alt="" src={user.image} />
                                    <button className='btn-ChangeImage' data-bs-toggle="modal" data-bs-target="#ImageModal">Cambiar Imagen</button>
                                </div>
                                <div className="body-Modal">
                                    <form onChange={handleChange} 
                                    onSubmit={updateUser} 
                                    noValidate 
                                    className="needs-validation" 
                                    id="EditUserForm"
                                    >
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.name && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Nombre"
                                                name="name"
                                                type="text"
                                                // id="name"
                                                defaultValue={user.name}
                                                // onChange
                                            onBlur={handleValidate}
                                            />
                                            <div className={(errors.name && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.name}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.surname && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Apellido"
                                                name="surname"
                                                type="text"
                                                // id="surname"
                                                defaultValue={user.surname}
                                                // onChange
                                            onBlur={handleValidate}
                                            />
                                            <div className={(errors.surname && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.surname}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.email && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Email"
                                                name="email"
                                                type="email"
                                                // id="email"
                                                defaultValue={user.email}
                                                // onChange
                                                onBlur={handleValidate}
                                            />
                                            <div className={(errors.email && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.email}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                className={(errors.password && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                placeholder="Password"
                                                name="password"
                                                type="password"
                                                // id="password"
                                                defaultValue={user.name}
                                                // onChange
                                                onBlur={handleValidate}
                                            />
                                            <div className={(errors.password && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.password}
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <select
                                                className="form-select"
                                                aria-label="Seleccionar rol"
                                                defaultValue={user.role}
                                                name="role"
                                                onBlur={handleValidate}
                                                >
                                                <option value="USER">Normal</option>
                                                <option value="ADMIN">Administrador</option>
                                            </select>
                                            <div className={(errors.role && 'invalid-feedback') || 'valid-feedback'}>
                                                {errors.role}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary" >Actualizar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Modal Edit element */}
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
                                        <button type="submit" className="btn btn-primary" >Cambiar imagen</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-target="#EditUserModal" data-bs-toggle="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* ENd modal ChangeImage */}
        </div>
    )
}

const getData = () => {
    return axiosClient.get(`${RutaApi}user`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const setNewUser = (user) => {
    return axiosClient.post(`${RutaApi}new-user/`, { name: user.name, surname: user.surname, email: user.email, password: user.password, role: user.role })
      .then((response) => {
        return { ...response };
      })
      .catch((error) => {
        return { errorCode: error.code, error: error.message };
      });
}

const deleteUser = (id) => {
    return axiosClient.delete(`${RutaApi}delete-user/${id}`)
      .then((response) => {
        return { ...response };
      })
      .catch((error) => {
        return { errorCode: error.code, error: error.message };
      });
}

const putUser = (userUpd) => {
    // console.log(userUpd);
    let userData = {};
    if (userUpd.password) {
        userData = {name: userUpd.name, surname: userUpd.surname, email: userUpd.email, password: userUpd.password, role: userUpd.role}
    } else {
        userData = {name: userUpd.name, surname: userUpd.surname, email: userUpd.email, role: userUpd.role}
    }
    return axiosClient.put(`${RutaApi}update-user/${userUpd._id}`, 
    userData)
      .then((response) => {
        return { ...response };
      })
      .catch((error) => {
        return { errorCode: error.code, error: error.message };
      });
  }
const updateImage = (Image, id) => {
    // console.log(id);
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