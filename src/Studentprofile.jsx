import React, { useState } from "react";
import { STUDENTS_DB, SUBJECTS } from "./database";
import Subjectdetails from "./Subjectdetails"; 
import boyAvatar from './assets/boy.gif';
import girlAvatar from './assets/girl.gif';
import { LogoutIcon } from './ThemeToggle.jsx';

export default function Studentprofile({ onNavigate, usn = null }) {
  const studentData = STUDENTS_DB[usn] || { name: "Unknown", class: "Unknown", gender: "M" };
  const studentAvatar = studentData.gender === 'F' ? girlAvatar : boyAvatar;
  
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="profile-container">
      <div className="profile-card" style={{ position: 'relative' }}>
        <button className="back-link" onClick={() => onNavigate("home")} title="Logout" >
          <LogoutIcon />
        </button>
        
        <div className={`profile-header ${selectedSubject ? 'fixed-header' : ''}`}>
          <div className="avatar">
            <img src={studentAvatar} alt="Student Avatar" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{studentData.name}</div>
            <div className="profile-meta">USN: {usn}</div>
            <div className="profile-meta">Class: {studentData.class}</div>
          </div>
        </div>
        <hr className={`profile-divider ${selectedSubject ? 'fixed-divider' : ''}`} />

        {selectedSubject ? (
          <div className="subject-details-wrapper">
            <button 
              className="back-link" 
              onClick={() => setSelectedSubject(null)}
              style={{ marginBottom: '12px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="subject-details">
              <Subjectdetails usn={usn} subjectName={selectedSubject} />
            </div>
          </div>
        ) : (
          <div className="subjects-list">
            {SUBJECTS.map((subj) => (
              <div key={subj.id} className="subject-item">
                <div className="subject-title">{subj.name}</div>
                <div className="subject-controls">
                  <button 
                    className="subject-btn" 
                    onClick={() => setSelectedSubject(subj.name)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}