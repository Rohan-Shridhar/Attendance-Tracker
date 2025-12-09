import React from 'react';
import { Hod_DB } from './database';
import hodAvatar from './assets/hod.gif';
import { LogoutIcon } from './ThemeToggle.jsx';

export default function Hodprofile({ onNavigate = () => {}, hodEmail = null }) {
  // Get HOD data from database
  const hodData = Hod_DB[hodEmail] || { name: 'Unknown', dept: 'Unknown' };

  const hod = {
    name: hodData.name,
    email: hodEmail,
    dept: hodData.dept,
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-link" onClick={() => onNavigate('home')} title="Logout">
          <LogoutIcon />
        </button>

        <div className="profile-header fixed-header">
          <div className="avatar">
            <img src={hodAvatar} alt="HOD Avatar" />
          </div>
          
          <div className="profile-info">
            <div className="profile-name">{hod.name}</div>
            <div className="profile-meta">Email: {hod.email}</div>
            <div className="profile-meta">Department: {hod.dept}</div>
          </div>
        </div>
        
        <hr className="profile-divider fixed-divider" />

        <div className="scrollable-content">
          <h2 className="section-title">Actions</h2>
          <div className="hod-actions-list subjects-list">
            <div className="subject-item">
              <div className="subject-title">Manage Faculty</div>
              <div className="subject-controls">
                <button 
                  className="subject-btn" 
                  onClick={() => onNavigate('manage-faculty')}
                >
                  Go →
                </button>
              </div>
            </div>

            <div className="subject-item">
              <div className="subject-title">Attendance Details</div>
              <div className="subject-controls">
                <button 
                  className="subject-btn" 
                  onClick={() => onNavigate('attendance-details')}
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