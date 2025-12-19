import React from 'react';
import teacherAvatar from './assets/teacher.gif';
import { LogoutIcon } from './ThemeToggle.jsx';

export default function Teacherprofile({
  onNavigate = () => {},
  teacherEmail = null,
  teachers = {}
}) {
  // ✅ Teacher data from BACKEND (via App.jsx)
  const teacherData = teachers[teacherEmail];

  if (!teacherData) {
    return (
      <div className="profile-container">
        <p>Teacher data not found.</p>
      </div>
    );
  }

  const teacher = {
    name: teacherData.name,
    email: teacherEmail,
    subject: teacherData.subject,
    classes: teacherData.classes || [],
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        {/* Logout */}
        <button
          className="back-link"
          onClick={() => onNavigate('home')}
          title="Logout"
        >
          <LogoutIcon />
        </button>

        {/* Header */}
        <div className="profile-header fixed-header">
          <div className="avatar">
            <img src={teacherAvatar} alt="Teacher Avatar" />
          </div>

          <div className="profile-info">
            <div className="profile-name">{teacher.name}</div>
            <div className="profile-meta">Email: {teacher.email}</div>
            <div className="profile-meta">Subject: {teacher.subject}</div>
            <div className="profile-meta">
              Classes: {teacher.classes.join(', ')}
            </div>
          </div>
        </div>

        <hr className="profile-divider fixed-divider" />

        {/* Actions */}
        <div className="scrollable-content">
          <h2 className="section-title">Actions</h2>

          <div className="teacher-actions-list subjects-list">
            <div className="subject-item">
              <div className="subject-title">Mark Today's Attendance</div>
              <div className="subject-controls">
                <button
                  className="subject-btn"
                  onClick={() =>
                    onNavigate(`mark-attendance:${teacher.subject}`)
                  }
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
                  onClick={() =>
                    onNavigate(`previous-attendance:${teacher.subject}`)
                  }
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
