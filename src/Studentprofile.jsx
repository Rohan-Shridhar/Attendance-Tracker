import React, { useState } from "react";
import Subjectdetails from "./Subjectdetails";
import boyAvatar from "./assets/boy.gif";
import girlAvatar from "./assets/girl.gif";
import { LogoutIcon } from "./ThemeToggle.jsx";

export default function Studentprofile({
  onNavigate,
  usn,
  students,
  attendance,
}) {
  const student = students?.[usn];

  if (!student) {
    return (
      <div className="profile-container">
        <p>Student data not found.</p>
      </div>
    );
  }

  const avatar = student.gender === "F" ? girlAvatar : boyAvatar;
  const [selectedSubject, setSelectedSubject] = useState(null);

  // 🔒 Static subjects for now (as per your requirement)
  const SUBJECTS = ["DST", "DBMS", "JAVA", "COA", "LD", "USP", "FWD"];

  return (
    <div className="profile-container">
      <div className="profile-card" style={{ position: "relative" }}>
        
        {/* Logout */}
        <button
          className="back-link"
          onClick={() => onNavigate("home")}
          title="Logout"
        >
          <LogoutIcon />
        </button>

        {/* Header */}
        <div className={`profile-header ${selectedSubject ? "fixed-header" : ""}`}>
          <div className="avatar">
            <img src={avatar} alt="Student Avatar" />
          </div>
          <div className="profile-info">
            <div className="profile-name">{student.name}</div>
            <div className="profile-meta">USN: {usn}</div>
            <div className="profile-meta">Class: {student.class}</div>
          </div>
        </div>

        <hr className={`profile-divider ${selectedSubject ? "fixed-divider" : ""}`} />

        {/* Body */}
        {selectedSubject ? (
          <div className="subject-details-wrapper">
            <button
              className="back-link"
              onClick={() => setSelectedSubject(null)}
              style={{ marginBottom: "12px" }}
            >
              ← Back
            </button>

            <Subjectdetails
              usn={usn}
              subjectName={selectedSubject}
              attendance={attendance}
            />
          </div>
        ) : (
          <div className="subjects-list">
            {SUBJECTS.map(subject => (
              <div key={subject} className="subject-item">
                <div className="subject-title">{subject}</div>
                <div className="subject-controls">
                  <button
                    className="subject-btn"
                    onClick={() => setSelectedSubject(subject)}
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
