// // auth.js
// document.addEventListener("DOMContentLoaded", function () {
//     // Handle Sign Up Form Submission
//     const signUpForm = document.getElementById("signUpForm");
//     if (signUpForm) {
//         signUpForm.addEventListener("submit", function (e) {
//             e.preventDefault();
            
//             const email = document.getElementById("email").value.trim();
//             const password = document.getElementById("password").value.trim();
//             const role = document.getElementById("role").value;

//             if (email && password && role) {
//                 // Store user data in local storage
//                 const userData = { email, password, role };
//                 localStorage.setItem(email, JSON.stringify(userData));

//                 alert("Sign up successful! You can now sign in.");
//                 window.location.href = "signin.html"; // Redirect to sign-in page
//             } else {
//                 alert("Please fill out all fields.");
//             }
//         });
//     }

//     // Handle Sign In Form Submission
//     const signInForm = document.getElementById("signInForm");
//     if (signInForm) {
//         signInForm.addEventListener("submit", function (e) {
//             e.preventDefault();

//             const email = document.getElementById("email").value.trim();
//             const password = document.getElementById("password").value.trim();

//             const storedUser = localStorage.getItem(email);

//             if (storedUser) {
//                 const userData = JSON.parse(storedUser);

//                 if (userData.password === password) {
//                     alert("Sign in successful!");

//                     // Save session information
//                     localStorage.setItem("currentUser", JSON.stringify(userData));

//                     // Redirect to the dashboard
//                     window.location.href = "dashboard.html";
//                 } else {
//                     alert("Incorrect password. Please try again.");
//                 }
//             } else {
//                 alert("No account found with this email.");
//             }
//         });
//     }
// });