const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './uri.env' });

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. SCHEMAS (Case-Sensitive to your Atlas Images) ---
const studentSchema = new mongoose.Schema({ USN: String, Name: String, Section: String, Gender: String });
const subjectSchema = new mongoose.Schema({ Subject: String, Credits: Number });
const teacherSchema = new mongoose.Schema({ Name: String, Email: String, Subject: String, Classes: String });

// --- 2. MODELS ---
const Student = mongoose.model('Student', studentSchema, 'students');
const Subject = mongoose.model('Subject', subjectSchema, 'subjects');
const Teacher = mongoose.model('Teacher', teacherSchema, 'teachers');

// --- 3. API ENDPOINT ---
app.get('/api/data', async (req, res) => {
    try {
        const [studentDocs, subjectDocs, teacherDocs] = await Promise.all([
            Student.find({}),
            Subject.find({}),
            Teacher.find({})
        ]);

        // Transform Students: USN -> { name, class, gender }
        const STUDENTS_DB = {};
        studentDocs.forEach(doc => {
            STUDENTS_DB[doc.USN] = { name: doc.Name, class: doc.Section, gender: doc.Gender };
        });

        // Transform Subjects: [{ id, name, credits }]
        const SUBJECTS_LIST = subjectDocs.map((doc, index) => ({
            id: index + 1, name: doc.Subject, credits: doc.Credits
        }));

        // Transform Teachers: Email -> { name, subject, classes }
        const TEACHERS_DB = {};
        teacherDocs.forEach(doc => {
            // Note: Classes is stored as a string "[3A,3B]" in your image
            // We strip brackets and split it into an array for your React logic
            const classArray = doc.Classes.replace(/[\[\]]/g, '').split(',');
            TEACHERS_DB[doc.Email] = { name: doc.Name, subject: doc.Subject, classes: classArray };
        });

        res.json({ STUDENTS_DB, SUBJECTS_LIST, TEACHERS_DB });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. START SERVER ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to Atlas");
        app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
    })
    .catch(err => console.error("❌ Connection failed:", err));