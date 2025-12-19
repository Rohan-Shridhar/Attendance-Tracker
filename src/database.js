//Database of students, teachers, HOD, subjects, and attendance records


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
  'rajesh.cse@bmsce.ac.in': { name: 'Dr. Rajesh Kumar', subject: 'DST', classes: ['3S', '3T'] },
  'anita.cse@bmsce.ac.in': { name: 'Prof. Anita Singh', subject: 'DBMS', classes: ['3S', '3T'] },
  'suresh.cse@bmsce.ac.in': { name: 'Dr. Suresh Patel', subject: 'JAVA', classes: ['3S', '3T'] },
  'meera.cse@bmsce.ac.in': { name: 'Prof. Meera Verma', subject: 'COA', classes: ['3S', '3T'] },
  'vikram.cse@bmsce.ac.in': { name: 'Dr. Vikram Gupta', subject: 'LD', classes: ['3S', '3T'] },
  'neha.cse@bmsce.ac.in': { name: 'Prof. Neha Kapoor', subject: 'USP', classes: ['3S', '3T'] },
  'arjun.cse@bmsce.ac.in': { name: 'Dr. Arjun Desai', subject: 'FWD', classes: ['3S', '3T'] },
  'priya.cse@bmsce.ac.in': { name: 'Prof. Priya Sharma', subject: 'DST', classes: ['3U', '3V'] },
  'karthik.cse@bmsce.ac.in': { name: 'Dr. Karthik Rao', subject: 'DBMS', classes: ['3U', '3V'] },
  'deepa.cse@bmsce.ac.in': { name: 'Prof. Deepa Nair', subject: 'JAVA', classes: ['3U', '3V'] },
  'ramesh.cse@bmsce.ac.in': { name: 'Dr. Ramesh Iyer', subject: 'COA', classes: ['3U', '3V'] },
  'kavita.cse@bmsce.ac.in': { name: 'Prof. Kavita Menon', subject: 'LD', classes: ['3U', '3V'] },
  'anil.cse@bmsce.ac.in': { name: 'Dr. Anil Joshi', subject: 'USP', classes: ['3U', '3V'] },
  'sanjay.cse@bmsce.ac.in': { name: 'Prof. Sanjay Reddy', subject: 'FWD', classes: ['3U', '3V'] },
};

export const Hod_DB = {
  'hod.cse@bmsce.ac.in': { name: 'Dr. Surekha Naik', dept: 'Computer Science and Engineering' },
};
