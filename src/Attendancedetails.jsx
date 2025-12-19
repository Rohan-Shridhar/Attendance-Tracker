import React, { useState, useEffect } from "react";
import classIcon from "./assets/class.gif";
import subjectIcon from "./assets/subject.gif";

export default function AttendanceDetails({
  onNavigate = () => {},
  students = {},
  attendance = {},
  subjects = [] // Received from API via App.jsx
}) {
  // 1. Extract unique class names from the students object
  const classList = [...new Set(Object.values(students).map(s => s.class))].sort();
  
  // 2. Extract subject names from the objects array
  const subjectNames = subjects.map(s => typeof s === 'object' ? s.Subject : s);

  const [selectedClass, setSelectedClass] = useState(classList[0] || "");
  const [selectedSubject, setSelectedSubject] = useState(subjectNames[0] || "");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    calculateStats();
  }, [selectedClass, selectedSubject, attendance]);

  const calculateStats = () => {
    if (!selectedClass || !selectedSubject) return;

    // Filter students belonging to the selected class
    const classStudents = Object.entries(students)
      .filter(([_, s]) => s.class === selectedClass)
      .map(([usn, s]) => ({ usn, name: s.name }));

    const result = classStudents.map(student => {
      let total = 0;
      let present = 0;

      // Calculate attendance from the ATTENDANCE_DB structure
      Object.values(attendance).forEach(day => {
        const record = day?.[selectedSubject]?.[student.usn];
        if (record) {
          total++;
          if (record.status === "Present") present++;
        }
      });

      const percent = total ? ((present / total) * 100).toFixed(2) : 0;

      return {
        ...student,
        present,
        absent: total - present,
        total,
        percent: Number(percent),
      };
    });

    const avg =
      result.length > 0
        ? (
            result.reduce((sum, s) => sum + s.percent, 0) / result.length
          ).toFixed(2)
        : 0;

    setStats({
      students: result,
      avg,
      totalClasses: result[0]?.total || 0,
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-link" onClick={() => onNavigate("hod-dashboard")}>
          ← Back
        </button>

        <h2 className="subject-details-title">Attendance Details</h2>

        {/* 3. Dual-end Dropdown Layout */}
        <div className="input-group" style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          gap: "10px" 
        }}>
          {/* Left Side: Class Selection */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <img src={classIcon} className="input-icon" alt="class" />
            <select
              className="student-input"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              style={{ width: "30%" }}
            >
              <option value="" disabled>Select Class</option>
              {classList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Right Side: Subject Selection */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <select
              className="student-input"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              style={{ width: "30%" , marginLeft: "200px" }}
            >
              <option value="" disabled>Select Subject</option>
              {subjectNames.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <img src={subjectIcon} className="input-icon" alt="subject" />
          </div>
        </div>

        {stats && (
          <>
            <div className="attendance-summary-card" style={{ marginTop: "20px" }}>
              <h4>Class Average: {stats.avg}%</h4>
              <p>Total Classes Tracked: {stats.totalClasses}</p>
            </div>

            <table className="themed-table">
              <thead>
                <tr>
                  <th>USN</th>
                  <th>Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {stats.students.map(s => (
                  <tr key={s.usn}>
                    <td>{s.usn}</td>
                    <td>{s.name}</td>
                    <td className="status-present">{s.present}</td>
                    <td className="status-absent">{s.absent}</td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color:
                          s.percent >= 75
                            ? "#2e7d32"
                            : s.percent >= 60
                            ? "#f57c00"
                            : "#c62828",
                      }}
                    >
                      {s.percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}