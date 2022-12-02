import { useState, useEffect } from "react";
import { RutaApi } from '../../config/config';
import { useParams, Link } from 'react-router-dom';
import Card from "../Card/card";
import axiosClient from "../../config/axiosClient";
import Back from "../ui/Back";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { longCadena, requiredField, onlyNumber, numberMinMax } from '../../utils/validator'
import ImageAlbum from '../../assets/imgs/albums.jpg';

export default function Albums(props) {
    const { name, _id} = useParams(props);
    const [albums, setAlbums] = useState([]);
    const [album, setAlbum] = useState({
        artist: _id,
        title: '',
        year: '',
        description: '',
        gender: ''
    });
    const [ artistImg, setArtistImg] = useState('');

    const [errors, setErrors] = useState({});

    const currentDate=()=>{let dat= new Date();return dat.getFullYear();}

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

    // const navigate = useNavigate();
    //Obtener las 
    const gettingData = async () => {

        const getInfo = await getData(_id);
        // console.log(getInfo);
        //Array 
        let dataSet = [];
        await getInfo.data.albums.forEach((element, index) => {
            if (element.title) {
                if (element.artist._id === _id) {
                        dataSet[index] = { _id: element._id, name: element.title, image: element.image, description: element.description, year: element.year, artist: element.artist, gender: element.gender}
                    setArtistImg(element.artist.image)
                    // console.log(element);
                }
            }
        });
        //change state of Artist
        setAlbums(dataSet);
    }

    //Mapping artists
    const renderInformation = () => (

        albums.map((sesion, index) => (
            <Card data={sesion} key={index} type='album' artist={_id} />
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
        //Validate correspond property
        let validacion = requiredField(album.title);
        if (validacion) {
            validaciones.title = validacion;
        }
        validacion = longCadena(album.title, 80, null);
        if (validacion) {
            validaciones.title = validacion;
        }
        validacion = requiredField(album.description);
        if (validacion) {
            validaciones.description = validacion;
        }
        validacion = longCadena(album.description, null, 20);
        if (validacion) {
            validaciones.description = validacion;
        }
        validacion = requiredField(album.year);
        if (validacion) {
            validaciones.year = validacion;
        }
        validacion = longCadena(album.year, 4, 4);
        if (validacion) {
            validaciones.year = validacion;
        }
        validacion = onlyNumber(album.year);
        if (validacion) {
            validaciones.year = validacion;
        }
        validacion = numberMinMax(album.year, currentDate(), 1000);
        if (validacion) {
            validaciones.year = validacion;
        }
        validacion = requiredField(album.gender);
        if (validacion) {
            validaciones.gender = validacion;
        }
        if (Object.keys(validaciones).length > 0) {
            setErrors({ ...validaciones });
            return
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setAlbum({ ...album, [e.target.name]: e.target.value })
        //Remove the error to the edited property
        delete errors[e.target.name];
        setErrors({ ...errors });
    }

    const saveAlbum = async (e) => {
        e.preventDefault();
        if (!errors.description && !errors.name && !errors.year) {
            setData(album).then((res) => {
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
                            document.getElementById("AlbumForm").reset();
                            gettingData();
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
        <div className=" p-3" id="Album_main" style={{ background: 'linear-gradient(180deg, #ff6347, rgb(49, 49, 49))' }}>
            <div className="d-block ps-3">
                <Back />
            </div>
            <div className="album__header d-flex align-items-center ps-3">
                <div className="album-img">
                    <img className="ms-5" alt="" src={artistImg} />
                </div>
                <div>
                    <h5>Artista</h5>
                    <h1>{name ? name : 'Artist'}</h1>
                </div>
            </div>
            {/* <div className="album__controls d-inline-block pt-2 w-100">
                <div className="album__controls--buttons">
                    <button className="btn_play" hidden>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                    </button>
                    <button className="btn_fav">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                        </svg>
                    </button>
                </div>
            </div> */}
            <div className="album_songs d-flex justify-content-center mt-3">
                <div className="d-flex row" id="main_cards">
                    <div className='card p-0 text-center defaultCard' >
                        <Link to={'#'} className="Card__link " data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                        >
                            {/* <div className='card-container me-auto ms-auto mt-3'> */}
                                {/* <img alt="" className="card-img-top img-newlbum" src={ImageAlbum} /> */}
                            {/* </div> */}
                            <div className="card-body mx-auto mt-4">
                            <div className="iconContainer mx-auto">
                                <i className="bi bi-plus-circle"></i>
                            </div>
                                {/* <p className="card-tittle">Añadir nuevo Album</p> */}
                            </div>
                        </Link>
                    </div>
                    {renderInformation()}
                    
                </div>
            </div>
                <div className="modal modal-lg  fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Agregar álbum</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body  ">
                                <div className=' p-0 border-light d-flex align-items-center' >
                                    <div className="card-img-cont pe-3">
                                        <img alt="" src={ImageAlbum} />
                                    </div>
                                    <div className="body-Modal">
                                        <form onChange={handleChange} 
                                        onSubmit={saveAlbum} 
                                        noValidate 
                                        className="needs-validation" 
                                        id="AlbumForm"
                                        >
                                            <div className="input-group mb-3">
                                                <input
                                                    className={(errors.title && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                    placeholder="Nombre"
                                                    name="title"
                                                    type="text"
                                                    id="title"
                                                    // defaultValue={album.title}
                                                    onBlur={handleValidate}
                                                />
                                                <div className={(errors.title && 'invalid-feedback') || 'valid-feedback'}>
                                                    {errors.title}
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <textarea
                                                    className={(errors.description && 'form-control w-75 is-invalid') || 'form-control w-75 is-valid'}
                                                    placeholder="Descripción"
                                                    name="description"
                                                    id="description"
                                                    type="text"
                                                    // defaultValue={album.description}
                                                    onBlur={handleValidate}
                                                    rows={'4'}
                                                />
                                                <div className={(errors.description && 'invalid-feedback') || 'valid-feedback'}>
                                                    {errors.description}
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input
                                                    className={(errors.gender && 'form-control w-75 is-invalid') || 'form-control w-75 is-valid'}
                                                    placeholder="Género musical"
                                                    name="gender"
                                                    id="gender"
                                                    type="text"
                                                    onBlur={handleValidate}
                                                />
                                                <div className={(errors.gender && 'invalid-feedback') || 'valid-feedback'}>
                                                    {errors.gender}
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input
                                                    className={(errors.year && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                                                    placeholder="Año"
                                                    min="1000"
                                                    max={currentDate()}
                                                    name="year"
                                                    type="number"
                                                    id="year"
                                                    // defaultValue={album.year}
                                                    onBlur={handleValidate}
                                                />
                                                <div className={(errors.year && 'invalid-feedback') || 'valid-feedback'}>
                                                    {errors.year}
                                                </div>
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
            
        </div>

    )
}

const getData = (ruta) => {
    return axiosClient.get(`${RutaApi}artist-albums/${ruta}`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}
const setData = (params) => {
    // console.log(params);
    return axiosClient.post(`${RutaApi}new-album`, { title: params.title, description: params.description, year: params.year, artist: params.artist, gender: params.gender })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}