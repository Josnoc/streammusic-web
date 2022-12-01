import { RutaApi } from '../../config/config';
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { longCadena, requiredField } from '../../utils/validator';
import axiosClient from "../../config/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import Back from "../ui/Back";

export default function EditAndDelete({ props }) {
    const { name, collection, _id } = useParams(props);

    const [dataInfo, setDataInfo] = useState({
        _id: _id,
        name: name,
        description: '',
        year: '',
        artist: '',
        image: ''
    });

    const [image, setImage] = useState({
        file: ''
    })

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

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
    const getInfo = async () => {
        const data = await getData(_id, collection);
        if (data.data.artist) {
            const artistInfo = data.data.artist
            setDataInfo({ _id: artistInfo._id, name: artistInfo.name, description: artistInfo.description, image: artistInfo.image });
        } else {
            const albumInfo = data.data.album
            setDataInfo({ _id: albumInfo._id, name: albumInfo.title, description: albumInfo.description, year: albumInfo.year, artist: albumInfo.artist, image: albumInfo.image, gender: albumInfo.gender });
        }
        // console.log(dataInfo);
    }
    useEffect(() => {
        //execute async function to get data
        getInfo();
    }, []);

    const handleValidate = (e) => {
        e.preventDefault();
        const validaciones = {};
        //Validate correspond property
        let validacion = requiredField(dataInfo.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = longCadena(dataInfo.name, 100, null);
        if (validacion) {
            validaciones.name = validacion;
        }
        validacion = requiredField(dataInfo.description);
        if (validacion) {
            validaciones.description = validacion;
        }
        validacion = longCadena(dataInfo.description, null, 20);
        if (validacion) {
            validaciones.description = validacion;
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

    const saveData = async (e) => {
        e.preventDefault();
        if (!errors.description && !errors.name && !errors.year) {
            setData(dataInfo, collection, _id).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Error al actualizar!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: true
                    });
                } else if (res.data) {
                    MySwal.fire({
                        title: <strong>¡Actualizado correctamente!</strong>,
                        html: <i>{res.data.message}</i>,
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false,
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

    const handleChange = (e) => {
        e.preventDefault();
        setDataInfo({ ...dataInfo, [e.target.name]: e.target.value })
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

    const deleteThis = async (id) => {
        Swal.fire({
            title: '¿Seguro que quiere eliminar esta entrada?',
            confirmButtonText: 'Sí, eliminar',
            showCancelButton: true,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                deleteObject(id, collection).then((res) => {
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
                                if (collection === "album") {
                                    navigate(-1);
                                } else {
                                    navigate('/', { replace: true });
                                }

                            }
                        });
                    } else {
                        Toast.fire({
                            icon: 'warning',
                            title: 'Estamos presentando problemas',
                            position: 'top-end',
                        });
                    }
                    // console.log(res);
                }).catch(error => { console.log(error); })
            }
        })
    }

    const uploadImage = (e) => {
        e.preventDefault();
        if (!errors.file) {
            MySwal.fire({
                title: <strong>¡Actualizando!</strong>,
                // icon: 'success',
                html: <div><div class="spinner-grow" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div><div class="spinner-grow" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div><div class="spinner-grow" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div></div>,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            updateImage(image, collection, _id).then((res) => {
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
                            getInfo();
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

    return (
        <div className="p-3" id="EditAndDelete">
            <Back />
            <div className="d-flex align-items-center">
                <div className="div-img">
                    <img alt='' src={`${dataInfo.image}`}/>
                    <button className='btn-ChangeImage' data-bs-toggle="modal" data-bs-target="#ImageModal">Cambiar Imagen</button>
                </div>

                <div className="w-100 ms-3">
                    <h1 className="text-capitalize">{name ? name : 'Artist'}</h1>
                    <h3>Editar </h3>
                    <div className=" d-flex justify-content-center mt-3 w-100 text-center">
                        <form
                            onChange={handleChange}
                            onSubmit={saveData}
                            noValidate
                            className="needs-validation w-75"
                        >
                            <div className="input-group mb-3">
                                <input
                                    className={(errors.name && 'w-100 form-control is-invalid') || 'form-control w-100 is-valid'}
                                    placeholder="Nombre"
                                    name="name"
                                    type="textarea"
                                    id="name"
                                    defaultValue={dataInfo.name}
                                    onBlur={handleValidate}
                                />
                                <div className={(errors.name && 'invalid-feedback') || 'valid-feedback'}>
                                    {errors.name}
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <textarea
                                    className={(errors.description && 'form-control w-100 is-invalid') || 'form-control w-100 is-valid'}
                                    placeholder="Descripción"
                                    name="description"
                                    id="description"
                                    type="text"
                                    defaultValue={dataInfo.description}
                                    onBlur={handleValidate}
                                    rows="3"
                                />
                                <div className={(errors.description && 'invalid-feedback') || 'valid-feedback'}>
                                    {errors.description}
                                </div>
                            </div>
                            <div className="input-group mb-3" hidden={collection === 'artist' && '{true}'}>
                                <input
                                    className={(errors.year && 'form-control w-100 is-invalid') || 'form-control w-100 is-valid'}
                                    placeholder="Año"
                                    name="year"
                                    id="year"
                                    type="number"
                                    min={'1000'}
                                    max={'2020'}
                                    defaultValue={dataInfo.year}
                                    onBlur={handleValidate}
                                />
                                <div className={(errors.year && 'invalid-feedback') || 'valid-feedback'}>
                                    {errors.year}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Actualizar</button>
                            <button type="button" className="btn btn-danger" onClick={() => { deleteThis(dataInfo._id) }}>Eliminar</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modal UpdateImage */}
            <div className="modal fade" id="ImageModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="ImageBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="ImageBackdropLabel">Agregar Canción</h1>
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
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Cambiar imagen</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

const getData = (params, colection) => {
    return axiosClient.get(`${RutaApi}${colection}/${params}`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const setData = (params, colection, id) => {
    let bodyParams = {};
    if (colection === 'artist') (
        bodyParams = { name: params.name, description: params.description }
    )
    if (colection === 'album') (
        bodyParams = { title: params.name, description: params.description, year: params.year, artist: params.artist, gender: params.gender }
    )
    console.log(bodyParams);
    return axiosClient.put(`${RutaApi}update-${colection}/${id}`, bodyParams)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}
const deleteObject = (params, colection) => {
    return axiosClient.delete(`${RutaApi}delete-${colection}/${params}`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}

const updateImage = (Image, colection, id) => {
    var formData = new FormData();
    formData.append("file", Image.file);

    return axiosClient.put(`${RutaApi}update-img-${colection}s/${id}`, formData,
        { headers: { "Content-Type": "multipart/form-data", } })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}