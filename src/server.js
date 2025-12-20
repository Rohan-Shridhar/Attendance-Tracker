// DB.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./uri.env" });

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SCHEMAS & MODELS
========================= */

const studentSchema = new mongoose.Schema({
  USN: String,
  Name: String,
  Section: String,
  Gender: String,
});

const teacherSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Subject: String,
  Classes: [String], // ✅ ARRAY
});

const subjectSchema = new mongoose.Schema({
  Subject: String,
  Credits: Number,
});

const Subject = mongoose.model("Subject", subjectSchema, "subjects");
const Student = mongoose.model("Student", studentSchema, "students");
const Teacher = mongoose.model("Teacher", teacherSchema, "teachers");

/* =========================
   ATTENDANCE (IN-MEMORY)
========================= */

let ATTENDANCE_DB = {};

function getPast60WorkingDays() {
  const dates = [];
  let d = new Date();
  d.setDate(d.getDate() - 1);

  while (dates.length < 60) {
    const day = d.getDay();
    if (day > 0 && day < 6) {
      dates.push(d.toISOString().split("T")[0]);
    }
    d.setDate(d.getDate() - 1);
  }
  return dates;
}

async function generateAttendanceFromMongo() {
  const students = await Student.find({});
  const usns = students.map(s => s.USN);

  const SUBJECTS = ["DST", "DBMS", "JAVA", "COA", "LD", "USP", "FWD"];
  const dates = getPast60WorkingDays();

  const db = {};

  for (const date of dates) {
    db[date] = {};
    for (const subject of SUBJECTS) {
      db[date][subject] = {};
      usns.forEach(usn => {
        db[date][subject][usn] = {
          status: Math.random() > 0.2 ? "Present" : "Absent",
        };
      });
    }
  }

  ATTENDANCE_DB = db;
  console.log("✅ Attendance generated for Mongo students");
}

/* =========================
   API ROUTES
========================= */

/* ---- STUDENTS ---- */

app.get("/api/students", async (_, res) => {
  const students = await Student.find({});
  const out = {};
  students.forEach(s => {
    out[s.USN] = {
      name: s.Name,
      class: s.Section,
      gender: s.Gender,
    };
  });
  res.json(out);
});

app.get("/api/students/:usn", async (req, res) => {
  const usn = req.params.usn.toUpperCase();
  const student = await Student.findOne({ USN: usn });

  if (!student) return res.status(404).json({ exists: false });

  res.json({
    exists: true,
    student: {
      usn: student.USN,
      name: student.Name,
      class: student.Section,
      gender: student.Gender,
    },
  });
});
/* ---- TEACHER LOGIN ---- */
app.post("/api/teachers/login", async (req, res) => {
  const email = req.body.email.toLowerCase();
  const teacher = await Teacher.findOne({ Email: email }).lean();

  if (!teacher) return res.status(404).json({ success: false });

  // Transform "3A,3B,3C,3D" into ["3A", "3B", "3C", "3D"]
  let formattedClasses = [];
  if (Array.isArray(teacher.Classes)) {
    // If it's an array containing a comma-separated string: ["3A,3B,3C"]
    formattedClasses = teacher.Classes.flatMap(cls => cls.split(",").map(s => s.trim()));
  } else if (typeof teacher.Classes === "string") {
    // If it's just a string: "3A,3B,3C"
    formattedClasses = teacher.Classes.split(",").map(s => s.trim());
  }

  res.json({
    success: true,
    teacher: {
      email: teacher.Email,
      name: teacher.Name,
      subject: teacher.Subject,
      classes: formattedClasses, 
    },
  });
});
/* ---- TEACHERS (Manage Faculty) ---- */

app.get("/api/teachers", async (_, res) => {
  const teachers = await Teacher.find({});
  res.json(
    teachers.map(t => ({
      email: t.Email,
      name: t.Name,
      subject: t.Subject,
      classes: t.Classes || [],
    }))
  );
});

app.put("/api/teachers/:email/classes", async (req, res) => {
  const { classes } = req.body;

  await Teacher.updateOne(
    { Email: req.params.email },
    { $set: { Classes: classes } }
  );

  res.json({ success: true });
});
/* ---- SUBJECTS ---- */
app.get("/api/subjects", async (_, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects); // This sends: [{ Subject: "DST", Credits: 4 }, ...]
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});
/* ---- ATTENDANCE ---- */

app.get("/api/attendance", (_, res) => {
  res.json(ATTENDANCE_DB);
});

/* =========================
   SERVER START
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await generateAttendanceFromMongo();
    app.listen(5000, () =>
      console.log("🚀 Backend running at http://localhost:5000")
    );
  })
  .catch(console.error);
