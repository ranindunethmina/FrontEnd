// Get form and input elements
const signUpForm = document.getElementById("signUpForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleSelect = document.getElementById("role");

// Event listener for form submission
signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 

    const userData = {
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        role: roleSelect.value.trim()
    };

    if (!userData.email || !userData.password || !userData.role) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5055/courseWork/api/v1/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.status === 201) {
            alert("Sign-up successful! Please log in.");
        } else if (response.status === 400) {
            alert("Bad request. Please check your input.");
        } else if (response.status === 404) {
            alert("Server could not process your request.");
        } else {
            alert("An unexpected error occurred. Please try again.");
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        alert("Failed to connect to the server. Please try again later.");
    }
});