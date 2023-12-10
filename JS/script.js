/*
  File: script.js
  Author: CS100 Team
  Date Created: 23 July 2023
  Copyright: CSTU
  Description: JS code of CSTU Passport that validate with JS
*/

const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");

  if (names.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^66\d{8}$/;
  const errorElement = document.getElementById("studentIDError");

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter a 10-digit Student ID in the format '66XXXXXXXX'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

//Function to validate Worktitle
function validateWorkTitle(){
  const WorkTitleInput = document.getElementById("workTitle");
  const Worktitle = WorkTitleInput.value;
  const errorElement = document.getElementById("worktitleError");
  
  if(!Worktitle){
    errorElement.textContent = "Please enter your Activity Title.";
    return false;
  } else {
    errorElement.textContent = "";//Clear the error message when valid
  }
  return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
  validateWorkTitle();
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail() || !validateWorkTitle()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }
  output();
  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description")
  };
  console.log(data);

  try {
    // Send data to the backend using POST request
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Format JSON data for display
      const formattedData = Object.entries(responseData.data).map(([key, value]) => `"${key}": "${value}"`).join("\n");

      // Display success message with formatted data
      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

// Function to output data
function output(){
  const fullname = document.getElementById("fullname");
  const firstname = fullname.value.trim().split(" ")[0];
  const lastname = fullname.value.trim().split(" ")[1];
  const student_id = document.getElementById("studentID").value;
  const email = document.getElementById("email").value;
  const worktype = document.getElementById("activityType").value;
  const academicyear = document.getElementById("academicYear").value;
  const worktitle = document.getElementById("workTitle").value;
  const Semester = document.getElementById("semester").value;
  const startdate = document.getElementById("startDate").value;
  const enddate = document.getElementById("endDate").value;
  const Location = document.getElementById("location").value;
  const comment = document.getElementById("description").value;

  document.getElementById("firstname").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Firstname : </span>" + firstname;
  document.getElementById("lastname").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Lastname : </span>" + lastname;
  document.getElementById("activitiesTitle").innerHTML = worktitle;
  document.getElementById("uni-email").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Email : </span>" + email;
  document.getElementById("worktitle").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Activity Title : </span>" + worktitle;
  document.getElementById("studentid").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Student ID : </span>" + student_id;
  document.getElementById("worktype").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Activity Type : </span>" + worktype;
  document.getElementById("academic-year").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Academic Year : </span>" + academicyear;
  document.getElementById("Semester").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Semester : </span>" + Semester;
  document.getElementById("startdate").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Start-Date : </span>" + startdate;
  document.getElementById("enddate").innerHTML = "<span style='color: #b4f766;font-weight: bold'>End-Date : </span>" + enddate;
  document.getElementById("Location").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Location : </span>" + Location;
  document.getElementById("comment").innerHTML = "<span style='color: #b4f766;font-weight: bold'>Comment : </span>" + comment;

}

//Function mousehover-in
function mousehover(){
  this.style.backgroundColor = '#bdba34';
}

//Function mousehover-out
function mousehover_out() {
  this.style.backgroundColor = '#4caf50';
}

//Darkmode
document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  darkModeToggle.addEventListener('click', function () {
      body.classList.toggle('dark-mode');
  });
});

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);
document.getElementById("submit_btn").addEventListener("mouseover",mousehover);
document.getElementById("submit_btn").addEventListener("mouseout",mousehover_out);


// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document.getElementById("studentID").addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("workTitle").addEventListener("input", validateWorkTitle);