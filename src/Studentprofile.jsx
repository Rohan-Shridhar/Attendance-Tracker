// fileName: Studentprofile.jsx

import React, { useState } from "react";
import { STUDENTS_DB, SUBJECTS } from "./database";
import Subjectdetails from "./Subjectdetails";

export default function Studentprofile({ onNavigate, usn = null }) {
  const studentData = STUDENTS_DB[usn] || { name: "Unknown", class: "Unknown" };
  
  // Change 1: selected holds the subject name for details view, null for list view
  const [selectedSubject, setSelectedSubject] = useState(null); 

  // Function to calculate initials for the avatar
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-link" onClick={() => onNavigate("home")}>
          ← Logout
        </button>
        
        {/* Profile Header (remains visible on both views) */}
        <div className="profile-header">
          <div className="avatar">{getInitials(studentData.name)}</div>
          <div className="profile-info">
            <div className="profile-name">{studentData.name}</div>
            <div className="profile-meta">USN: {usn}</div>
            <div className="profile-meta">Class: {studentData.class}</div>
          </div>
        </div>
        <hr className="profile-divider" />

        {/* Change 2: Conditional Rendering based on selectedSubject state */}
        {selectedSubject ? (
          // --- SUBJECT DETAILS VIEW ---
          <div className="subject-details-wrapper">
            <button 
              className="back-link" 
              onClick={() => setSelectedSubject(null)}
              style={{ paddingLeft: 0, marginBottom: '12px' }}
            >
              ← Back to Subjects
            </button>
            <div className="subject-details">
              <Subjectdetails usn={usn} subjectName={selectedSubject} />
            </div>
          </div>
        ) : (
          // --- SUBJECT LIST VIEW (default) ---
          <div className="subjects-list">
            {SUBJECTS.map((subj) => (
              <div key={subj.id} className="subject-item">
                <div className="subject-title">{subj.name}</div>
                <div className="subject-controls">
                  <button 
                    className="subject-btn" 
                    // Change 3: Set selectedSubject to view details
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