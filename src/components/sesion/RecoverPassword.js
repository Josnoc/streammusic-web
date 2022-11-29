import { RutaApi } from '../../config/config';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import axiosClient from "../../config/axiosClient";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function ConfirmEmail (props) {
    const { token } = useParams(props);
    const MySwal = withReactContent(Swal);

    // const [verified, setVerified] = useState({
    //     hidden: 'true',
    //     message: ''
    // });

    const navigate = useNavigate();

    const recovery = async() => {
        const validToken = await verifyToken(token);

        if (validToken.error) {
            MySwal.fire({
                title: <strong>¡Error en el token!</strong>,
                html: <i>{validToken.error}</i>,
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: false
                // didClose() {
                //     setVerified({hidden: 'false', message: 'Error contacte a un administrador'})
                // }
            });
        }
        if (validToken.data.message) {
            const {  value: password } = await Swal.fire({
            title: 'Introduzca la nueva contraseña',
            // input: 'Nueva',
            // inputLabel: 'Email address',
            // inputPlaceholder: 'Enter your email address',
            input: 'password',
            inputLabel: 'Nueva contraseña',
            inputPlaceholder: 'Nueva contraseña',
            allowOutsideClick: false,
          })

          if ( password) {
            recoverPassword(token, password).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Hubo problemas!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: false,
                        // didClose() {
                        //     setVerified({hidden: 'false', message: 'Error contacte a un administrador'})
                        // }
                    });
                } else if(res.data) {
                    MySwal.fire({
                        title: <strong>¡Contraseña cambiada!</strong>,
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
                        icon: 'error',
                        allowOutsideClick: false,
                    });
                }
                // console.log(res);
            })
          }
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
            {/* <button class="btn btn-primary" type="button" style={{fontSize: '3rem'}} disabled hidden={`${verified.hidden}`}>
            {verified.message}
            </button> */}
            </div>
        </div>
    )
}

const verifyToken = (Token) => {
    return axiosClient.post(`${RutaApi}validate-token`, { token: Token })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}
const recoverPassword = (Token, Password) => {
    return axiosClient.post(`${RutaApi}update-password`, { token: Token, password: Password })
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}