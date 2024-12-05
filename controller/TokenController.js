export function getCookie(name) {
  const cookieString = document.cookie; // Get all cookies as a string
  const cookies = cookieString.split("; "); // Split string into individual cookies
  
  for (let cookie of cookies) {
    const [key, value] = cookie.split("="); // Split each cookie into name and value
    if (key === decodeURIComponent(name)) {
      return decodeURIComponent(value); // Return value if the name matches
    }
  }
  return null; // Return null if the cookie is not found
}
  
/**
* Refreshes the authentication token using the refresh token from cookies.
* @returns {Promise<object>} - Resolves with the refreshed token response or rejects with an error.
*/

export function tokenRefresh() {
  const token = getCookie("authToken");
  console.log("Token: in service", token);
  
  if (!token) {
    return Promise.reject(new Error("No refresh token found."));
  }
  
  return new Promise((resolve, reject) => {
    $.ajax({
    url: `http://localhost:5055/courseWork/api/v1/auth/refresh?refreshToken=${(token)}`, // API endpoint
    type: "POST",
    success: function (result) {
    console.log("Token refresh response:", result);
    resolve(result); // Resolve promise with API response
    },
    error: function (xhr, status, error) {
      console.error(`Error: ${status} - ${error}`); // Log error details
      reject(error); // Reject promise with error
    },
  });
});
}
  
export function saveCookie(name, value) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/;`;
  console.log(`Cookie saved: ${name}=${value}`);
}  