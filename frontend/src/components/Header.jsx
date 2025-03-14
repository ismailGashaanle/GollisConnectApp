import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Logo from './Logo';
import '../styles/Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Logo height="40px" />
          </div>

          <div className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <nav className={`nav ${isMenuOpen ? 'show' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                  Home
                </NavLink>
              </li>
              
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>
                      Payments
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/grades" className={({ isActive }) => isActive ? 'active' : ''}>
                      Grades
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                      About
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
                      Contact
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="auth-buttons">
              {currentUser ? (
                <div className="user-menu">
                  <NavLink to="/profile" className="profile-link">
                    <FaUser /> {currentUser.firstName}
                  </NavLink>
                  <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">Login</Link>
                  <Link to="/register" className="btn btn-primary">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 