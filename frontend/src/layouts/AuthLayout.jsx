import { Outlet, Link } from 'react-router-dom';
import '../styles/AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <Link to="/">
            <h1>GollisConnect</h1>
          </Link>
        </div>
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 