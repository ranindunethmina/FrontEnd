import { getCookie } from "./TokenController.js";

// Select Elements
const vehicleTableList = document.getElementById("vehicle-table-list");
const vehicleModal = document.getElementById("vehicle-modal");
const vehicleForm = document.getElementById("vehicle-form");
const vehicleButton = document.getElementById("vehicle-submit");
const addVehicleButton = document.getElementById("add-vehicle");

let isVehicleUpdateMode = false;
let currentVehicleCode = null;

// Open the vehicle modal
const openVehicleModal = () => {
  vehicleModal.style.display = "block";
  if (!isVehicleUpdateMode) {
    vehicleForm.reset();
  }
};

// Close the vehicle modal
const closeVehicleModal = () => {
  vehicleModal.style.display = "none";
  vehicleForm.reset();
  vehicleButton.textContent = "Add Vehicle";
  isVehicleUpdateMode = false;
  currentVehicleCode = null;
};

// Event Listeners for Modal Open/Close
addVehicleButton
  .addEventListener("click", openVehicleModal);
document
  .getElementById("vehicle-modal-close")
  .addEventListener("click", closeVehicleModal);


async function authenticatedFetch(url, options = {}) {
  const token = getCookie("authToken");

  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token}`;

  return fetch(url, { ...options, headers });
}

// Fetch all vehicles and populate the table
export async function loadVehiclesIntoTable() {
  try {
    const response = await authenticatedFetch(
      "http://localhost:5055/courseWork/api/v1/vehicle/allVehicle",
      { method: "GET"}
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    const vehicles = await response.json();
    vehicleTableList.innerHTML = "";
    vehicles.forEach((vehicle) => addVehicleToTable(vehicle));
  } catch (error) {
    console.error("Error loading vehicles:", error);
  }
};

// Add a single vehicle to the table
const addVehicleToTable = (vehicle) => {
  const row = document.createElement("tr");

  const keys = ["vehicleCode", "licensePlate", "category", "fuelType", "status", "staffId", "remarks"];
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = vehicle[key];
    row.appendChild(cell);
  });

  // Add Update button
  const updateCell = document.createElement("td");
  const updateButton = document.createElement("button");

  updateButton.textContent = "Update";
  updateButton.className = "action-button";
  
  updateButton.addEventListener("click", () => {
    openVehicleModal();
    fillFormWithVehicleData(vehicle);
    isVehicleUpdateMode = true;
    currentVehicleCode = vehicle.vehicleCode;
    vehicleButton.textContent = "Update Vehicle";
  });
  updateCell.appendChild(updateButton);
  row.appendChild(updateCell);

  // Add Remove button
  const removeCell = document.createElement("td");
  const removeButton = document.createElement("button");

  removeButton.textContent = "Remove";
  removeButton.className = "action-button";

  removeButton.addEventListener("click", async () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete the vehicle: ${vehicle.licensePlate}?`
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await authenticatedFetch(
        `http://localhost:5055/courseWork/api/v1/vehicle/${vehicle.vehicleCode}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert(`Crop "${vehicle.licensePlate}" deleted successfully.`);
        row.remove();
      } else {
        const errorText = await response.text();
        alert(`Failed to delete crop: ${errorText}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the crop.");
    }
  });
  removeCell.appendChild(removeButton);
  row.appendChild(removeCell);

  // Append row to table
  vehicleTableList.appendChild(row);
};

// Fill form with vehicle data for updating
const fillFormWithVehicleData = (vehicle) => {
  document.getElementById("licensePlate").value = vehicle.licensePlate;
  document.getElementById("vehicleCategory").value = vehicle.category;
  document.getElementById("fuelType").value = vehicle.fuelType;
  document.getElementById("status").value = vehicle.status;
  document.getElementById("staff").value = vehicle.staffId;
  document.getElementById("remarks").value = vehicle.remarks;
};

const validateVehicleForm = () => {
  const licensePlate = document.getElementById("licensePlate").value;
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const remarks = document.getElementById("remarks").value;

  const fuelTypePattern = /^(Petrol|Diesel|Electric|Hybrid)$/;

  if (!licensePlate) {
    alert("License Plate cannot be empty.");
    return false;
  }

  if (!category || category.length < 3 || category.length > 50) {
    alert("Category must be between 3 and 50 characters.");
    return false;
  }

  if (!fuelType || !fuelTypePattern.test(fuelType)) {
    alert("Fuel Type must be one of the following: Petrol, Diesel, Electric, or Hybrid.");
    return false;
  }

  if (remarks.length > 255) {
    alert("Remarks must not exceed 255 characters.");
    return false;
  }

  return true;
};

// Handle form submission
vehicleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateVehicleForm()) {
    return;
  }

  const licensePlate = document.getElementById("licensePlate").value;
  const category = document.getElementById("vehicleCategory").value;
  const fuelType = document.getElementById("fuelType").value;
  const status = document.getElementById("status").value;
  const staffId = document.getElementById("staff").value;
  const remarks = document.getElementById("remarks").value;

  const vehicleData = {
    licensePlate,
    category,
    fuelType,
    status,
    staffId: staffId,
    remarks,
  };

  const url = isVehicleUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/vehicle/${currentVehicleCode}`
    : "http://localhost:5055/courseWork/api/v1/vehicle";
  const method = isVehicleUpdateMode ? "PATCH" : "POST";

  try {
    const response = await authenticatedFetch(url, {
      method : method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    });

    if (response.ok) {
      alert(isVehicleUpdateMode ? "Vehicle updated successfully!" : "Vehicle added successfully!");
      loadVehiclesIntoTable();
      closeVehicleModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

loadVehiclesIntoTable();