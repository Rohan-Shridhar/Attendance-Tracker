import React, { useEffect, useState } from "react";
import subjectIcon from "./assets/subject.gif";

export default function ManageFaculty({ onNavigate, teachers: teachersFromApp, students, subjects }) {
  const [teachers, setTeachers] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" }); 
  const [dirty, setDirty] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");

  const ALL_POSSIBLE_CLASSES = [...new Set(Object.values(students || {}).map(s => s.class))].sort();

  useEffect(() => {
    const formatted = Object.values(teachersFromApp || {}).map(t => {
      const currentClasses = Array.isArray(t.classes) ? t.classes : [];
      const slots = [...currentClasses, "", "", "", ""].slice(0, 4);
      return { ...t, assignedClasses: slots };
    });
    setTeachers(formatted);
  }, [teachersFromApp]);

  const uniqueSubjectNames = ["All", ...new Set((subjects || []).map(s => s.Subject))];

  const filteredTeachers = selectedSubject === "All"
    ? teachers
    : teachers.filter(t => t.subject === selectedSubject);

  // Helper to show notifications and clear them
  const showNotif = (msg, type) => {
    setNotification({ message: msg, type: type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  const handleClassChange = (email, index, newValue) => {
    // 1. Validation for Duplicate Classes
    if (newValue !== "") {
      const isDuplicate = filteredTeachers.some(t => 
        t.assignedClasses.some(cls => cls === newValue)
      );

      if (isDuplicate) {
        showNotif("No two teachers will have same class", "error");
        return; 
      }
    }

    setTeachers(prev =>
      prev.map(t => {
        if (t.email === email) {
          const newSlots = [...t.assignedClasses];
          newSlots[index] = newValue;
          return { ...t, assignedClasses: newSlots };
        }
        return t;
      })
    );
    setDirty(true);
  };

  const saveChanges = async () => {
    // 2. Validation for None/Empty selections
    const hasEmptySlot = filteredTeachers.some(t => 
      t.assignedClasses.some(cls => cls === "")
    );

    if (hasEmptySlot) {
      showNotif("All classes should be assigned", "error");
      return;
    }

    try {
      const requests = teachers.map(t => 
        fetch(`/api/teachers/${t.email}/classes`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classes: t.assignedClasses.filter(c => c !== "") }),
        })
      );

      await Promise.all(requests);
      showNotif("All changes saved successfully!", "success");
      setDirty(false);
    } catch (err) {
      showNotif("Error saving changes.", "error");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="back-link" onClick={() => onNavigate("hod-dashboard")}>← Back</button>
        <h2 className="subject-details-title">Manage Faculty Classes</h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <img src={subjectIcon} className="input-icon" alt="subject" />
          <select 
            value={selectedSubject} 
            onChange={e => setSelectedSubject(e.target.value)}
            className="student-input"
            style={{ marginBottom: "20px" }}
          >
            {uniqueSubjectNames.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Dynamic Notification Banner */}
        {notification.message && (
          <div 
            className="notification-banner" 
            style={{ 
              backgroundColor: notification.type === "error" ? "#d32f2f" : "#2e7d32", 
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              textAlign: "center",
              fontWeight: "bold",
              transition: "all 0.3s ease"
            }}
          >
            {notification.message}
          </div>
        )}

        <table className="themed-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Class 1</th>
              <th>Class 2</th>
              <th>Class 3</th>
              <th>Class 4</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map(t => (
              <tr key={t.email}>
                <td>{t.name}</td>
                <td>{t.subject}</td>
                {[0, 1, 2, 3].map(index => (
                  <td key={index}>
                    <select
                      value={t.assignedClasses[index]}
                      onChange={(e) => handleClassChange(t.email, index, e.target.value)}
                      className="status-select"
                    >
                      <option value="">None</option>
                      {ALL_POSSIBLE_CLASSES.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button 
          className="save-btn" 
          disabled={!dirty} 
          onClick={saveChanges} 
          style={{ marginTop: 20 }}
        >
          Update Database Entries
        </button>
      </div>
    </div>
  );
}