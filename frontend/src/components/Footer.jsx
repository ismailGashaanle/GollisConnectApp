import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Logo height="50px" />
            <p>A comprehensive educational management system for Gollis University.</p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Student Services</h3>
              <ul>
                <li><Link to="/payments">Fee Payments</Link></li>
                <li><Link to="/grades">Grades & GPA</Link></li>
                <li><Link to="/dashboard">Student Dashboard</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact Us</h3>
              <address>
                <p>Gollis University</p>
                <p>Hargeisa, Somaliland</p>
                <p>Email: info@gollis.edu.so</p>
                <p>Phone: +252 63 4218942</p>
              </address>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} GollisConnect. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 