import { Link } from 'react-router-dom';
import { FaGraduationCap, FaMoneyBillWave, FaIdCard, FaComments } from 'react-icons/fa';
import Logo from '../components/Logo';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo">
            <Logo height="80px" withText={false} />
          </div>
          <h1>Welcome to GollisConnect</h1>
          <p>A comprehensive educational management system for Gollis University</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaMoneyBillWave />
              </div>
              <h3>Fee Payment</h3>
              <p>Pay your fees online using local payment methods like Telesom Zaad and Dahabshiil.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaGraduationCap />
              </div>
              <h3>Grades & GPA</h3>
              <p>Access your grades and GPA in real-time, track your academic progress easily.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaIdCard />
              </div>
              <h3>Student ID</h3>
              <p>Get your digital student ID card and semester validation stickers online.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaComments />
              </div>
              <h3>Communication</h3>
              <p>Stay connected with faculty and administration through our messaging system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About GollisConnect</h2>
              <p>GollisConnect is a modern educational management system designed specifically for Gollis University. Our platform streamlines administrative processes, improves operational efficiency, and enhances the student and faculty experience.</p>
              <p>With GollisConnect, students can pay fees online, access their grades in real-time, and communicate with faculty members all in one place.</p>
              <Link to="/about" className="btn btn-outline">Learn More</Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>Gollis University</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"GollisConnect has made it so much easier to pay my fees and check my grades. I no longer have to wait in long lines at the finance office."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Ahmed Mohamed</h4>
                  <p>Computer Science Student</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a faculty member, I can now submit grades more efficiently and communicate with my students directly through the platform."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Dr. Amina Hassan</h4>
                  <p>Engineering Department</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The digital ID card feature has been a game-changer. I can now validate my student ID without visiting the administration office."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Farah Abdi</h4>
                  <p>Business Administration Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join GollisConnect today and experience a better way to manage your academic journey.</p>
            <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 