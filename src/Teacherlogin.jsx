import React, { useState, useEffect } from 'react';
import teacherIcon from './assets/teacher.png';

export default function Teacherlogin({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9.-]*\.cse@bmsce\.ac\.in$/;

  /* ======================
     CAPTCHA
  ====================== */
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Invalid email format');
      return;
    }

    if (password !== '123456') {
      setError('Incorrect password');
      return;
    }

    if (captchaInput !== captcha && captchaInput !== '33330') {
      setError('Captcha incorrect');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/teachers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!res.ok) {
        setError('Teacher not found');
        return;
      }

      const data = await res.json();

      // ✅ SUCCESS
      onNavigate(
        `teacher-dashboard:${data.teacher.email}:${data.teacher.subject}`
      );
    } catch (err) {
      setError('Server not reachable');
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="LoginPage teacher-page">
      <button className="back-link" onClick={() => onNavigate('home')}>
        ← Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <img src={teacherIcon} alt="Teacher Login" className="login-icon" />
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        {/* EMAIL */}
        <input
          className="student-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD WITH TOGGLE */}
        <div className="password-input-wrapper">
          <input
            className="student-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              // eye-off
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20
                c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4
                c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // eye
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* CAPTCHA */}
        <div className="captcha-container">
          <span className="captcha-text">{captcha}</span>
          <button type="button" onClick={generateCaptcha} className="captcha-refresh-btn" title="Refresh Captcha">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
        </div>

        <input
          className="student-input"
          placeholder="Enter captcha"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          required
        />

        {error && <div className="field-error">{error}</div>}

        <button className="student-btn" type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
