import React, { useState, useEffect } from "react";
import calendarIcon from "./assets/calender.gif";
import classIcon from "./assets/class.gif";

export default function PreviousAttendance({
  onNavigate,
  subjectName,
  teacherEmail,
  students = {},
  teachers = {},
  attendance = {}
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [message, setMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  /* ======================
     TEACHER CLASSES
  ====================== */
  const teacherData = teachers[teacherEmail] || { classes: [] };
  const teacherClasses = teacherData.classes || [];

  /* ======================
     AVAILABLE CLASSES
  ====================== */
  const availableClasses =
    Array.isArray(teacherClasses) 
    ? teacherClasses.flatMap(cls => typeof cls === 'string' ? cls.split(",") : cls).map(s => s.trim())
    : (typeof teacherClasses === "string" ? teacherClasses.split(",").map(s => s.trim()) : []);

  /* ======================
     DEFAULT DATE (LAST WORKING DAY)
  ====================== */
  useEffect(() => {
    let d = new Date();
    do {
      d.setDate(d.getDate() - 1);
    } while (d.getDay() === 0 || d.getDay() === 6);

    setSelectedDate(d.toISOString().split("T")[0]);
    setSelectedClass(availableClasses[0] || "");
  }, []);

  /* ======================
     LOAD ATTENDANCE
  ====================== */
  useEffect(() => {
    if (!selectedDate || !selectedClass) return;

    const subjectData = attendance[selectedDate]?.[subjectName] || {};

    const list = Object.entries(students)
      .filter(([_, s]) => s.class === selectedClass)
      .map(([usn, s]) => ({
        usn,
        name: s.name,
        class: s.class,
        status: subjectData[usn]?.status || "N/A"
      }));

    setAttendanceList(list);
    setIsDirty(false);
  }, [selectedDate, selectedClass, subjectName, attendance, students]);

  /* ======================
     UPDATE STATUS
  ====================== */
  const handleStatusChange = (usn, status) => {
    setAttendanceList(prev =>
      prev.map(s => (s.usn === usn ? { ...s, status } : s))
    );
    setIsDirty(true);
  };

  /* ======================
     SAVE CHANGES (LOCAL)
     (Backend write later)
  ====================== */
  const handleSave = () => {
    if (!isDirty) return;

    setMessage(
      `Attendance updated for ${subjectName} on ${selectedDate}`
    );
    setIsDirty(false);
  };

  /* ======================
     RENDER TABLE
  ====================== */
  const renderTable = list => (
    <table className="themed-table">
      <thead>
        <tr>
          <th>USN</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map(s => (
          <tr key={s.usn}>
            <td>{s.usn}</td>
            <td>{s.name}</td>
            <td>
              <select
                value={s.status}
                onChange={e =>
                  handleStatusChange(s.usn, e.target.value)
                }
                className={`status-select ${
                  s.status === "Absent"
                    ? "status-absent"
                    : "status-present"
                }`}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="N/A">N/A</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button
          className="back-link"
          onClick={() => onNavigate("teacher-dashboard")}
        >
          ← Back
        </button>

        <h2 className="subject-details-title">
          Previous Attendance – {subjectName}
        </h2>

        {/* Filters */}
        <div
          className="input-group"
          style={{ display: "flex", gap: "12px", marginBottom: "20px" }}
        >
          <img src={classIcon} className="input-icon" />
          <select
            className="student-input"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            {availableClasses.map(c => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="student-input"
            value={selectedDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={e => setSelectedDate(e.target.value)}
            style={{marginLeft:"440px"}}
          />
          <img src={calendarIcon} className="input-icon" />
        </div>

        {message && <div className="notification-banner">{message}</div>}

        {attendanceList.length > 0 ? (
          <>
            {renderTable(attendanceList)}

            <button
              className="subject-btn"
              onClick={handleSave}
              disabled={!isDirty}
              style={{
                marginTop: "20px",
                background: "#4CAF50",
                color: "white",
                opacity: !isDirty ? 0.6 : 1
              }}
            >
              Save Changes
            </button>
          </>
        ) : (
          <p>No attendance records found.</p>
        )}
      </div>
    </div>
  );
}
