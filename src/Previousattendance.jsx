
import React, { useState, useEffect } from "react";
import { ATTENDANCE_DB, STUDENTS_DB } from "./database";
import calendarIcon from './assets/calender.gif';
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
        status: 'N/A' 
    }));

    if (filterClass === 'All') {
        return allStudents;
    }
    return allStudents.filter(student => student.class === filterClass);
};

export default function PreviousAttendance({ onNavigate, subjectName }) {
    const [selectedDate, setSelectedDate] = useState('');
    const availableClasses = [...new Set(Object.values(STUDENTS_DB).map(s => s.class))].sort();
    const [selectedClass, setSelectedClass] = useState(availableClasses[0] || '');
    const [attendanceList, setAttendanceList] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const today = new Date();
        let prevDay = new Date(today);
        let daysToSubtract = 0;
        while (daysToSubtract < 2) {
            prevDay.setDate(prevDay.getDate() - 1);
            if (prevDay.getDay() !== 0 && prevDay.getDay() !== 6) { 
                daysToSubtract++;
            }
        }
        
        const yyyy = prevDay.getFullYear();
        const mm = String(prevDay.getMonth() + 1).padStart(2, '0');
        const dd = String(prevDay.getDate()).padStart(2, '0');
        
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }, []); 

    useEffect(() => {
        loadAttendance();
    }, [selectedDate, subjectName, selectedClass]); 


    const loadAttendance = () => {
        if (!selectedDate || !subjectName) {
            setMessage('Date or subject not available.');
            setAttendanceList([]);
            setIsDataLoaded(false);
            return;
        }

        const dateKey = selectedDate; 

        const subjectAttendance = ATTENDANCE_DB[dateKey]?.[subjectName] || {};
        
        const initialList = getStudentList(selectedClass).map(student => {
            const record = subjectAttendance[student.usn];
            return {
                ...student,
                status: record?.status || 'N/A' 
            };
        });

        setAttendanceList(initialList);
        setIsDataLoaded(true);
        setIsDirty(false); // Reset dirty state on load
        setMessage(initialList.length === 0 ? 'No students found for this subject.' : '');
    };

    const handleStatusChange = (usn, newStatus) => {
        setAttendanceList(prevList => 
            prevList.map(student => 
                student.usn === usn ? { ...student, status: newStatus } : student
            )
        );
        setIsDirty(true); // Mark form as dirty
    };

    const handleSaveChanges = () => {
        const changes = attendanceList.filter(student => student.status !== 'N/A');
        
        if (changes.length === 0) {
            setMessage('No attendance records to save.');
            return;
        }

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
        setIsDirty(false); // Reset dirty state after saving
        setTimeout(() => setMessage(''), 3000); // Clear message after animation
    };

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
                <button className="back-link" onClick={() => onNavigate("teacher-dashboard")} title="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h2 className="subject-details-title">Review & Edit Attendance: {subjectName}</h2>

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

                    <input
                        id="date-picker"
                        className="student-input" 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ maxWidth: '180px', flexGrow: 0, marginLeft: 'auto' }}
                    />
                    <img src={calendarIcon} alt="Select Date" className="input-icon" />
                </div>

                {message && <div className="notification-banner">{message}</div>}

                {isDataLoaded && attendanceList.length > 0 && (
                    <>
                        {/* Split the list into two halves and render two tables side-by-side */}
                        {(() => {
                            const midpoint = Math.ceil(attendanceList.length / 2);
                            const list1 = attendanceList.slice(0, midpoint);
                            const list2 = attendanceList.slice(midpoint);

                            return (
                                <div className="attendance-tables-wrapper">
                                    <div className="attendance-table-column">
                                        {renderTable(list1, handleStatusChange)}
                                    </div>

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
                            Save Changes
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}