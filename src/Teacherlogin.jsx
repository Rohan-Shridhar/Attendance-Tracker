import React, { useState } from 'react';
import { TEACHERS_DB } from './database';

export default function Teacherlogin({ onNavigate = () => {} }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // pattern: name.cse@bmsce.ac.in where name contains letters, numbers, dots or hyphens (but we require at least one letter)
  const EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9.-]*\.cse@bmsce\.ac\.in$/;

  const validateEmail = (value) => {
    if (!value) return 'Email is required.';
    if (!EMAIL_REGEX.test(value)) return 'Email must be in format name.cse@bmsce.ac.in';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = email.trim().toLowerCase();
    const err = validateEmail(val);
    setError(err);
    if (err) return;

    // Check if teacher exists in database
    if (!TEACHERS_DB[val]) {
      setError('Email not found in our system.');
      return;
    }

    const teacher = TEACHERS_DB[val];
    console.log('Teacher login:', val, 'Subject:', teacher.subject);
    // Navigate to teacher dashboard with email and subject (already assigned in database)
    onNavigate(`teacher-dashboard:${val}:${teacher.subject}`);
  };

  return (
    <div className="LoginPage teacher-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')}>← Back</button>
      <h2>Teacher Login</h2>

      <form className="student-form" onSubmit={handleSubmit}>
        <label htmlFor="teacher-email" className="student-label">Enter email</label>
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

        <button type="submit" className="student-btn" disabled={!!error || email.trim() === ''}>Login</button>
      </form>
    </div>
  );
}
