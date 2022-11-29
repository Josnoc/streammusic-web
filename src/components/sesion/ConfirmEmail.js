import { RutaApi } from '../../config/config';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axiosClient from "../../config/axiosClient";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function ConfirmEmail (props) {
    const { token } = useParams(props);
    const MySwal = withReactContent(Swal);

    const [verified, setVerified] = useState({
        hidden: 'true',
        message: ''
    });

    const navigate = useNavigate();

    const confirmEmail = async() => {
            await confirmMail(token).then((res) => {
                if (res.error) {
                    MySwal.fire({
                        title: <strong>¡Token con problemas!</strong>,
                        html: <i>{res.error}</i>,
                        icon: 'error',
                        allowOutsideClick: false,
                        didClose() {
                            setVerified({hidden: 'false', message: 'Error contacte a un administrador'})
                        }
                    });
                } else if(res.data) {
                    MySwal.fire({
                        title: <strong>¡Email confirmado correctamente!</strong>,
                        html: <i>{res.data.message} <br /> Serás redireccionado al Login</i>,
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        didClose() {
                            setVerified({hidden: 'false', message: 'Email confirmado, accede a través de la app o de este sitio'});
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
                console.log(res);
            })
    }

    useEffect(() => {
        confirmEmail();
      });
    return (
        <div className='container' style={{height: '600px'}}>
            <div className='d-flex justify-content-center align-items-center' style={{height: '100%'}}>
                
            <button class="btn btn-primary" type="button" style={{fontSize: '3rem'}} disabled>
            <span class="spinner-border spinner-border-sm" style={{width: '3rem', height: '3rem', fontSize: '3rem'}} role="status" aria-hidden="true"></span>
            Loading...
            </button>
            <button class="btn btn-primary" type="button" style={{fontSize: '3rem'}} disabled hidden={verified.hidden}>
            {/* <span class="spinner-border spinner-border-sm" style={{width: '3rem', height: '3rem', fontSize: '3rem'}} role="status" aria-hidden="true"></span> */}
            {verified.message}
            </button>
            </div>
        </div>
    )
}

// const verifyToken = (Token) => {
//     return axiosClient.post(`${RutaApi}validate-token`, { token: Token })
//         .then((response) => {
//             return { ...response };
//         })
//         .catch((error) => {
//             return { errorCode: error.code, error: error.message };
//         });
// }
const confirmMail = (Token) => {
    return axiosClient.get(`${RutaApi}verify-account/${Token}`)
        .then((response) => {
            return { ...response };
        })
        .catch((error) => {
            return { errorCode: error.code, error: error.message };
        });
}