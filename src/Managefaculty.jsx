import React, { useState } from 'react';
import { TEACHERS_DB } from './database';

export default function ManageFaculty({ onNavigate = () => {}, view = 'main' }) {
  // Convert TEACHERS_DB object to array for easier rendering
  const teachersList = Object.entries(TEACHERS_DB).map(([email, data]) => ({
    email,
    name: data.name,
    subject: data.subject,
    classes: data.classes || [],
  }));

  const renderTable = (teachers) => (
    <table className="themed-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Subject</th>
          <th>Classes</th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher.email}>
            <td>{teacher.name}</td>
            <td>{teacher.email}</td>
            <td>{teacher.subject}</td>
            <td>{teacher.classes.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Faculty list view with class reassignment (no intermediate step)
  if (view === 'main') {
    const [teacherAssignments, setTeacherAssignments] = useState(() => {
      return teachersList.map(teacher => ({
        ...teacher,
        assignedClasses: [...teacher.classes]
      }));
    });
    const [isDirty, setIsDirty] = useState(false);
    const [message, setMessage] = useState('');

    const availableClasses = ['3S', '3T', '3U', '3V'];

    const handleClassToggle = (teacherEmail, className) => {
      setTeacherAssignments(prev => {
        const updated = prev.map(teacher => {
          if (teacher.email === teacherEmail) {
            const currentClasses = teacher.assignedClasses;
            const newClasses = currentClasses.includes(className)
              ? currentClasses.filter(c => c !== className)
              : [...currentClasses, className].sort();
            
            return { ...teacher, assignedClasses: newClasses };
          }
          return teacher;
        });
        return updated;
      });
      setIsDirty(true);
    };

    const handleSave = () => {
      // Validation 1: Check if each teacher has exactly 2 classes
      const invalidTeachers = teacherAssignments.filter(
        teacher => teacher.assignedClasses.length !== 2
      );

      if (invalidTeachers.length > 0) {
        setMessage('Error: Each teacher must have exactly 2 classes');
        setTimeout(() => setMessage(''), 5000);
        return;
      }

      // Validation 2: Check if two teachers of the same subject have overlapping classes
      const subjectGroups = {};
      teacherAssignments.forEach(teacher => {
        if (!subjectGroups[teacher.subject]) {
          subjectGroups[teacher.subject] = [];
        }
        subjectGroups[teacher.subject].push(teacher);
      });

      for (const [subject, teachers] of Object.entries(subjectGroups)) {
        if (teachers.length === 2) {
          const [teacher1, teacher2] = teachers;
          const overlap = teacher1.assignedClasses.filter(cls => 
            teacher2.assignedClasses.includes(cls)
          );
          
          if (overlap.length > 0) {
            setMessage('Error: Two teachers of the same subject cannot have the same class');
            setTimeout(() => setMessage(''), 5000);
            return;
          }
        }
      }

      // If all validations pass, save the assignments
      teacherAssignments.forEach(teacher => {
        if (TEACHERS_DB[teacher.email]) {
          TEACHERS_DB[teacher.email].classes = [...teacher.assignedClasses];
        }
      });

      setMessage('Class assignments saved successfully!');
      setIsDirty(false);
      setTimeout(() => {
        setMessage('');
        onNavigate('hod-dashboard');
      }, 2000);
    };

    const renderAssignmentTable = () => (
      <table className="themed-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Assigned Classes</th>
          </tr>
        </thead>
        <tbody>
          {teacherAssignments.map((teacher) => (
            <tr key={teacher.email}>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.subject}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {availableClasses.map(className => (
                    <label 
                      key={className}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: teacher.assignedClasses.includes(className) 
                          ? 'var(--accent)' 
                          : 'var(--tile)',
                        color: teacher.assignedClasses.includes(className) 
                          ? 'var(--bg)' 
                          : 'var(--text)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={teacher.assignedClasses.includes(className)}
                        onChange={() => handleClassToggle(teacher.email, className)}
                        style={{ cursor: 'pointer' }}
                      />
                      {className}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div className="profile-container">
        <div className="profile-card">
          <button className="back-link" onClick={() => onNavigate('hod-dashboard')} title="Back to Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="subject-details-title">Reassign Classes to Faculty ({teachersList.length})</h2>
          {message && (
            <div 
              className="notification-banner" 
              style={{ 
                backgroundColor: message.startsWith('Error') ? '#f44336' : '#4CAF50'
              }}
            >
              {message}
            </div>
          )}

          <div className="scrollable-content">
            {renderAssignmentTable()}
            
            <button 
              className="subject-btn" 
              onClick={handleSave}
              disabled={!isDirty}
              style={{ 
                marginTop: '20px', 
                padding: '12px 24px', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none',
                opacity: !isDirty ? 0.6 : 1,
                cursor: !isDirty ? 'not-allowed' : 'pointer',
                width: '100%',
                fontSize: '16px'
              }}
            >
              Save Class Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }
}