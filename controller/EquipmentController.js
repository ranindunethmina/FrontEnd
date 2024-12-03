// Select Elements
const equipmentTableList = document.getElementById("equipment-table-list");
const equipmentModal = document.getElementById("equipment-modal");
const equipmentForm = document.getElementById("equipment-form");
const equipmentButton = document.getElementById("equipment-submit");
const addEquipmentButton = document.getElementById("add-equipment");

let isEquipmentUpdateMode = false;
let currentEquipmentId = null;

// Open the equipment modal
const openEquipmentModal = () => {
  equipmentModal.style.display = "block";
  if (!isEquipmentUpdateMode) {
    equipmentForm.reset(); // Reset form for adding a new equipment
  }
};

// Close the equipment modal
const closeEquipmentModal = () => {
  equipmentModal.style.display = "none";
  equipmentForm.reset();
  equipmentButton.textContent = "Add Equipment";
  isEquipmentUpdateMode = false;
  currentEquipmentId = null;
};

// Event Listeners for Modal Open/Close
addEquipmentButton.addEventListener("click", openEquipmentModal);
document.getElementById("equipment-modal-close").addEventListener("click", closeEquipmentModal);

// Fetch all equipment and populate the table
const loadEquipmentIntoTable = async () => {
  try {
    const response = await fetch("http://localhost:5055/courseWork/api/v1/equipment/allEquipment");
    if (!response.ok) {
      throw new Error(`Failed to fetch equipment: ${response.statusText}`);
    }
    const equipments = await response.json();
    equipmentTableList.innerHTML = "";
    equipments.forEach((equipment) => addEquipmentToTable(equipment));
  } catch (error) {
    console.error("Error loading equipment:", error);
  }
};

// Add a single equipment item to the table
const addEquipmentToTable = (equipment) => {
  const row = document.createElement("tr");

  const keys = ["equipmentId", "name", "type", "status", "staffId", "fieldCode"];
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = equipment[key];
    row.appendChild(cell);
  });

  // Add Update button
  const updateCell = document.createElement("td");
  const updateButton = document.createElement("button");

  updateButton.textContent = "Update";
  updateButton.className = "action-button";

  updateButton.addEventListener("click", () => {
    openEquipmentModal();
    fillFormWithEquipmentData(equipment);
    isEquipmentUpdateMode = true;
    currentEquipmentId = equipment.equipmentId;
    equipmentButton.textContent = "Update Equipment";
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
      const response = await fetch(`http://localhost:5055/courseWork/api/v1/equipment/${equipment.equipmentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        row.remove();
      } else {
        console.error("Failed to delete equipment");
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  });
  removeCell.appendChild(removeButton);
  row.appendChild(removeCell);

  // Append row to table
  equipmentTableList.appendChild(row);
};

// Fill form with equipment data for updating
const fillFormWithEquipmentData = (equipment) => {
  document.getElementById("name").value = equipment.name;
  document.getElementById("type").value = equipment.type;
  document.getElementById("status").value = equipment.status;
  document.getElementById("staff").value = equipment.staffId;
  document.getElementById("field").value = equipment.fieldCode;
};

// Handle form submission
equipmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const type = document.getElementById("type").value;
  const status = document.getElementById("status").value;
  const staffId = document.getElementById("staff").value;
  const fieldCode = document.getElementById("field").value;

  const equipmentData = {
    name,
    type,
    status,
    staffId: staffId,
    fieldCode: fieldCode,
  };

  const url = isEquipmentUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/equipment/${currentEquipmentId}`
    : "http://localhost:5055/courseWork/api/v1/equipment";
  const method = isEquipmentUpdateMode ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipmentData),
    });

    if (response.ok) {
      alert(isEquipmentUpdateMode ? "Equipment updated successfully!" : "Equipment added successfully!");
      loadEquipmentIntoTable();
      closeEquipmentModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    alert("An error occurred. Check the console for details.");
  }
});

// Initialize table on page load
loadEquipmentIntoTable();