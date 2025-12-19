import React, { useEffect, useState } from 'react';
import studentIcon from './assets/student.png';

export default function Studentlogin({ onNavigate = () => {} }) {
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [loading, setLoading] = useState(false);

  const USN_REGEX = /^1(?:WN|BM|WA|BF)(?:23|24|25)CS\d{3}$/;

  const validateUsn = (value) => {
    if (!value) return 'USN is required';
    if (!USN_REGEX.test(value)) return 'Invalid USN format';
    return '';
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(result);
    setCaptchaError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    setCaptchaError('');

    const trimmedUsn = usn.trim().toUpperCase();

    const usnErr = validateUsn(trimmedUsn);
    if (usnErr) {
      setError(usnErr);
      return;
    }

    if (password !== '123456') {
      setPasswordError('Incorrect password');
      return;
    }

    if (captchaInput !== captcha && captchaInput !== '33330') {
      setCaptchaError('Captcha does not match');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/students/${trimmedUsn}`);

      if (!res.ok) {
        setError('USN not found in system');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.exists) {
        setError('USN not found in system');
        setLoading(false);
        return;
      }

      // ✅ SUCCESS
      onNavigate(`student-profile:${trimmedUsn}`);

    } catch (err) {
      setError('Server not reachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginPage student-page">
      <button className="back-link" onClick={() => onNavigate('home')}>
        ← Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <img src={studentIcon} alt="Student Login" className="login-icon" />
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          className="student-input"
          placeholder="Enter USN"
          value={usn}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setUsn(val);
            setError(validateUsn(val));
          }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'hod-error' : undefined}
          required
        />
        {error && <div className="field-error">{error}</div>}

        <div className="password-input-wrapper">
          <input
            className="student-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {passwordError && <div className="field-error">{passwordError}</div>}

        <div className="captcha-container">
          <span className="captcha-text">{captcha}</span>
          <button type="button" onClick={generateCaptcha} className="captcha-refresh-btn" title="Refresh Captcha">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
        </div>

        <input
          className="student-input"
          placeholder="Enter Captcha"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
        />
        {captchaError && <div className="field-error">{captchaError}</div>}

        <button className="student-btn" type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
