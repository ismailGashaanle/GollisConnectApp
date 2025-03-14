import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    studentId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (formData.role === 'student' && !formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData;
        await register(userData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        // Error is handled by the AuthContext
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            className={`form-control ${errors.department ? 'is-invalid' : ''}`}
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Medicine">Medicine</option>
            <option value="Law">Law</option>
          </select>
          {errors.department && <div className="invalid-feedback">{errors.department}</div>}
        </div>
        
        {formData.role === 'student' && (
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID"
            />
            {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register; 