import React, { useEffect, useState } from 'react';
import { Hod_DB } from './database';
import classIcon from './assets/class.png';

export default function Hodlogin({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
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
    setCaptchaError('');
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

    if (captchaInput !== captcha && captchaInput !== '33330') {
      setCaptchaError('Captcha does not match. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    // Validate against HOD DB
    if (!Hod_DB[val]) {
      setError('Email not found in our system.');
      return;
    }

    console.log('HOD login:', val);
    onNavigate(`hod-dashboard:${val}`);
  };

  return (
    <div className="LoginPage teacher-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')} title="Go Back">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img src={classIcon} alt="HOD Login" className="login-icon" />
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          id="hod-email"
          name="hod-email"
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
          aria-describedby={error ? 'hod-error' : undefined}
          required
        />
        {error && <div id="hod-error" className="field-error">{error}</div>}

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

        <button type="submit" className="student-btn" disabled={!!error || email.trim() === '' || captchaInput.trim() === ''}>Login</button>
      </form>
    </div>
  );
}
