import { RutaApi } from '../../config/config';
import { useNavigate} from 'react-router-dom';
import React, { useEffect } from 'react';
import axiosClient from "../../config/axiosClient";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function ConfirmEmail () {
    const MySwal = withReactContent(Swal);

    // const [verified, setVerified] = useState({
    //     hidden: 'true',
    //     message: ''
    // });

    const navigate = useNavigate();

    const recovery = async() => {
        const { value: email, isDenied } = await Swal.fire({
            title: 'Introduce tu correo electrónico',
            input: 'email',
            // inputLabel: 'Email',
            inputPlaceholder: 'Email',
            allowOutsideClick: false,
            confirmButtonText: 'Enviar',
            showDenyButton: true,
            denyButtonText: `Regresar`
          })
          
          if (isDenied === true) {
            navigate('/Login', { replace: true });
          } else if (email) {
            recoverPassword(email).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Hubo problemas con el email!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: false,
                        // didClose() {
                        //     setVerified({hidden: 'false', message: 'Error contacte a un administrador'})
                        // }
                    });
                } else if(res.data) {
                    MySwal.fire({
                        title: <strong>¡Email correcto!</strong>,
                        html: <i>{res.data.message}</i>,
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        didClose() {
                            // setVerified({hidden: 'false', message: 'Email confirmado, accede a través de la app o de este sitio'});
                            navigate('/login', { replace: true });
                        }
                    });
                } else {
                    MySwal.fire({
                        title: <strong>¡Error inesperado!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'success',
                        allowOutsideClick: false,
                    });
                }
                // console.log(res);
            })
          }
    }

    useEffect(() => {
        recovery();
      });
    return (
        <div className='container' style={{height: '600px'}}>
            <div className='d-flex justify-content-center align-items-center' style={{height: '100%'}}>
                
            <button className="btn btn-primary" type="button" style={{fontSize: '3rem'}} disabled>
            <span className="spinner-border spinner-border-sm" style={{width: '3rem', height: '3rem', fontSize: '3rem'}} role="status" aria-hidden="true"></span>
            Loading...
            </button>
            {/* <button className="btn btn-primary" type="button" style={{fontSize: '3rem'}} disabled hidden={`{${verified.hidden}}`}>
            {verified.message}
            </button> */}
            </div>
        </div>
    )
}

const recoverPassword = (Email) => {
    return axiosClient.post(`${RutaApi}restore-password`, { email: Email })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}