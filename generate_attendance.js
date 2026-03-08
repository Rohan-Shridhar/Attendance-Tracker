const fs = require("fs");

const studentsData = fs.readFileSync("students.csv", "utf8").trim().split("\n");
const subjectsData = fs.readFileSync("subjects.csv", "utf8").trim().split("\n");

const students = studentsData.slice(1).map((line) => {
  const parts = line.split(",");
  return { usn: parts[0], name: String(parts[1]).trim() };
});

const subjects = subjectsData.slice(1).map((line) => line.split(",")[0].trim());

// Let's create a full month of dates for attendance, skipping weekends (assuming 2024-03 starts on Friday)
// We'll just generate 10 generic dates for demonstration
const dates = [
  "2024-03-01",
  "2024-03-04",
  "2024-03-05",
  "2024-03-06",
  "2024-03-07",
  "2024-03-08",
  "2024-03-11",
  "2024-03-12",
  "2024-03-13",
  "2024-03-14",
];

let csvContent = "";

// Row 1: Dates header
let row1 = ["USN", "Name"];
for (const date of dates) {
  for (let i = 0; i < subjects.length; i++) {
    row1.push(date);
  }
}
csvContent += row1.join(",") + "\n";

// Row 2: Subjects header
let row2 = ["", ""];
for (const date of dates) {
  for (const subject of subjects) {
    row2.push(subject);
  }
}
csvContent += row2.join(",") + "\n";

// Rows: Students
for (const student of students) {
  if (!student.usn) continue;
  let row = [student.usn, student.name];
  for (const date of dates) {
    for (const subject of subjects) {
      // Random generation: 85% Present, 15% Absent
      const status = Math.random() < 0.85 ? "P" : "A";
      row.push(status);
    }
  }
  csvContent += row.join(",") + "\n";
}

fs.writeFileSync("attendance.csv", csvContent, "utf8");
console.log("attendance.csv generated with random P/A values.");
