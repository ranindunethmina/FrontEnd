import { saveCookie, getCookie } from "./TokenController.js";
  // Login function
function login(email, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "http://localhost:5055/courseWork/api/v1/auth/signin",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function (result) {
      console.log("Login successful:", result);
        resolve(result);
      },
      error: function (xhr, status, error) {
        console.error("Login failed:", error);
        reject(xhr.responseJSON || error); // Rejecting with the server error message or raw error
      },
    });
  });
}
  
$(document).ready(function () {
  $("#signInForm").on("submit", function (event) {
    event.preventDefault(); 

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();
  
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
  
    login(email, password)
      .then((response) => {
        // Save email and token
        localStorage.setItem("userEmail", email);
        const token = response.token;
        saveCookie("authToken", token);
        console.log("Token saved as cookie:", getCookie("authToken"));
        // Redirect to the home page
        window.location.href = "/dashboard.html"; // Update with your homepage URL
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
        const errorMessage = error.message || "Invalid email or password.";
        alert(errorMessage); // Update to Notyf or other libraries as needed
      });
  });
});