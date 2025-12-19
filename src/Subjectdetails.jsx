import React from "react";

export default function Subjectdetails({ usn, subjectName, attendance }) {
  if (!attendance) {
    return <p>Attendance data not available.</p>;
  }

  const records = [];

  // 🔁 attendance comes from backend now
  for (const date in attendance) {
    const dayData = attendance[date];
    if (dayData[subjectName] && dayData[subjectName][usn]) {
      records.push({
        date,
        status: dayData[subjectName][usn].status,
      });
    }
  }

  const total = records.length;
  const present = records.filter(r => r.status === "Present").length;
  const absent = total - present;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <>
      <h3 className="subject-details-title">{subjectName} Attendance</h3>

      {total > 0 && (
        <div className="attendance-summary-card">
          <h4>Overall Attendance</h4>

          <div className="summary-content">
            <div className="percentage-display">
              <div className="percentage-text">
                <span className="present">{percentage}%</span>
                <span className="label">Attendance</span>
              </div>

              <div
                className="pie-chart-placeholder"
                style={{
                  background: `conic-gradient(
                    #2e7d32 0% ${percentage}%,
                    #c62828 ${percentage}% 100%
                  )`,
                }}
              />
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{present}</span>
                <span className="stat-label present">Present</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{absent}</span>
                <span className="stat-label absent">Absent</span>
              </div>
              <div className="stat-item total">
                <span className="stat-value">{total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {records.length > 0 ? (
        <table className="themed-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td className={r.status === "Absent" ? "status-absent" : "status-present"}>
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records available.</p>
      )}
    </>
  );
}
