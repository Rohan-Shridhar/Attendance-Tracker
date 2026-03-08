const http = require("http");

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", (err) => reject(err));
  });
}

function dumpString(s) {
  if (typeof s !== "string") return `(not a string: ${typeof s})`;
  return `"${s}" [${s
    .split("")
    .map((c) => c.charCodeAt(0))
    .join(",")}]`;
}

async function debug() {
  try {
    const teachers = await get("http://localhost:5000/api/teachers");
    const subjects = await get("http://localhost:5000/api/subjects");

    console.log("--- Subjects Data ---");
    subjects.forEach((s) => {
      console.log(`Subject info: ${dumpString(s.Subject)}`);
    });

    console.log("\n--- Teacher Subjects ---");
    const teacherSubjects = [...new Set(teachers.map((t) => t.subject))];
    teacherSubjects.forEach((s) => {
      console.log(`Teacher subject info: ${dumpString(s)}`);
    });

    console.log("\n--- Match Check (Case-Sensitive) ---");
    subjects.forEach((s) => {
      const match = teachers.some((t) => t.subject === s.Subject);
      console.log(`"${s.Subject}" matches: ${match}`);
    });
  } catch (err) {
    console.error("Debug script failed:", err.message);
  }
}

debug();
