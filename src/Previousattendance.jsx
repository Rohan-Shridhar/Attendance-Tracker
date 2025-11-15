// fileName: Previousattendance.jsx (CORRECTED SCRIPT)

import React, { useState, useEffect } from "react";
// Import the necessary data sources
import { ATTENDANCE_DB, STUDENTS_DB } from "./database";

// Utility function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today.getDate()).padStart(2, '0');
    // Database dates appear to be in YYYY-MM-DD format (ISO standard)
    return `${yyyy}-${mm}-${dd}`; 
};

// Function to get the list of students for a class/subject
const getStudentList = () => {
    // For simplicity, loads all students
    return Object.entries(STUDENTS_DB).map(([usn, data]) => ({
        usn,
        name: data.name,
        class: data.class,
        status: 'N/A' 
    }));
};

export default function PreviousAttendance({ onNavigate, subjectName }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [attendanceList, setAttendanceList] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [message, setMessage] = useState('');

    // Set initial date to a sample past working day
    useEffect(() => {
        const today = new Date();
        let prevDay = new Date(today);
        let daysToSubtract = 0;
        while (daysToSubtract < 2) {
            prevDay.setDate(prevDay.getDate() - 1);
            if (prevDay.getDay() !== 0 && prevDay.getDay() !== 6) { // Skip weekends
                daysToSubtract++;
            }
        }
        
        const yyyy = prevDay.getFullYear();
        const mm = String(prevDay.getMonth() + 1).padStart(2, '0');
        const dd = String(prevDay.getDate()).padStart(2, '0');
        
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Load attendance when component mounts or date/subject changes
    useEffect(() => {
        loadAttendance();
    }, [selectedDate, subjectName]); // eslint-disable-line react-hooks/exhaustive-deps


    // Function to load attendance data for the selected date
    const loadAttendance = () => {
        if (!selectedDate || !subjectName) {
            setMessage('Date or subject not available.');
            setAttendanceList([]);
            setIsDataLoaded(false);
            return;
        }

        const dateKey = selectedDate; 

        // Check if attendance exists for the date and subject
        const subjectAttendance = ATTENDANCE_DB[dateKey]?.[subjectName] || {};
        
        const initialList = getStudentList().map(student => {
            const record = subjectAttendance[student.usn];
            return {
                ...student,
                // Status is 'Present', 'Absent', or 'N/A' if no record exists
                status: record?.status || 'N/A' 
            };
        });

        setAttendanceList(initialList);
        setIsDataLoaded(true);
        setMessage(initialList.length === 0 ? 'No students found for this subject.' : '');
    };

    // Handler for changing a student's status
    const handleStatusChange = (usn, newStatus) => {
        setAttendanceList(prevList => 
            prevList.map(student => 
                student.usn === usn ? { ...student, status: newStatus } : student
            )
        );
    };

    // Handler for saving changes (simulates a database update)
    const handleSaveChanges = () => {
        const changes = attendanceList.filter(student => student.status !== 'N/A');
        
        if (changes.length === 0) {
            setMessage('No attendance records to save.');
            return;
        }

        // --- SIMULATED DATABASE UPDATE ---
        
        if (!ATTENDANCE_DB[selectedDate]) {
             ATTENDANCE_DB[selectedDate] = {};
        }
        
        if (!ATTENDANCE_DB[selectedDate][subjectName]) {
             ATTENDANCE_DB[selectedDate][subjectName] = {};
        }
        
        changes.forEach(student => {
            ATTENDANCE_DB[selectedDate][subjectName][student.usn] = {
                status: student.status,
                updatedBy: 'Teacher' 
            };
        });

        setMessage(`Attendance for ${subjectName} on ${selectedDate} saved successfully!`);
        setTimeout(() => setMessage(''), 3000); 
    };

    // Helper function to render a table block (to avoid repetition)
    const renderTable = (list, handleStatusChange) => (
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
                                <option value="N/A" disabled={student.status !== 'N/A'}>N/A (No Record)</option>
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
                <button className="back-link" onClick={() => onNavigate("teacher-dashboard")}>
                    ← Back to Dashboard
                </button>
                <h2 className="subject-details-title">Review & Edit Attendance: {subjectName}</h2>

                <div className="input-group" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                    <label htmlFor="date-picker">Select Date:</label>
                    <input
                        id="date-picker"
                        className="student-input" 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ maxWidth: '180px', flexGrow: 0 }}
                    />
                </div>

                {message && <div style={{ color: message.includes('saved') ? '#2e7d32' : 'var(--accent)', marginBottom: '15px', fontWeight: 'bold' }}>{message}</div>}

                {isDataLoaded && attendanceList.length > 0 && (
                    <>
                        {/* Split the list into two halves and render two tables side-by-side */}
                        {(() => {
                            const midpoint = Math.ceil(attendanceList.length / 2);
                            const list1 = attendanceList.slice(0, midpoint);
                            const list2 = attendanceList.slice(midpoint);

                            return (
                                <div className="attendance-tables-wrapper">
                                    {/* Table 1: First Half */}
                                    <div className="attendance-table-column">
                                        {renderTable(list1, handleStatusChange)}
                                    </div>

                                    {/* Table 2: Second Half (only render if there's a second half) */}
                                    {list2.length > 0 && (
                                        <div className="attendance-table-column">
                                            {renderTable(list2, handleStatusChange)}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                        
                        <button 
                            className="subject-btn" 
                            onClick={handleSaveChanges}
                            style={{ marginTop: '20px', padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' }}
                        >
                            Save Changes
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}