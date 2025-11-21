import React from 'react';
import { TEACHERS_DB } from './database';
import teacherAvatar from './assets/teacher.gif';
import { LogoutIcon } from './ThemeToggle.jsx';

export default function Teacherprofile({ onNavigate = () => {}, teacherEmail = null }) {
  const teacherData = TEACHERS_DB[teacherEmail] || { name: 'Unknown', subject: 'Unknown' };

  const teacher = {
    name: teacherData.name,
    email: teacherEmail, 
    subject: teacherData.subject,
  };

  return (
    <div className="profile-container">
      <div className="profile-card"> 
        <button className="back-link" onClick={() => onNavigate('home')} title="Logout">
          <LogoutIcon />
        </button>

        <div className="profile-header fixed-header"> 
          <div className="avatar">
            <img src={teacherAvatar} alt="Teacher Avatar" />
          </div>
          
          <div className="profile-info">
            <div className="profile-name">{teacher.name}</div>
            <div className="profile-meta">Email: {teacher.email}</div>
            <div className="profile-meta">Subject: {teacher.subject}</div>
          </div>
        </div>
        
        <hr className="profile-divider fixed-divider" /> 

        <div className="scrollable-content">
          <h2 className="section-title">Actions</h2>
          <div className="teacher-actions-list subjects-list">
            <div className="subject-item">
              <div className="subject-title">Mark Today's Attendance</div>
              <div className="subject-controls">
                <button 
                  className="subject-btn" 
                  onClick={() => onNavigate(`mark-attendance:${teacher.subject}`)} 
                >
                  Go →
                </button>
              </div>
            </div>

            <div className="subject-item">
              <div className="subject-title">See Previous Attendance</div>
              <div className="subject-controls">
                <button 
                  className="subject-btn" 
                  onClick={() => onNavigate(`previous-attendance:${teacher.subject}`)} 
                >
                  Go →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}