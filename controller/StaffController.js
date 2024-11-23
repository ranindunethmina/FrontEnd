// Select Elements
const staffTableList = document.getElementById("staff-table-list");
const staffModal = document.getElementById("staff-modal");
const staffForm = document.getElementById("staff-form");
const staffButton = document.getElementById("staff-submit");
const addStaffButton = document.getElementById("add-staff");

let isStaffUpdateMode = false;
let currentStaffId = null;

// Open the staff modal
const openStaffModal = () => {
  staffModal.style.display = "block";
  staffForm.reset();
  staffButton.textContent = "Add Staff Member";
};

// Close the staff modal
const closeStaffModal = () => {
  staffModal.style.display = "none";
  staffForm.reset();
  isStaffUpdateMode = false;
  currentStaffId = null;
};

// Event Listeners for Modal Open/Close
addStaffButton.addEventListener("click", openStaffModal);
document.getElementById("staff-modal-close").addEventListener("click", closeStaffModal);

// Fetch all staff members and populate the table
const loadStaffIntoTable = async () => {
  try {
    const response = await fetch("http://localhost:5055/courseWork/api/v1/staff/allStaff");
    if (!response.ok) {
      throw new Error(`Failed to fetch staff: ${response.statusText}`);
    }
    const staffMembers = await response.json();
    staffTableList.innerHTML = "";
    staffMembers.forEach((staff) => addStaffToTable(staff));
  } catch (error) {
    console.error("Error loading staff members:", error);
  }
};

// Add a single staff member to the table
const addStaffToTable = (staff) => {
  const row = document.createElement("tr");

  const keys = [
    "id", "firstName", "lastName", "designation", "gender",
    "joinedDate", "dob", "contactNo", "email", "role", "field", "vehicle"
  ];

  // Add table cells for each key
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = staff[key] || "N/A";
    row.appendChild(cell);
  });

  // Combine address lines into a single column
  const addressCell = document.createElement("td");
  const addresses = [staff.addressLine01, staff.addressLine02, staff.addressLine03, staff.addressLine04, staff.addressLine05];
  addressCell.textContent = addresses.filter(Boolean).join(", ") || "N/A"; // Join non-empty addresses
  row.appendChild(addressCell);

  // Add Update button
  const updateCell = document.createElement("td");
  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.className = "action-button";
  updateButton.addEventListener("click", () => {
    openStaffModal();
    fillFormWithStaffData(staff);
    isStaffUpdateMode = true;
    currentStaffId = staff.id;
    staffButton.textContent = "Update Staff Member";
  });
  updateCell.appendChild(updateButton);
  row.appendChild(updateCell);

  // Add Remove button
  const removeCell = document.createElement("td");
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "action-button";
  removeButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`http://localhost:5055/courseWork/api/v1/staff/${staff.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        row.remove();
      } else {
        console.error("Failed to delete staff member");
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
    }
  });
  removeCell.appendChild(removeButton);
  row.appendChild(removeCell);

  // Append row to table
  staffTableList.appendChild(row);
};

// Fill form with staff data for updating
const fillFormWithStaffData = (staff) => {
  document.getElementById("staffId").value = staff.id || "";
  document.getElementById("firstName").value = staff.firstName || "";
  document.getElementById("lastName").value = staff.lastName || "";
  document.getElementById("designation").value = staff.designation || "";
  document.getElementById("gender").value = staff.gender || "";
  document.getElementById("joinedDate").value = staff.joinedDate || "";
  document.getElementById("dob").value = staff.dob || "";
  document.getElementById("contactNo").value = staff.contactNo || "";
  document.getElementById("email").value = staff.email || "";
  document.getElementById("role").value = staff.role || "";
  document.getElementById("field").value = staff.field || "";
  document.getElementById("vehicle").value = staff.vehicle || "";

  // Populate address lines
  document.getElementById("address1").value = staff.addressLine01 || "";
  document.getElementById("address2").value = staff.addressLine02 || "";
  document.getElementById("address3").value = staff.addressLine03 || "";
  document.getElementById("address4").value = staff.addressLine04 || "";
  document.getElementById("address5").value = staff.addressLine05 || "";
};

// Handle form submission
staffForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const staffData = {
    id: document.getElementById("staffId").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    designation: document.getElementById("designation").value,
    gender: document.getElementById("gender").value,
    joinedDate: document.getElementById("joinedDate").value,
    dob: document.getElementById("dob").value,
    contactNo: document.getElementById("contactNo").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value,
    addressLine01: document.getElementById("address1").value,
    addressLine02: document.getElementById("address2").value,
    addressLine03: document.getElementById("address3").value,
    addressLine04: document.getElementById("address4").value,
    addressLine05: document.getElementById("address5").value,
  };

  const url = isStaffUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/staff/${currentStaffId}`
    : "http://localhost:5055/courseWork/api/v1/staff";
  const method = isStaffUpdateMode ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staffData),
    });

    if (response.ok) {
      alert(isStaffUpdateMode ? "Staff member updated successfully!" : "Staff member added successfully!");
      loadStaffIntoTable();
      closeStaffModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Initialize table on page load
loadStaffIntoTable();