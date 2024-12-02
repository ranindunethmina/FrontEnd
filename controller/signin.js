// Get form and input elements
const signInForm = document.getElementById("signInForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Event listener for form submission
signInForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Gather form data
    const credentials = {
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
    };

    // Validate form inputs
    if (!credentials.email || !credentials.password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        // Send POST request to the backend
        const response = await fetch("http://localhost:5055/courseWork/api/v1/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            // Parse the response body
            const data = await response.json();
            console.log("Authentication successful:", data);

            // Store the tokens in localStorage or cookies
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            // Redirect to the dashboard
            alert("Sign-in successful! Redirecting to the dashboard...");
            window.location.href = "/dashboard.html"; // Update with your dashboard URL
        } else if (response.status === 401) {
            alert("Invalid email or password. Please try again.");
        } else {
            alert("An unexpected error occurred. Please try again later.");
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        alert("Failed to connect to the server. Please check your connection and try again.");
    }
});
