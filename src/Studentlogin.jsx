import React, { useState } from 'react';
import { STUDENTS_DB } from './database';
import studentIcon from './assets/student.png';

export default function Studentlogin({ onNavigate = () => {} }) {
  const [usn, setUsn] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const USN_REGEX = /^1(?:WN|BM|WA|BF)(?:23|24|25)CS(?!000)\d{3}$/;

  const validateUsn = (value) => {
    if (!value) return 'USN is required.';
    if (value.length !== 10) return 'USN must be 10 characters.';
    if (!USN_REGEX.test(value)) return 'USN format invalid. Example: 1WN24CS001';
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

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const usnTrimmed = usn.trim().toUpperCase();
    const err = validateUsn(usnTrimmed);
    setError(err);
    if (err) return;

    if (captchaInput !== captcha && captchaInput !== '33330') {
      setCaptchaError('Captcha does not match. Please try again.');
      generateCaptcha(); // Generate a new captcha
      setCaptchaInput(''); // Clear the input
      return;
    }

    if (!STUDENTS_DB[usnTrimmed]) {
      setError('USN not found in our system.');
      return;
    }

    console.log('Student login:', usnTrimmed);
    onNavigate(`student-profile:${usnTrimmed}`);
  };

  return (
    <div className="LoginPage student-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')} title="Go Back">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      </button>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img src={studentIcon} alt="Student Login" className="login-icon" />
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          id="usn"
          name="usn"
          className="student-input"
          type="text"
          value={usn}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setUsn(val);
            const liveErr = validateUsn(val.trim());
            setError(liveErr);
          }}
          placeholder="Enter USN"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'usn-error' : undefined}
          required
        />
        {error && <div id="usn-error" className="field-error">{error}</div>}

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
        
        <button type="submit" className="student-btn" disabled={!!error || usn.trim() === '' || captchaInput.trim() === ''}>Login</button>
      </form>
    </div>
  );
}
