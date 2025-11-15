// Centralized database for students and subjects
export const STUDENTS_DB = {
  '1WN24CS201': { name: 'Aarav Kumar', class: '3T' },
  '1WN24CS202': { name: 'Vivaan Sharma', class: '3T' },
  '1WN24CS203': { name: 'Arjun Patel', class: '3T' },
  '1WN24CS204': { name: 'Reyansh Singh', class: '3T' },
  '1WN24CS205': { name: 'Aditya Reddy', class: '3T' },
  '1WN24CS206': { name: 'Pranav Gupta', class: '3T' },
  '1WN24CS207': { name: 'Ishaan Verma', class: '3T' },
  '1WN24CS208': { name: 'Rohan Nair', class: '3T' },
  '1WN24CS209': { name: 'Siddharth Rao', class: '3T' },
  '1WN24CS210': { name: 'Nikhil Joshi', class: '3T' },
  '1WN24CS211': { name: 'Varun Iyer', class: '3T' },
  '1WN24CS212': { name: 'Karan Bhatt', class: '3T' },
  '1WN24CS213': { name: 'Rahul Menon', class: '3T' },
  '1WN24CS214': { name: 'Abhishek Das', class: '3T' },
  '1WN24CS215': { name: 'Sandeep Malik', class: '3T' },
  '1WN24CS216': { name: 'Harshit Chopra', class: '3T' },
  '1WN24CS217': { name: 'Mayank Singh', class: '3T' },
  '1WN24CS218': { name: 'Rohit Chand', class: '3T' },
  '1WN24CS219': { name: 'Dhruv Kapoor', class: '3T' },
  '1WN24CS220': { name: 'Saurav Bhat', class: '3T' },
  '1WN24CS221': { name: 'Tushar Kulkarni', class: '3T' },
  '1WN24CS222': { name: 'Yash Desai', class: '3T' },
  '1WN24CS223': { name: 'Vikram Thakur', class: '3T' },
  '1WN24CS224': { name: 'Anmol Goyal', class: '3T' },
  '1WN24CS225': { name: 'Ajay Saxena', class: '3T' },
  '1WN24CS226': { name: 'Priya Sharma', class: '3U' },
  '1WN24CS227': { name: 'Neha Kapoor', class: '3U' },
  '1WN24CS228': { name: 'Sneha Desai', class: '3U' },
  '1WN24CS229': { name: 'Anjali Verma', class: '3U' },
  '1WN24CS230': { name: 'Pooja Gupta', class: '3U' },
  '1WN24CS231': { name: 'Kavya Nair', class: '3U' },
  '1WN24CS232': { name: 'Rohan Shridhar', class: '3U' },
  '1WN24CS233': { name: 'Divya Singh', class: '3U' },
  '1WN24CS234': { name: 'Isha Reddy', class: '3U' },
  '1WN24CS235': { name: 'Riya Patel', class: '3U' },
  '1WN24CS236': { name: 'Meera Iyer', class: '3U' },
  '1WN24CS237': { name: 'Shreya Joshi', class: '3U' },
  '1WN24CS238': { name: 'Nitya Rao', class: '3U' },
  '1WN24CS239': { name: 'Aanchal Das', class: '3U' },
  '1WN24CS240': { name: 'Diya Menon', class: '3U' },
  '1WN24CS241': { name: 'Esha Malik', class: '3U' },
  '1WN24CS242': { name: 'Fiona Chopra', class: '3U' },
  '1WN24CS243': { name: 'Gita Singh', class: '3U' },
  '1WN24CS244': { name: 'Hema Bhat', class: '3U' },
  '1WN24CS245': { name: 'Iris Kapoor', class: '3U' },
  '1WN24CS246': { name: 'Jyoti Kulkarni', class: '3U' },
  '1WN24CS247': { name: 'Kaveri Thakur', class: '3U' },
  '1WN24CS248': { name: 'Lakshmi Goyal', class: '3U' },
  '1WN24CS249': { name: 'Medha Saxena', class: '3U' },
  '1WN24CS250': { name: 'Neelam Sinha', class: '3U' },
};

export const SUBJECTS = [
  { id: 'SUB1', name: 'DST' },
  { id: 'SUB2', name: 'DBMS' },
  { id: 'SUB3', name: 'JAVA' },
  { id: 'SUB4', name: 'COA' },
  { id: 'SUB5', name: 'LD' },
  { id: 'SUB6', name: 'USP' },
  { id: 'SUB7', name: 'FWD' },
];

export const TEACHERS_DB = {
  'rajesh.cse@bmsce.ac.in': { name: 'Dr. Rajesh Kumar', subject: 'DST' },
  'anita.cse@bmsce.ac.in': { name: 'Prof. Anita Singh', subject: 'DBMS' },
  'suresh.cse@bmsce.ac.in': { name: 'Dr. Suresh Patel', subject: 'JAVA' },
  'meera.cse@bmsce.ac.in': { name: 'Prof. Meera Verma', subject: 'COA' },
  'vikram.cse@bmsce.ac.in': { name: 'Dr. Vikram Gupta', subject: 'LD' },
  'neha.cse@bmsce.ac.in': { name: 'Prof. Neha Kapoor', subject: 'USP' },
  'arjun.cse@bmsce.ac.in': { name: 'Dr. Arjun Desai', subject: 'FWD' },
};

function getPastTenWorkDays() {
  const dates = [];
  let day = new Date();
  
  day.setDate(day.getDate() - 1);

  while (dates.length < 30) {
    const dayOfWeek = day.getDay();
    
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      const isoDate = day.toISOString().split('T')[0];
      dates.push(isoDate);
    }
    
    day.setDate(day.getDate() - 1);
  }
  return dates;
}


function generateStudentStatuses() {
  const students = {};
  for (const usn in STUDENTS_DB) {
    // Randomly assign Present/Absent. (e.g., ~15% chance of being absent)
    const status = Math.random() > 0.20 ? 'Present' : 'Absent';
    
    students[usn] = { status };
  }
  return students;
}

function generateFullAttendanceDB() {
  const db = {};
  const dates = getPastTenWorkDays();
  const subjectNames = SUBJECTS.map(s => s.name); 

  for (const date of dates) {
    db[date] = {};
    
    for (const subjectName of subjectNames) {
      db[date][subjectName] = generateStudentStatuses();
    }
  }
  return db;
}

// Create and export the main ATTENDANCE_DB object
export const ATTENDANCE_DB = generateFullAttendanceDB();