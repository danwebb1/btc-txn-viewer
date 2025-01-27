import {useAuth, User} from '../context/AuthContext.tsx';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>AnchorWatch</h1>
      </div>

      <div className="navbar-menu">
        <div className="navbar-links">
          <a onClick={() => navigate('/')}>Dashboard</a>
        </div>

        {user && (
          <div className="navbar-profile">
            <div
              className="profile-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-image"
              />
              <span>{user.displayName}</span>
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown">
                <a onClick={() => navigate('/settings')}>Settings</a>
                <div className="dropdown-divider"></div>
                <a onClick={handleSignOut}>Sign Out</a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;