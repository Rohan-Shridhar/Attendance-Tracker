import React, { useState, useEffect } from 'react';

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
import MarkAttendance from './Markattendance.jsx';
import PreviousAttendance from './Previousattendance.jsx';

function App() {
  /* ======================
     ROUTING STATE
  ====================== */
  const [route, setRoute] = useState('home');

  /* ======================
     AUTH / CONTEXT STATE
  ====================== */
  const [studentUsn, setStudentUsn] = useState(null);
  const [teacherEmail, setTeacherEmail] = useState(null);
  const [teacherSubject, setTeacherSubject] = useState(null);
  const [hodEmail, setHodEmail] = useState(null);

  /* ======================
     DATABASE STATE
  ====================== */
  const [dbData, setDbData] = useState(null);
  const [attendance, setAttendance] = useState(null);

/* ======================
   FETCH MASTER DATA
====================== */
useEffect(() => {
  Promise.all([
    fetch("/api/students").then(r => r.json()),
    fetch("/api/teachers").then(r => r.json()),
    fetch("/api/attendance").then(r => r.json()),
    fetch("/api/subjects").then(r => r.json()), 
  ])
    .then(([students, teachers, attendance, subjects]) => {
      setDbData({
        STUDENTS_DB: students,
        TEACHERS_DB: Object.fromEntries(
          teachers.map(t => [t.email, t])
        ),
        SUBJECTS_LIST: subjects, // ✅ Store subjects array in state
      });
      setAttendance(attendance);
    })
    .catch(err => {
      console.error("❌ Failed to load DB data:", err);
    });
}, []);




  /* ======================
     NAVIGATION HANDLER
  ====================== */
  const navigate = (to) => {
    if (to.startsWith('student-profile:')) {
      setStudentUsn(to.split(':')[1]);
      setRoute('student-profile');
    }

    else if (to.startsWith('teacher-dashboard:')) {
      const [, email, subject] = to.split(':');
      setTeacherEmail(email);
      setTeacherSubject(subject);
      setRoute('teacher-dashboard');
    }

    else if (to.startsWith('mark-attendance:')) {
      setTeacherSubject(to.split(':')[1]);
      setRoute('mark-attendance');
    }

    else if (to.startsWith('previous-attendance:')) {
      setTeacherSubject(to.split(':')[1]);
      setRoute('previous-attendance');
    }

    else if (to.startsWith('hod-dashboard:')) {
      setHodEmail(to.split(':')[1]);
      setRoute('hod-dashboard');
    }

    else {
      setRoute(to);
    }
  };

  /* ======================
     LOADING STATE
  ====================== */
  if (!dbData || !attendance) {
    return <div className="loading">Connecting to database...</div>;
  }

  /* ======================
     RENDER
  ====================== */
  return (
    <>
      <Header />

      {route === 'home' && (
        <LoginPage onNavigate={navigate} />
      )}

      {route === 'student' && (
        <Studentlogin onNavigate={navigate} />
      )}

      {route === 'teacher' && (
        <Teacherlogin onNavigate={navigate} />
      )}

      {route === 'hod' && (
        <Hodlogin onNavigate={navigate} />
      )}

      {route === 'student-profile' && (
        <Studentprofile
          onNavigate={navigate}
          usn={studentUsn}
          students={dbData.STUDENTS_DB}
          attendance={attendance}
          subjects={dbData.SUBJECTS_LIST}
        />
      )}

      {route === 'teacher-dashboard' && (
        <Teacherprofile
          onNavigate={navigate}
          teacherEmail={teacherEmail}
          teachers={dbData.TEACHERS_DB}
        />
      )}

      {route === 'mark-attendance' && (
      <MarkAttendance
        onNavigate={navigate}
        subjectName={teacherSubject}
        teacherEmail={teacherEmail}
        teacherClasses={dbData.TEACHERS_DB[teacherEmail]?.classes || []}
        students={dbData.STUDENTS_DB}
        attendance={attendance}
        />
      )}

      {route === 'previous-attendance' && (
        <PreviousAttendance
          onNavigate={navigate}
          subjectName={teacherSubject}
          teacherEmail={teacherEmail}
          students={dbData.STUDENTS_DB}
          attendance={attendance}
          teachers={dbData.TEACHERS_DB} 
        />
      )}

      {route === 'attendance-details' && (
        <AttendanceDetails
          onNavigate={navigate}
          students={dbData.STUDENTS_DB}
          subjects={dbData.SUBJECTS_LIST}
          attendance={attendance}
        />
      )}

      {route === 'manage-faculty' && (
        <ManageFaculty
          onNavigate={navigate}
          teachers={dbData.TEACHERS_DB}
          students={dbData.STUDENTS_DB}   
          subjects={dbData.SUBJECTS_LIST}  
        />
      )}

      {route === 'hod-dashboard' && (
        <Hodprofile
          onNavigate={navigate}
          hodEmail={hodEmail}
        />
      )}
    </>
  );
}

export default App;
