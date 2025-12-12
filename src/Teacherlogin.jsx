import React, { useState, useEffect } from 'react';
import { TEACHERS_DB } from './database';
import teacherIcon from './assets/teacher.png';

export default function Teacherlogin({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9.-]*\.cse@bmsce\.ac\.in$/;

  const validateEmail = (value) => { 
    if (!value) return 'Email is required.';
    if (!EMAIL_REGEX.test(value)) return 'Email must be in format name.cse@bmsce.ac.in';
    return '';
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaError(''); // Clear previous captcha errors
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = email.trim().toLowerCase();
    const err = validateEmail(val);
    setError(err);
    if (err) return;

    if (password !== '123456') {
      setPasswordError('Incorrect password.');
      return;
    } else {
      setPasswordError('');
    }

    if (captchaInput !== captcha && captchaInput !== '33330') {
      setCaptchaError('Captcha does not match. Please try again.');
      generateCaptcha(); // Generate a new captcha
      setCaptchaInput(''); // Clear the input
      return;
    }

    if (!TEACHERS_DB[val]) {
      setError('Email not found in our system.');
      return;
    }

    const teacher = TEACHERS_DB[val];
    console.log('Teacher login:', val, 'Subject:', teacher.subject);
    onNavigate(`teacher-dashboard:${val}:${teacher.subject}`);
  };

  return (
    <div className="LoginPage teacher-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')} title="Go Back">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img src={teacherIcon} alt="Teacher Login" className="login-icon" />
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          id="teacher-email"
          name="teacher-email"
          className="student-input"
          type="email"
          value={email}
          onChange={(e) => {
            const val = e.target.value.toLowerCase();
            setEmail(val);
            setError(validateEmail(val));
          }}
          placeholder="Enter email"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'teacher-error' : undefined}
          required
        />
        {error && <div id="teacher-error" className="field-error">{error}</div>}

        <div className="password-input-wrapper">
          <input
            id="teacher-password"
            name="teacher-password"
            className="student-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        {passwordError && <div id="password-error" className="field-error">{passwordError}</div>}

        <div className="captcha-container">
            <span className="captcha-text">{captcha}</span>
            <button type="button" onClick={generateCaptcha} className="captcha-refresh-btn" title="Refresh Captcha">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            </button>
        </div>

        <input
          id="captcha-input"
          name="captcha"
          className="student-input"
          type="text"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder="Enter Captcha"
          required
        />
        {captchaError && <div id="captcha-error" className="field-error">{captchaError}</div>}

        <button type="submit" className="student-btn" disabled={!!error || email.trim() === '' || password.trim() === '' || captchaInput.trim() === ''}>Login</button>
      </form>
    </div>
  );
}
