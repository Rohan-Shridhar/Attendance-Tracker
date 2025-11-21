import React from "react";
import { ATTENDANCE_DB } from "./database";

export default function Subjectdetails({ usn, subjectName }) {
  const attendanceData = [];
 
  for (const date in ATTENDANCE_DB) {
    const subjects = ATTENDANCE_DB[date];
    if (subjects[subjectName] && subjects[subjectName][usn]) {
      attendanceData.push({
        date,
        status: subjects[subjectName][usn].status, 
      });
    }
  }

  const presentCount = attendanceData.filter(r => r.status === 'Present').length;
  const absentCount = attendanceData.filter(r => r.status === 'Absent').length;
  const totalClasses = attendanceData.length;
  const presentPercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  return (
    <>
      <h3 className="subject-details-title">{subjectName} Attendance</h3>

      {totalClasses > 0 && (
        <div className="attendance-summary-card">
          <h4>Overall Attendance Summary</h4>
          <div className="summary-content">
            <div className="percentage-display">
              <div className="percentage-text">
                <span className="present">{presentPercentage}%</span>
                <span className="label">Attendance</span>
              </div>
              
              <div 
                className="pie-chart-placeholder" 
                style={{ 
                  background: `conic-gradient(#2e7d32 0% ${presentPercentage}%, #c62828 ${presentPercentage}% 100%)`
                }}
              />
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{presentCount}</span>
                <span className="stat-label present">Present</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{absentCount}</span>
                <span className="stat-label absent">Absent</span>
              </div>
              <div className="stat-item total">
                <span className="stat-value">{totalClasses}</span>
                <span className="stat-label">Total Classes</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {attendanceData.length > 0 ? (
        <table className="themed-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td className={record.status === 'Absent' ? 'status-absent' : 'status-present'}>
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records available for this subject.</p>
      )}
    </>
  );
}