import React, { useState } from 'react';
import Header from './Header.jsx';
import LoginPage from './LoginPage.jsx';
import Studentlogin from './Studentlogin.jsx';
import Teacherlogin from './Teacherlogin.jsx';
import Studentprofile from './Studentprofile.jsx';
import Teacherprofile from './Teacherprofile.jsx'; 
import PreviousAttendance from './Previousattendance.jsx'; 

function App() {
    const [route, setRoute] = useState('home');
    const [studentUsn, setStudentUsn] = useState(null);
    const [teacherEmail, setTeacherEmail] = useState(null); 
    const [teacherSubject, setTeacherSubject] = useState(null); 

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
        } 
        // NEW ROUTE: Mark Attendance
        else if (to.startsWith('mark-attendance:')) {
            const subject = to.split(':')[1];
            setTeacherSubject(subject);
            setRoute('mark-attendance');
        }
        else if (to.startsWith('previous-attendance:')) {
            const subject = to.split(':')[1];
            setTeacherSubject(subject);
            setRoute('previous-attendance');
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
            {route === 'student-profile' && <Studentprofile onNavigate={navigate} usn={studentUsn} />}
            {route === 'teacher-dashboard' && <Teacherprofile onNavigate={navigate} teacherEmail={teacherEmail} />}
            {route === 'mark-attendance' && <MarkAttendance onNavigate={navigate} subjectName={teacherSubject} />}
            {route === 'previous-attendance' && <PreviousAttendance onNavigate={navigate}  subjectName={teacherSubject} />}
        </>
    );
}
export default App;