import { useState, useEffect } from "react";
import { RutaApi } from '../../config/config';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { longCadena, requiredField } from '../../utils/validator'
import Card from "../Card/card";
import axiosClient from "../../config/axiosClient";
import { Link } from "react-router-dom";
import ImageArtist from '../../assets/imgs/artist.jpg'

export default function Main() {
    const [artist, setArtist] = useState([]);

    const [artistEdit, setArtistEdit] = useState({
        id: "",
        name: "",
        description: ""
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
    const gettingData = async () => {

        const getInfo = await getData();

        //Array 
        let dataSet = []
        // console.log(getInfo);
        getInfo.data.artists.forEach((element, index) => {
            // console.log(element);
            dataSet[index] = { _id: element._id, name: element.name, description: element.description, image: element.image }
        });

        //change state of Artist
        setArtist(dataSet);
    }

    //Mapping artists
    const renderInformation = () => (
        artist.map((sesion, index) => (
            <Card data={sesion} key={index} type={"artist"} />

        ))
    )

    useEffect(() => {
        //execute async function to get data
        gettingData();
    }, []);

    const handleValidate = (e) => {
        e.preventDefault();
        const validaciones = {};
        //apply validation to correspond field
        // console.log(`se debe validar ${[e.target.name]}`)
        //Validate correspond property
        let validacion = requiredField(artistEdit.name);
        if (validacion) {
            validaciones.name = validacion;
        }
        // validacion = longCadena(artistEdit.name, 7, null);
        // if (validacion) {
        //     validaciones.name = validacion;
        // }
        validacion = requiredField(artistEdit.description);
        if (validacion) {
            validaciones.description = validacion;
        }
        validacion = longCadena(artistEdit.description, null, 20);
        if (validacion) {
            validaciones.description = validacion;
        }
        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setArtistEdit({ ...artistEdit, [e.target.name]: e.target.value })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const saveArtist = async (e) => {
        e.preventDefault();
        if (!errors.description && !errors.name) {
            setData(artistEdit).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Error al guardar!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: true
                    });
                } else {
                    MySwal.fire({
                        title: <strong>¡Guardado correctamente!</strong>,
                        html: <i>{res.data.message}</i>,
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        didClose() {
                            document.getElementById("ArtistForm").reset();
                            gettingData();
                            setArtistEdit({
                                id: "",
                                name: "",
                                description: ""
                            });
                        }
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
    return (
        <div className=" d-flex p-3 me-4 ms-4 justify-content-center" id="Main_main">
            <div className="d-flex row" id="main_cards">
                <div className='card p-0 border-light text-center defaultCard' >
                    <Link to={'#'} className="Card__link " data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                    >
                        <div className='card-container me-auto ms-auto mt-3'>
                            <img alt="" className="card-img-top" width={'100%'} height={'100%'} src={ImageArtist} />
                        </div>
                        <div className="card-body">
                            <p className="card-tittle">Añadir nuevo Artista</p>
                            {/* <p className="card-text">Inspírate</p> */}
                        </div>
                    </Link>
                </div>
                {renderInformation()}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Modo Edición</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body  ">
                                <div className=' p-0 border-light d-flex align-items-center' >
                                    <div className="card-img-cont ">
                                        <img alt="" src={'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png'} />
                                    </div>
                                    <div className="body-Modal">
                                        <form onChange={handleChange} onSubmit={saveArtist} noValidate className="needs-validation" id="ArtistForm"
                                        >
                                            <div className="input-group mb-3">
                                                <input
                                                    className={(errors.name && 'w-75 form-control is-invalid') || ('form-control w-75 is-valid')}
                                                    placeholder="Nombre"
                                                    name="name"
                                                    type="text"
                                                    id="name"
                                                    defaultValue={artistEdit.name}
                                                    onBlur={handleValidate}
                                                />
                                                <div className={(errors.name && 'invalid-feedback') || ('valid-feedback')}>
                                                    {errors.name}
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <textarea
                                                    className={(errors.description && 'form-control w-75 is-invalid') || ('form-control w-75 is-valid')}
                                                    placeholder="Descripción"
                                                    name="description"
                                                    id="description"
                                                    type="text"
                                                    defaultValue={artistEdit.description}
                                                    onBlur={handleValidate}
                                                    rows='4'
                                                />
                                                <div className={(errors.description && 'invalid-feedback') || ('valid-feedback')}>
                                                    {errors.description}
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary" >Guardar</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                {/* <button type="button" className="btn btn-primary" onClick={()=>{saveArtist()}} disabled={!errors && 'false'}>Guardar</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const getData = () => {
    return axiosClient.get(`${RutaApi}artists`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}
const setData = (params) => {
    return axiosClient.post(`${RutaApi}new-artist`, { name: params.name, description: params.description })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}