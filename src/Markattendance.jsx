import React, { useState, useEffect } from "react";
import classIcon from "./assets/class.gif";

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

export default function MarkAttendance({
  onNavigate = () => {},
  subjectName,
  teacherClasses = [],   
  students = {},
  attendance = {}
}) {
  const todayDate = getTodayDateString();
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Replace the old cleanClasses line with this:
const cleanClasses = Array.isArray(teacherClasses) 
    ? teacherClasses.flatMap(cls => typeof cls === 'string' ? cls.split(",") : cls).map(s => s.trim())
    : (typeof teacherClasses === "string" ? teacherClasses.split(",").map(s => s.trim()) : []);

  useEffect(() => {
    if (cleanClasses.length > 0 && !selectedClass) {
      setSelectedClass(cleanClasses[0]);
    }
  }, [cleanClasses, selectedClass]);

  useEffect(() => {
    if (!selectedClass) return;
    const todaysSubjectAttendance = attendance[todayDate]?.[subjectName] || {};
    
    const list = Object.entries(students)
      .filter(([_, s]) => String(s.class) === String(selectedClass))
      .map(([usn, s]) => ({
        usn,
        name: s.name,
        status: todaysSubjectAttendance[usn]?.status || "Present"
      }));

    setAttendanceList(list);
    setIsDirty(false);
  }, [selectedClass, subjectName, students, attendance, todayDate]);

  const handleStatusChange = (usn, status) => {
    setAttendanceList(prev => prev.map(s => (s.usn === usn ? { ...s, status } : s)));
    setIsDirty(true);
  };

  const markAllPresent = () => {
    setAttendanceList(prev => prev.map(s => ({ ...s, status: "Present" })));
    setIsDirty(true);
  };

  const saveAttendance = () => {
    attendance[todayDate] = attendance[todayDate] || {};
    attendance[todayDate][subjectName] = attendance[todayDate][subjectName] || {};
    attendanceList.forEach(s => {
      attendance[todayDate][subjectName][s.usn] = { status: s.status };
    });
    setMessage(`Attendance saved for ${subjectName} (${selectedClass})`);
    setIsDirty(false);
    setTimeout(() => onNavigate("teacher-dashboard"), 1500);
  };

  if (cleanClasses.length === 0) return <p>No classes assigned.</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-link" onClick={() => onNavigate("teacher-dashboard")}>← Back</button>
        <h2 className="subject-details-title">Mark Attendance – {subjectName}</h2>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <img src={classIcon} alt="Class" width="40" className="input-icon"/>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="student-input"
          >
            {/* 2. Map correctly creates 4 options */}
            {cleanClasses.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
          
        </div>

        {message && <div className="notification-banner">{message}</div>}

        {attendanceList.length > 0 ? (
          <>
            <table className="themed-table">
              <thead>
                <tr><th>USN</th><th>Name</th><th>Status</th></tr>
              </thead>
              <tbody>
                {attendanceList.map(s => (
                  <tr key={s.usn}>
                    <td>{s.usn}</td>
                    <td>{s.name}</td>
                    <td>
                      <select
                        value={s.status}
                        onChange={e => handleStatusChange(s.usn, e.target.value)}
                        className={s.status === "Absent" ? "status-absent" : "status-present"}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              className="save-btn"
              onClick={saveAttendance} 
              disabled={!isDirty} 
              style={{ 
                opacity: isDirty ? 1 : 0.6 
              }}
            >
              Save Attendance
            </button>
          </>
        ) : (
          <p>No students found for this class.</p>
        )}
      </div>
    </div>
  );
}