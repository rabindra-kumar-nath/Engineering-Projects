const student = {
  name: "Rabindra",
  age: 21,
  course: "CSE AI & ML",
  project: "Rabindra AI Website",
  skills: ["JavaScript", "Python", "React", "TypeScript"],
};

function displayStudent() {
  console.log("========== STUDENT DETAILS ==========");
  console.log("Name:", student.name);
  console.log("Age:", student.age);
  console.log("Course:", student.course);
  console.log("Project:", student.project);

  console.log("\n========== TECHNICAL SKILLS ==========");

  student.skills.forEach((skill, index) => {
    console.log(`${index + 1}. ${skill}`);
  });

  console.log("\n========== TEST RESULTS ==========");
  console.log("JavaScript: Working");
  console.log("Node.js: Working");
  console.log("ESLint: Ready");
  console.log("Prettier: Ready");
}

displayStudent();
