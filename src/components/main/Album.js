import { useState, useEffect } from "react";
import { RutaApi } from '../../config/config';
import { useParams } from 'react-router-dom';
import axiosClient from "../../config/axiosClient";
import Back from "../ui/Back";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { longCadena, requiredField, onlyNumber} from '../../utils/validator'

export default function Album(props) {
  const { name, _id, artist } = useParams(props);
  // console.log(artist);
  const [songs, setSongs] = useState([]);
  const [albumImage, setAlbumImage] = useState('');
  const [song, setSong] = useState({
    number: '',
    name: '',
    album: _id,
    file: '',
    artist: ''
  });
  const [songEdit, setSongEdit] = useState({
    _id: '',
    number: '',
    name: '',
    duration: '',
    album: _id,
    file: ''
  });

  const [errors, setErrors] = useState({});
  const [errorsEdit, setErrorsEdit] = useState({});

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
    // console.log(getInfo.data);
    let number = 0;
    getInfo.data.forEach((element, index) => {
      if (element.album._id === _id) {
      setAlbumImage(element.album.image);
        dataSet[number] = { _id: element._id,number: element.number, name: element.name, duration: element.duration, album: element.album.title, album_id: element.album._id, artist_id: element.album.artist, file: element.file }
        number++;
      }
    });

    //change state of Artist
    setSongs(dataSet);
  }

  //Mapping artists
  const renderInformation = () => (
    songs.map((song, index) => (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td className="text-capitalize">{song.name}</td>
        <td className="text-capitalize">{song.album}</td>
        <td>{song.duration} m</td>
        <td><button className="btn btn-primary" onClick={()=>{settingEditData(song._id)}} data-bs-toggle="modal" data-bs-target="#EditSongModal">Editar</button><button className="btn btn-danger" onClick={()=>{deleteThis(song._id)}}>Eliminar</button></td>
      </tr>

    ))
  )

  useEffect(() => {
    //execute async function to get data
    gettingData();
  }, []);

  const handleValidate = (e) => {
    e.preventDefault();
    const validaciones = {};
    let validacion = requiredField(song.name);
    if (validacion) {
        validaciones.name = validacion;
    }
    validacion = longCadena(song.name, 300, null);
    if (validacion) {
        validaciones.name = validacion;
    }
    validacion = requiredField(song.number);
    if (validacion) {
        validaciones.number = validacion;
    }
    validacion = onlyNumber(song.number);
    if (validacion) {
        validaciones.number = validacion;
    }
    validacion = requiredField(song.file);
    if (validacion) {
        validaciones.file = validacion;
    }
    if (Object.keys(validaciones).length > 0) {
      setErrors({ ...validaciones });
      return
    }
  }

  const handleValidateEdit = (e) => {
    e.preventDefault();
    const validaciones = {};
    let validacion = requiredField(songEdit.name);
    if (validacion) {
        validaciones.name = validacion;
    }
    validacion = longCadena(songEdit.name, 300, null);
    if (validacion) {
        validaciones.name = validacion;
    }
    validacion = requiredField(songEdit.number);
    if (validacion) {
        validaciones.number = validacion;
    }
    validacion = onlyNumber(songEdit.number);
    if (validacion) {
        validaciones.number = validacion;
    }
    if (Object.keys(validaciones).length > 0) {
      setErrors({ ...validaciones });
      return
    }
  }

  const handleChange = (e) => {
    // console.log(e.target.files[0]);
    // console.log(e.target.value);
    e.preventDefault();
    if (e.target.files) {
      setSong({ ...song, [e.target.name]: e.target.files[0] })
    }else{
      setSong({ ...song, [e.target.name]: e.target.value })
    }
    
    //Remove the error to the edited property
    delete errors[e.target.name];
    setErrors({ ...errors });
  }

  const handleChangeEdit = (e) => {
    e.preventDefault();
    if (e.target.files) {
      setSongEdit({ ...songEdit, [e.target.name]: e.target.files[0] })
    }else{
      setSongEdit({ ...songEdit, [e.target.name]: e.target.value })
    }
    //Remove the error to the edited property
    delete errorsEdit[e.target.name];
    setErrorsEdit({ ...errorsEdit });
  }

  const saveSong = async (e) => {
    e.preventDefault();
    if (!errors.number && !errors.name && !errors.file) {
      setData(song, _id, artist).then((res) => {
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
              document.getElementById("SongForm").reset();
              gettingData();
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

  const deleteThis = async (id) => {
    console.log(id);
    Swal.fire({
      title: '¿Seguro que quiere eliminar esta canción?',
      // inputValue: inputValue,
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
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
                gettingData();
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

  const updateSong = async (e) => {
    e.preventDefault();
    if (!errorsEdit.name && !errorsEdit.number) {
      putData(songEdit, _id, artist).then((res) => {
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
              gettingData();
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

  const settingEditData = (id) => {
    songs.forEach((song)=>{
      if (song._id === id) {
        setSongEdit({_id: song._id, number: song.number, name: song.name, duration: song.duration, album: _id, file: song.file})
      }
    })
  }

  const setSongsPlay = (songs) => {
    
  }

  return (
    <div className="p-3" id="Album_main">
      <div className="d-block ps-3">
        <Back />
      </div>
      <div className="album__header d-flex ps-3">
        <div><img alt="" src={albumImage} />
        </div>

        <div className="pt-5 ps-3">
          <h5>Album</h5>
          <h1>{name ? name : 'Artist'}</h1>
        </div>
      </div>
      <div className="album__controls pt-2">
        <div className="album__controls--buttons">
          <button className="btn_play" onClick={()=>{setSongsPlay(songs)}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
          </svg></button>
          <button className="btn_fav">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
            </svg>
          </button>
          <button className="button_addSong" data-bs-toggle="modal" data-bs-target="#AddSongModal">Agregar canción</button>
        </div>
      </div>
      <div className="album_songs d-flex justify-content-center mt-3 text-center">
        <table className="table" id="songsTable">
          <thead >
            <tr>
              <th scope="col">#</th>
              <th scope="col">Título</th>
              <th scope="col">Album</th>
              <th scope="col">Duración</th>
              <th scope="col">opciones</th>
            </tr>
          </thead>
          <tbody>
            {renderInformation()}

          </tbody>
        </table>
      </div>
      {/* Start Modal AddSong */}
      <div className="modal modal-lg fade" id="AddSongModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="SongBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="SongBackdropLabel">Agregar Canción</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body  ">
              <div className=' p-0 border-light d-flex align-items-center' >
                <div className="card-img-cont ">
                  <img alt="" src={albumImage} />
                </div>
                <div className="body-Modal ps-2">
                  <form onChange={handleChange} onSubmit={saveSong} noValidate className="needs-validation" id="SongForm" encType="multipart/form-data"
                  >
                    <div className="input-group mb-3">
                      <input
                        className={(errors.number && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                        placeholder="Número"
                        min="1"
                        max="1000"
                        name="number"
                        type="number"
                        id="number"
                        // defaultValue={album.}
                        onBlur={handleValidate}
                      />
                      <div className={(errors.number && 'invalid-feedback') || 'valid-feedback'}>
                        {errors.number}
                      </div>
                    </div>
                    <div className="input-group mb-3">
                      <input
                        className={(errors.name && 'w-75 form-control is-invalid') || 'form-control w-75 is-valid'}
                        placeholder="Nombre o título"
                        name="name"
                        type="text"
                        id="name"
                        // defaultValue={album.name}
                        onBlur={handleValidate}
                      />
                      <div className={(errors.name && 'invalid-feedback') || 'valid-feedback'}>
                        {errors.name}
                      </div>
                    </div>
                    <div className="input-group mb-3">
                      <input
                        className={(errors.file && 'form-control form-control-lg w-75 is-invalid') || 'form-control form-control-lg w-75'}
                        placeholder="Seleccionar archivo"
                        name="file"
                        id="file"
                        type="file"
                        // defaultValue={album.description}
                        onBlur={handleValidate}
                      />
                      <div className={errors.file && 'invalid-feedback'}>
                        {errors.file}
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
      {/* End Modal AddSong */}

      {/* Start Modal Edit Element Song */}
      <div className="modal fade" id="EditSongModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="EditSongBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="EditSongBackdropLabel">Editar Canción</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body-edit ">
              <div className=' p-0 border-light d-flex align-items-center w-100' >
                {/* <div className="card-img-cont ">
                  <img src={ImageAlbum} />
                </div> */}
                <div className="body-Modal p-3">
                  <form onChange={handleChangeEdit} 
                  onSubmit={updateSong} 
                  noValidate 
                  className="needs-validation" 
                  id="EditSongForm" 
                  encType="multipart/form-data"
                  >
                    <div className="input-group mb-3">
                      <input
                        className={(errorsEdit.number && 'w-100 form-control is-invalid') || 'form-control w-100 is-valid'}
                        placeholder="Número"
                        min="1"
                        max="1000"
                        name="number"
                        type="number"
                        id="number"
                        defaultValue={songEdit.number}
                        onChange={handleValidateEdit}
                        // onBlur
                      />
                      <div className={(errorsEdit.number && 'invalid-feedback') || 'valid-feedback'}>
                        {errorsEdit.number}
                      </div>
                    </div>
                    <div className="input-group mb-3">
                      <input
                        className={(errorsEdit.name && 'w-100 form-control is-invalid') || 'form-control w-100 is-valid'}
                        placeholder="Nombre"
                        name="name"
                        type="text"
                        id="name"
                        defaultValue={songEdit.name}
                        onChange={handleValidateEdit}
                        // onBlur
                      />
                      <div className={(errorsEdit.name && 'invalid-feedback') || 'valid-feedback'}>
                        {errorsEdit.name}
                      </div>
                    </div>
                    <div className="input-group mb-3">
                    <label htmlFor="file" className="form-label" style={{color: 'gray'}}>El archivo es opcional para actualizar</label>
                      <input
                        className='form-control form-control-lg w-100'
                        placeholder="Seleccionar archivo Opcional"
                        name="file"
                        id="file"
                        type="file"
                        // defaultValue={album.description}
                        // onBlur={handleValidate}
                      />
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
    </div>

  )
}

const getData = () => {
  return axiosClient.get(`${RutaApi}songs`)
    .then((response) => {
      return { ...response };
    })
    .catch((error) => {
      return { errorCode: error.code, error: error.message };
    });
}

const setData = (params, album, artist) => {
  var formData = new FormData();
  formData.append("number", params.number);
  formData.append("name", params.name);
  formData.append("album", album);
  formData.append("artist", artist);
  formData.append("file", params.file);
  return axiosClient.post(`${RutaApi}new-song`, formData, {headers: {"Content-Type": "multipart/form-data",}})
    .then((response) => {
      return { ...response };
    })
    .catch((error) => {
      return { errorCode: error.code, error: error.message };
    });
}

const deleteData = (id) => {
  return axiosClient.delete(`${RutaApi}delete-song/${id}`)
    .then((response) => {
      return { ...response };
    })
    .catch((error) => {
      return { errorCode: error.code, error: error.message };
    });
}

const putData = (songUp, album, artist) => {
  var formData = new FormData();
  formData.append("number", songUp.number);
  formData.append("name", songUp.name);
  formData.append("album", album);
  formData.append("artist", artist);
  if (songUp.file) {
  formData.append("file", songUp.file);
  }
  console.log(songUp._id);
  return axiosClient.put(`${RutaApi}update-song/${songUp._id}`, formData, {headers: {"Content-Type": "multipart/form-data",}})
    .then((response) => {
      return { ...response };
    })
    .catch((error) => {
      return { errorCode: error.code, error: error.message };
    });
}