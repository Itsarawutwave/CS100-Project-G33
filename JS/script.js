/*
  File: script.js
  Author: CS100 Team
  Date Created: 23 July 2023
  Copyright: CSTU
  Description: JS code of CSTU Passport that validate with JS
*/

const config = {
    // backendUrl: "http://54.179.42.49/", // Default backend URL
    // backendUrl: "https://d1npkyc4r380kx.cloudfront.net/", // Default backend URL
    // backendUrl: "https://d1a6370uhsfk5w.cloudfront.net/", // Default backend URL
  };
  
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
    const studentIDPattern = /^\d{10}$/;
    const errorElement = document.getElementById("studentIDError");
  
    if (!studentIDPattern.test(studentIDInput.value)) {
      errorElement.textContent = "Please enter a 10-digit Student ID.";
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
  
  // Function to validate form inputs on user input
  function validateFormOnInput() {
    validateName();
    validateStudentID();
    validateEmail();
  }
  // Functuin to activitiesDay
  function activitiesDay(){
    const activities = document.getElementById("workTitle");
    const activitiesTitle = document.getElementById("activitiesTitle");
    const activitiesImg1 = document.getElementById("activitiesImg1");
    const activitiesImg2 = document.getElementById("activitiesImg2");
    const activitiesImg3 = document.getElementById("activitiesImg3");
    const activitiesImg4 = document.getElementById("activitiesImg4");
    //Display activities day
   switch(activities.value){
    case "orentationDay":
      activitiesTitle.innerHTML = "วันปฐมนิเทศ";
      activitiesImg1.src = "../img/orentationDay_1.png"
      activitiesImg2.src = "../img/orentationDay_2.png"
      activitiesImg3.src = "../img/orentationDay_3.png"
      activitiesImg4.src = "../img/orentationDay_4.png"
      break;
    case "firstmeetDay":
      activitiesTitle.innerHTML = "First Meet";
      activitiesImg1.src = "../img/firstmeetDay_1.png"
      activitiesImg2.src = "../img/firstmeetDay_2.png"
      activitiesImg3.src = "../img/firstmeetDay_3.png"
      activitiesImg4.src = "../img/firstmeetDay_4.png"
      break;
    case "freshygameDay":
      activitiesTitle.innerHTML = "Freshy Games";
      activitiesImg1.src = "../img/freshygameDay_1.png"
      activitiesImg2.src = "../img/freshygameDay_2.png"
      activitiesImg3.src = "../img/freshygameDay_3.png"
      activitiesImg4.src = "../img/freshygameDay_4.png"
      break;
    case "halloweenDay":
      activitiesTitle.innerHTML = "Halloween Nightmare";
      activitiesImg1.src = "../img/halloweenDay_1.png"
      activitiesImg2.src = "../img/halloweenDay_2.png"
      activitiesImg3.src = "../img/halloweenDay_3.png"
      activitiesImg4.src = "../img/halloweenDay_4.png"
      break;
   }
  }

  // Function to fetch activity types from the backend
  async function fetchActivityTypes() {
    try {
      const response = await fetch(config.backendUrl + "getActivityType");
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
    if (!validateName() || !validateStudentID() || !validateEmail()) {
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
      const response = await fetch(config.backendUrl + "record", {
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
        const formattedData = Object.entries(responseData.data)
          .map(([key, value]) => `"${key}": "${value}"`)
          .join("\n");
  
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
  
  // Event listener for form submission
  document.getElementById("myForm").addEventListener("submit", submitForm);
  
  // Event listeners for input validation on user input
  document.getElementById("fullname").addEventListener("input", validateName);
  document.getElementById("studentID").addEventListener("input", validateStudentID);
  document.getElementById("email").addEventListener("input", validateEmail);