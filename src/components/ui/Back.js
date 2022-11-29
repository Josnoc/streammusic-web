
import { Link, useNavigate } from 'react-router-dom';

  export default function Back() {
  let navigate = useNavigate();
  
      return (
        <Link className="mb-3 btn__back"
                onClick={() => navigate(-1)}
        >Regresar</Link>
      )  
  }
