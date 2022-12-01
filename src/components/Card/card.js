
import React from 'react';
// import { RutaApi } from '../../config/config';
import { Link } from 'react-router-dom';
import defaultImg from '../../assets/imgs/albums.jpg'



export default function Card({ data, type, artist }) {
    
    return (
        <div className='card p-0 border-light text-center' key={data._id} >
            <Link to={(type === 'artist' && `/albums/${data.name}/${data._id}`) || (type === 'album' && `/album/${data.name}/${data._id}/${artist}`)}
                // {type & `/album/${data.name}` || type == 'album' & `/albums/${data._id}`  }
                className="Card__link "
            >
                <div className='card-container me-auto ms-auto card_img_container'>
                    <img alt='' className="align-middle mt-3" src={`${(data.image && data.image) || defaultImg }`} />
                </div>
                <div className="card-body">
                    <p className="card-tittle">{data.name}</p>
                    {/* <p className="card-text">{type == 'artist' && data.description || ""}</p> */}
                    <p className="card-text">{(type === 'album' && `Año ${data.year}`) || ""}</p>
                    
                </div>
            </Link>
            <div className='card-footer'>
                <Link to={`/EditData/${data.name && data.name}/${type}/${data._id}`} className="btn btn-primary">Editar</Link>
            </div>
        </div>

    )
}
