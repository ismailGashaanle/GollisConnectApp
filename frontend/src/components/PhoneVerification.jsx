import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/PhoneVerification.css';

const PhoneVerification = () => {
  const { user, token } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check verification status on component mount
    const checkVerificationStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/verification/status`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.phoneNumber) {
          setPhoneNumber(response.data.phoneNumber);
        }
        
        setIsVerified(response.data.isVerified);
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    if (token) {
      checkVerificationStatus();
    }
  }, [token, API_URL]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/verification/send-code`,
        { phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCodeSent(true);
      toast.success('Verification code sent successfully');
      console.log('Verification SID:', response.data.verificationSid);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(error.response?.data?.message || 'Error sending verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/verification/verify-code`,
        { phoneNumber, code: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setVerificationStatus(response.data.status);
      
      if (response.data.status === 'approved') {
        setIsVerified(true);
        toast.success('Phone number verified successfully');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(error.response?.data?.message || 'Error verifying code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="phone-verification-container">
      <div className="card">
        <div className="card-header">
          <h3>Phone Verification</h3>
        </div>
        <div className="card-body">
          {isVerified ? (
            <div className="verified-status">
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i> Your phone number ({phoneNumber}) is verified
              </div>
              <p>You will now receive WhatsApp notifications for payments and grades.</p>
            </div>
          ) : (
            <>
              {!codeSent ? (
                <form onSubmit={handleSendCode}>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <div className="input-group">
                      <input
                        type="tel"
                        className="form-control"
                        id="phoneNumber"
                        placeholder="+252637856383"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'Send Code'
                          )}
                        </button>
                      </div>
                    </div>
                    <small className="form-text text-muted">
                      Enter your phone number with country code (e.g., +252637856383)
                    </small>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode}>
                  <div className="form-group">
                    <label htmlFor="verificationCode">Verification Code</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="verificationCode"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'Verify'
                          )}
                        </button>
                      </div>
                    </div>
                    <small className="form-text text-muted">
                      Enter the 6-digit code sent to your phone
                    </small>
                  </div>
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => setCodeSent(false)}
                      disabled={isLoading}
                    >
                      Change phone number
                    </button>
                    <button
                      type="button"
                      className="btn btn-link ml-3"
                      onClick={handleSendCode}
                      disabled={isLoading}
                    >
                      Resend code
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification; 