// fileName: Teacherprofile.jsx

import React from 'react';
import { TEACHERS_DB } from './database';

export default function Teacherprofile({ onNavigate = () => {}, teacherEmail = null }) {
  // 1. Look up teacher data using the email provided on successful login
  const teacherData = TEACHERS_DB[teacherEmail] || { name: 'Unknown', subject: 'Unknown' };

  const teacher = {
    name: teacherData.name,
    email: teacherEmail,
    subject: teacherData.subject,
  };

  // Function to generate initials for the avatar
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
  };

  return (
    <div className="profile-container">
      {/* The main profile-card needs to be the scroll container.
        We will apply scrolling styles to it in CSS.
      */}
      <div className="profile-card"> 
        {/* Back button, navigating back to the home/role selection */}
        <button className="back-link" onClick={() => onNavigate('home')}>
          ← Logout
        </button>

        {/* PROFILE HEADER - This part will remain fixed (pinned) */}
        <div className="profile-header fixed-header"> 
          {/* 2. Teacher Avatar (using initials) */}
          <div className="avatar">{getInitials(teacher.name)}</div>
          
          <div className="profile-info">
            {/* 3. Name, Email, and Subject */}
            <div className="profile-name">{teacher.name}</div>
            <div className="profile-meta">Email: {teacher.email}</div>
            <div className="profile-meta">Subject: {teacher.subject}</div>
          </div>
        </div>
        
        {/* Divider should also be fixed to the header */}
        <hr className="profile-divider fixed-divider" /> 

        {/* ACTION LIST - This part will scroll */}
        <div className="scrollable-content">
          <h2 className="section-title">Actions</h2>
          <div className="teacher-actions-list subjects-list">
            {/* Action 1: Mark Today's Attendance */}
            <div className="subject-item">
              <div className="subject-title">Mark Today's Attendance</div>
              <div className="subject-controls">
                <button 
                  className="subject-btn" 
                  // Navigate to the attendance marking page
                  onClick={() => onNavigate(`mark-attendance:${teacher.subject}`)} 
                >
                  Go →
                </button>
              </div>
            </div>

            {/* Action 2: See Previous Attendance */}
            <div className="subject-item">
              <div className="subject-title">See Previous Attendance</div>
              <div className="subject-controls">
                <button 
                  className="subject-btn" 
                  // Navigate to the previous attendance history page
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