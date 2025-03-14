import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Logo.css';

const Logo = ({ width = 'auto', height = '50px', withText = true, className = '' }) => {
  const logoUrl = 'https://media.licdn.com/dms/image/v2/C4E0BAQHqhuqoxHldhw/company-logo_200_200/company-logo_200_200/0/1643699691224/gollis_edu_logo?e=2147483647&v=beta&t=oe3dAluSO_i5hRnHEqkHnFhL3agqfRbs0kpGq5aX5Cg';
  
  return (
    <Link to="/" className={`logo-container ${className}`}>
      <img 
        src={logoUrl} 
        alt="Gollis University Logo" 
        style={{ width, height }}
        className="logo-image"
      />
      {withText && (
        <span className="logo-text">GollisConnect</span>
      )}
    </Link>
  );
};

export default Logo; 