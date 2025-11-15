import React, { useState } from 'react';
import { STUDENTS_DB } from './database';

export default function Studentlogin({ onNavigate = () => {} }) {
  const [usn, setUsn] = useState('');
  const [error, setError] = useState('');

  // USN pattern: 1(WN|BM|WA|BF)(23|24|25)CS(three digits not 000)
  const USN_REGEX = /^1(?:WN|BM|WA|BF)(?:23|24|25)CS(?!000)\d{3}$/;

  const validateUsn = (value) => {
    if (!value) return 'USN is required.';
    if (value.length !== 10) return 'USN must be 10 characters.';
    if (!USN_REGEX.test(value)) return 'USN format invalid. Example: 1WN24CS001';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usnTrimmed = usn.trim().toUpperCase();
    const err = validateUsn(usnTrimmed);
    setError(err);
    if (err) return;

    // Check if student exists in database
    if (!STUDENTS_DB[usnTrimmed]) {
      setError('USN not found in our system.');
      return;
    }

    console.log('Student login:', usnTrimmed);
    // Navigate to student profile with USN
    onNavigate(`student-profile:${usnTrimmed}`);
  };

  return (
    <div className="LoginPage student-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')}>← Back</button>
      <h2>Student Login</h2>

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
            // live-validate
            const liveErr = validateUsn(val.trim());
            setError(liveErr);
          }}
          placeholder="Enter USN"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'usn-error' : undefined}
          required
        />
        {error && <div id="usn-error" className="field-error">{error}</div>}

        <button type="submit" className="student-btn" disabled={!!error || usn.trim() === ''}>Login</button>
      </form>
    </div>
  );
}
