// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   IN-MEMORY DATABASES (Loaded from CSV)
========================= */
let STUDENTS_DB = {};
let TEACHERS_DB = [];
let SUBJECTS_DB = [];
let ATTENDANCE_DB = {};

// Helper to parse simple CSV (ignores commas in quotes for this basic app case)
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line handling quotes
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);

    const row = {};
    headers.forEach((h, index) => {
      row[h] = values[index] ? values[index].trim() : "";
    });
    data.push(row);
  }
  return data;
}

// Function to read all CSVs and populate the in-memory databases
function loadDatabases() {
  console.log("Loading data from CSV files...");

  // 1. Students
  try {
    const studentsData = parseCSV(path.join(__dirname, "..", "students.csv"));
    STUDENTS_DB = {};
    studentsData.forEach((s) => {
      if (s.USN) {
        STUDENTS_DB[s.USN.toUpperCase()] = {
          usn: s.USN.toUpperCase(),
          name: s.Name,
          class: s.Section,
          gender: s.Gender,
        };
      }
    });
    console.log(`Loaded ${Object.keys(STUDENTS_DB).length} students.`);
  } catch (err) {
    console.error("Error loading students.csv", err.message);
  }

  // 2. Teachers
  try {
    const teachersData = parseCSV(path.join(__dirname, "..", "teachers.csv"));
    TEACHERS_DB = teachersData
      .map((t) => {
        let formattedClasses = [];
        if (t.Classes) {
          // Remove quotes and brackets if present
          let clsStr = t.Classes.replace(/["'\[\]]/g, "");
          formattedClasses = clsStr
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c);
        }
        return {
          Email: t.Email ? t.Email.toLowerCase() : "",
          Name: t.Name,
          Subject: t.Subject,
          Classes: formattedClasses,
        };
      })
      .filter((t) => t.Email);
    console.log(`Loaded ${TEACHERS_DB.length} teachers.`);
  } catch (err) {
    console.error("Error loading teachers.csv", err.message);
  }

  // 3. Subjects
  try {
    const subjectsData = parseCSV(path.join(__dirname, "..", "subjects.csv"));
    SUBJECTS_DB = subjectsData
      .map((s) => ({
        Subject: s.Subject,
        Credits: Number(s.Credits),
      }))
      .filter((s) => s.Subject);
    console.log(`Loaded ${SUBJECTS_DB.length} subjects.`);
  } catch (err) {
    console.error("Error loading subjects.csv", err.message);
  }

  // 4. Attendance
  try {
    const attendanceContent = fs.readFileSync(
      path.join(__dirname, "..", "attendance.csv"),
      "utf-8",
    );
    const lines = attendanceContent.trim().split("\n");
    if (lines.length >= 3) {
      const dates = lines[0]
        .split(",")
        .map((d) => d.trim())
        .slice(2);
      const subjects = lines[1]
        .split(",")
        .map((s) => s.trim())
        .slice(2);

      ATTENDANCE_DB = {};

      // Initialize structure
      const uniqueDates = [...new Set(dates)].filter((d) => d);
      const uniqueSubjects = [...new Set(subjects)].filter((s) => s);

      uniqueDates.forEach((date) => {
        ATTENDANCE_DB[date] = {};
        uniqueSubjects.forEach((sub) => {
          ATTENDANCE_DB[date][sub] = {};
        });
      });

      // Parse rows
      for (let i = 2; i < lines.length; i++) {
        const parts = lines[i].split(",");
        const usn = parts[0]?.trim();
        if (!usn) continue;

        const statuses = parts.slice(2);
        for (let j = 0; j < dates.length; j++) {
          const d = dates[j];
          const s = subjects[j];
          if (d && s && ATTENDANCE_DB[d] && ATTENDANCE_DB[d][s]) {
            const statusVal = statuses[j] ? statuses[j].trim() : "A";
            ATTENDANCE_DB[d][s][usn.toUpperCase()] = {
              status:
                statusVal === "P" || statusVal.toLowerCase() === "present"
                  ? "Present"
                  : "Absent",
            };
          }
        }
      }
      console.log(`Loaded attendance data.`);
    }
  } catch (err) {
    console.error("Error loading attendance.csv", err.message);
  }
}

// Ensure updates are written back to teachers.csv to make class assignments persistent
function saveTeachers() {
  try {
    let csvContent = "Name,Email,Subject,Classes\n";
    TEACHERS_DB.forEach((t) => {
      // Quote classes to handle commas inside the array
      const classStr =
        t.Classes && t.Classes.length > 0 ? `"${t.Classes.join(", ")}"` : "";
      csvContent += `${t.Name},${t.Email},${t.Subject},${classStr}\n`;
    });
    fs.writeFileSync(
      path.join(__dirname, "..", "teachers.csv"),
      csvContent,
      "utf-8",
    );
  } catch (err) {
    console.error("Failed to save teachers.csv", err);
  }
}

/* =========================
   API ROUTES
========================= */

/* ---- STUDENTS ---- */
app.get("/api/students", (req, res) => {
  res.json(STUDENTS_DB);
});

app.get("/api/students/:usn", (req, res) => {
  const usn = req.params.usn.toUpperCase();
  const student = STUDENTS_DB[usn];

  if (!student) return res.status(404).json({ exists: false });

  res.json({
    exists: true,
    student: student,
  });
});

/* ---- TEACHER LOGIN ---- */
app.post("/api/teachers/login", (req, res) => {
  const email = req.body.email?.toLowerCase();
  const teacher = TEACHERS_DB.find((t) => t.Email === email);

  if (!teacher) return res.status(404).json({ success: false });

  res.json({
    success: true,
    teacher: {
      email: teacher.Email,
      name: teacher.Name,
      subject: teacher.Subject,
      classes: teacher.Classes || [],
    },
  });
});

app.get("/api/teachers", (req, res) => {
  res.json(
    TEACHERS_DB.map((t) => ({
      email: t.Email,
      name: t.Name,
      subject: t.Subject,
      classes: t.Classes || [],
    })),
  );
});

app.put("/api/teachers/:email/classes", (req, res) => {
  const email = req.params.email?.toLowerCase();
  const { classes } = req.body;

  const teacherIndex = TEACHERS_DB.findIndex((t) => t.Email === email);
  if (teacherIndex !== -1) {
    TEACHERS_DB[teacherIndex].Classes = Array.isArray(classes) ? classes : [];
    saveTeachers();
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: "Teacher not found" });
  }
});

/* ---- SUBJECTS ---- */
app.get("/api/subjects", (req, res) => {
  res.json(SUBJECTS_DB);
});

/* ---- ATTENDANCE ---- */
app.get("/api/attendance", (req, res) => {
  res.json(ATTENDANCE_DB);
});

/* =========================
   SERVER START
========================= */
loadDatabases();

app.listen(5000, () => {
  console.log(
    "🚀 Backend running at http://localhost:5000 (Data from CSV files)",
  );
});
