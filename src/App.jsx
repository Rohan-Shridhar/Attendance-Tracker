import React, { useState } from 'react';
import Header from './Header.jsx';
import LoginPage from './LoginPage.jsx';
import Studentlogin from './Studentlogin.jsx';
import Teacherlogin from './Teacherlogin.jsx';
import Hodlogin from './Hodlogin.jsx';
import Studentprofile from './Studentprofile.jsx';
import Teacherprofile from './Teacherprofile.jsx';
import Hodprofile from './Hodprofile.jsx';
import ManageFaculty from './Managefaculty.jsx';
import AttendanceDetails from './Attendancedetails.jsx';
import PreviousAttendance from './Previousattendance.jsx';
import MarkAttendance from './Markattendance.jsx';

function App() {
    const [route, setRoute] = useState('home');
    const [studentUsn, setStudentUsn] = useState(null);
    const [teacherEmail, setTeacherEmail] = useState(null);
    const [teacherSubject, setTeacherSubject] = useState(null);
    const [hodEmail, setHodEmail] = useState(null);

    const navigate = (to) => {
        if (to.startsWith('student-profile:')) {
            const usn = to.split(':')[1]; 
            setStudentUsn(usn);
            setRoute('student-profile');
        } 
        else if (to.startsWith('teacher-dashboard:')) {
            const parts = to.split(':');
            const email = parts[1]; 
            const subject = parts[2]; 
            setTeacherEmail(email);
            setTeacherSubject(subject);
            setRoute('teacher-dashboard'); 
        } else if (to.startsWith('mark-attendance:')) {
            const subject = to.split(':')[1];
            setTeacherSubject(subject);
            setRoute('mark-attendance');
        }
        else if (to.startsWith('previous-attendance:')) {
            const subject = to.split(':')[1];
            setTeacherSubject(subject);
            setRoute('previous-attendance');
        }
        else if (to.startsWith('hod-dashboard:')) {
            const email = to.split(':')[1];
            setHodEmail(email);
            setRoute('hod-dashboard');
        }
        else {
            setRoute(to);
        }
    };

    return (
        <>
            <Header />
            {route === 'home' && <LoginPage onNavigate={navigate} />}
            {route === 'student' && <Studentlogin onNavigate={navigate} />}
            {route === 'teacher' && <Teacherlogin onNavigate={navigate} />}
            {route === 'hod' && <Hodlogin onNavigate={navigate} />}
            {route === 'student-profile' && <Studentprofile onNavigate={navigate} usn={studentUsn} />}
            {route === 'teacher-dashboard' && <Teacherprofile onNavigate={navigate} teacherEmail={teacherEmail} />}
            {route === 'hod-dashboard' && <Hodprofile onNavigate={navigate} hodEmail={hodEmail} />}
            {route === 'manage-faculty' && <ManageFaculty onNavigate={navigate} view="main" />}
            {route === 'attendance-details' && <AttendanceDetails onNavigate={navigate} />}
            {route === 'mark-attendance' && <MarkAttendance onNavigate={navigate} subjectName={teacherSubject} teacherEmail={teacherEmail} />}
            {route === 'previous-attendance' && <PreviousAttendance onNavigate={navigate} subjectName={teacherSubject} teacherEmail={teacherEmail} />}
        </>
    );
}
export default App;