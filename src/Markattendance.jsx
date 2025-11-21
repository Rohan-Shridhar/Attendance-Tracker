import React, { useState, useEffect } from "react";
import { ATTENDANCE_DB, STUDENTS_DB } from "./database";
import classIcon from './assets/class.gif';

const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getStudentList = (filterClass = 'All') => {
    const allStudents = Object.entries(STUDENTS_DB).map(([usn, data]) => ({
        usn,
        name: data.name,
        class: data.class,
    }));

    if (filterClass === 'All') {
        return allStudents;
    }
    return allStudents.filter(student => student.class === filterClass);
};

export default function MarkAttendance({ onNavigate, subjectName }) {
    const [attendanceList, setAttendanceList] = useState([]);
    const [message, setMessage] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const availableClasses = [...new Set(Object.values(STUDENTS_DB).map(s => s.class))].sort();
    const [selectedClass, setSelectedClass] = useState(availableClasses[0] || '');
    const todayDate = getTodayDateString();

    useEffect(() => {
        const dateKey = todayDate;
        const existingAttendance = ATTENDANCE_DB[dateKey]?.[subjectName] || {};

        const initialList = getStudentList(selectedClass).map(student => {
            const record = existingAttendance[student.usn];
            return {
                ...student,
                status: record?.status || 'N/A'
            };
        });

        setAttendanceList(initialList);
        setIsDirty(false); // Reset dirty state on load

    }, [subjectName, todayDate, selectedClass]);

    const handleStatusChange = (usn, newStatus) => {
        setAttendanceList(prevList =>
            prevList.map(student =>
                student.usn === usn ? { ...student, status: newStatus } : student
            )
        );
        setIsDirty(true); // Mark form as dirty
    };

    const handleMarkAllPresent = () => {
        const updatedList = attendanceList.map(student => ({
            ...student,
            status: 'Present'
        }));
        setAttendanceList(updatedList);
        setIsDirty(true); // Enable the save button
    };

    const handleSaveAttendance = () => {
        const dateKey = todayDate;

        if (!ATTENDANCE_DB[dateKey]) {
            ATTENDANCE_DB[dateKey] = {};
        }

        if (!ATTENDANCE_DB[dateKey][subjectName]) {
            ATTENDANCE_DB[dateKey][subjectName] = {};
        }

        attendanceList.forEach(student => {
            ATTENDANCE_DB[dateKey][subjectName][student.usn] = {
                status: student.status,
                updatedBy: 'Teacher'
            };
        });

        setMessage(`Attendance for ${subjectName} on ${dateKey} saved successfully!`);
        setIsDirty(false); // Reset dirty state after saving
        setTimeout(() => onNavigate('teacher-dashboard'), 3000); // Wait for notification to fade
    };

    const renderTable = (list) => (
        <table className="themed-table">
            <thead>
                <tr>
                    <th>USN</th>
                    <th>Student Name</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {list.map((student) => (
                    <tr key={student.usn}>
                        <td>{student.usn}</td>
                        <td>{student.name}</td>
                        <td>
                            <select
                                value={student.status}
                                onChange={(e) => handleStatusChange(student.usn, e.target.value)}
                                className={`status-select ${student.status === 'Absent' ? 'status-absent' : 'status-present'}`}
                            >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="N/A" disabled>N/A</option>
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
                <button className="back-link" onClick={() => onNavigate("teacher-dashboard")} title="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h2 className="subject-details-title">Mark Attendance: {subjectName} ({todayDate})</h2>

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

                    <button
                        className="subject-btn"
                        onClick={handleMarkAllPresent}
                        style={{ marginLeft: 'auto' }}
                    >
                        Mark All Present
                    </button>
                </div>

                {message && <div className="notification-banner">{message}</div>}

                {attendanceList.length > 0 ? (
                    <>
                        <div className="attendance-tables-wrapper">
                            <div className="attendance-table-column">
                                {renderTable(attendanceList)}
                            </div>
                        </div>

                        <button
                            className="subject-btn"
                            onClick={handleSaveAttendance}
                            disabled={!isDirty}
                            style={{ 
                                marginTop: '20px', 
                                padding: '10px 20px', 
                                background: '#4CAF50', 
                                color: 'white', 
                                border: 'none',
                                opacity: !isDirty ? 0.6 : 1
                            }}
                        >
                            Save Attendance
                        </button>
                    </>
                ) : (
                    <p>No students found.</p>
                )}
            </div>
        </div>
    );
}