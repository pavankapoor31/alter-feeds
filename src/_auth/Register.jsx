import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from '../components/AppContext/AppContext';
import googleIcon from "./../assets/images/google_icon.svg";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const sign_up = async () => {
    await signInWithGoogle();
    navigate('/home')
  }

  return (
    <section className="container-fluid d-flex align-items-end justify-content-center vh-100 position-relative">
      <img
        src="src/assets/images/sign_up.svg"
        alt="Background"
        className="position-absolute w-100 h-100 img-fluid p-md-0"
        style={{ objectFit: 'cover', zIndex: 0 }}
      />
      <div className="position-relative w-100 d-flex align-items-end justify-content-center" style={{ zIndex: 10 }}>
        <div className="bg-white w-100 gap-3 d-flex flex-column align-items-center justify-content-center  custom-rounded-top" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
          <div className="d-flex gap-2 align-items-center">
            <img src="src/assets/images/logo.svg" alt="logo" width={50} height={50} />
            <h1 className="fs-4 mb-0">Vibesnap</h1>
          </div>
          <p className="text-center">Moments That Matter, Shared Forever.</p>
          <Button onClick={sign_up} className="bg-dark text-white d-flex align-items-center gap-2 karla-font-600 border-radius-25">
            <img src={googleIcon} />
            Continue with Google
          </Button>
          {/* <Button onClick={logoutUser} className="btn btn-dark">
            Logout
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default Register;
