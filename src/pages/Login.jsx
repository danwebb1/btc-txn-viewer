import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { usePageTransition } from '../hooks/usePageTransition';
const Login = () => {
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
    <div className="login">
      <h2>Welcome to AnchorWatch Transaction Console</h2>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;