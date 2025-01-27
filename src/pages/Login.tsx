import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { usePageTransition } from '../hooks/usePageTransition.ts';
import React, {ReactElement} from "react";
const Login = (): ReactElement|null => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  usePageTransition();
  const signInWithGoogle = async () => {
    try {
      startLoading();
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
        <div className="grid grid-flow-col grid-cols-2 grid-rows-10 gap-0 login-form">
          <div className="col-span-2 row-span-1"></div>
          <div className="col-span-2 row-span-1 login-instructions">LOGIN TO YOUR ACCOUNT</div>
          <div className="row-span-8 col-span-1 login-button-col content-center">
              <button className="w-full bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-600 transition duration-300" onClick={signInWithGoogle}>
                Sign in with Google
            </button></div>
          <div className="row-span-8 col-span-1 gmail justify-self-center content-center">
              <img className="h-48 w-96 object-scale-down" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/1280px-Gmail_icon_%282020%29.svg.png"/>
           </div>
        </div>
  );
};

export default Login;