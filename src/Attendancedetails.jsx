import React, { useState, useEffect } from 'react';
import { ATTENDANCE_DB, STUDENTS_DB, SUBJECTS } from './database';
import classIcon from './assets/class.gif';
import subjectIcon from './assets/subject.gif';

export default function AttendanceDetails({ onNavigate = () => {} }) {
  const availableClasses = [...new Set(Object.values(STUDENTS_DB).map(s => s.class))].sort();
  const [selectedClass, setSelectedClass] = useState(availableClasses[0] || '');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]?.name || '');
  const [attendanceStats, setAttendanceStats] = useState(null);

  useEffect(() => {
    calculateAttendance();
  }, [selectedClass, selectedSubject]);

  const calculateAttendance = () => {
    if (!selectedClass || !selectedSubject) return;

    // Get all students in the selected class
    const studentsInClass = Object.entries(STUDENTS_DB)
      .filter(([usn, data]) => data.class === selectedClass)
      .map(([usn, data]) => ({ usn, name: data.name }));

    if (studentsInClass.length === 0) {
      setAttendanceStats(null);
      return;
    }

    // Calculate attendance for each student
    const studentStats = studentsInClass.map(student => {
      let totalClasses = 0;
      let presentCount = 0;

      // Loop through all dates in ATTENDANCE_DB
      Object.entries(ATTENDANCE_DB).forEach(([date, subjects]) => {
        if (subjects[selectedSubject] && subjects[selectedSubject][student.usn]) {
          totalClasses++;
          if (subjects[selectedSubject][student.usn].status === 'Present') {
            presentCount++;
          }
        }
      });

      const percentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

      return {
        usn: student.usn,
        name: student.name,
        totalClasses,
        presentCount,
        absentCount: totalClasses - presentCount,
        percentage: parseFloat(percentage)
      };
    });

    // Calculate overall class statistics
    const totalStudents = studentStats.length;
    const avgPercentage = totalStudents > 0
      ? (studentStats.reduce((sum, s) => sum + s.percentage, 0) / totalStudents).toFixed(2)
      : 0;
    
    // Get total classes (should be same for all students in a class-subject combination)
    const totalClasses = studentStats.length > 0 ? studentStats[0].totalClasses : 0;

    setAttendanceStats({
      students: studentStats,
      totalStudents,
      totalClasses,
      avgPercentage: parseFloat(avgPercentage)
    });
  };

  const renderAttendanceTable = () => {
    if (!attendanceStats || attendanceStats.students.length === 0) {
      return <p style={{ textAlign: 'center', padding: '20px' }}>No attendance data available for this class and subject.</p>;
    }

    return (
      <>
        <div className="attendance-summary-card">
          <h4>Class Summary</h4>
          <div className="summary-content">
            <div className="percentage-display">
              <div className="percentage-text">
                <div className="present">{attendanceStats.avgPercentage}%</div>
              </div>
            </div>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-value" style={{ color: 'var(--text)' }}>{attendanceStats.totalStudents}</div>
                <div className="stat-label" style={{ color: 'var(--text)' }}>Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" style={{ color: 'var(--text)' }}>{attendanceStats.totalClasses}</div>
                <div className="stat-label" style={{ color: 'var(--text)' }}>Classes</div>
              </div>
            </div>
          </div>
        </div>

        <table className="themed-table">
          <thead>
            <tr>
              <th>USN</th>
              <th>Student Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {attendanceStats.students.map((student) => (
              <tr key={student.usn}>
                <td>{student.usn}</td>
                <td>{student.name}</td>
                <td className="status-present">{student.presentCount}</td>
                <td className="status-absent">{student.absentCount}</td>
                <td>
                  <span style={{
                    fontWeight: 'bold',
                    color: student.percentage >= 75 ? '#2e7d32' : student.percentage >= 60 ? '#f57c00' : '#c62828'
                  }}>
                    {student.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-link" onClick={() => onNavigate('hod-dashboard')} title="Back to Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        
        <h2 className="subject-details-title">Attendance Details</h2>

        <div className="input-group" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <img src={classIcon} alt="Select Class" className="input-icon" />
          <select
            id="class-selector"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="student-input"
            style={{ maxWidth: '180px', flexGrow: 0 }}
          >
            {availableClasses.map(c => <option key={c} value={c}>{`Class ${c}`}</option>)}
          </select>

          <select
            id="subject-selector"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="student-input"
            style={{ maxWidth: '180px', flexGrow: 0, marginLeft: 'auto' }}
          >
            {SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <img src={subjectIcon} alt="Select Subject" className="input-icon" />
        </div>

        <div className="scrollable-content">
          {renderAttendanceTable()}
        </div>
      </div>
    </div>
  );
}