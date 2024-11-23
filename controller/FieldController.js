// Select Elements
const fieldTableList = document.getElementById("field-table-list");
const fieldModal = document.getElementById("field-modal");
const fieldForm = document.getElementById("field-form");
const fieldButton = document.getElementById("field-submit");
const fieldImageInputs = document.querySelectorAll(".image-input");
const addFieldButton = document.getElementById("add-field");

let isFieldUpdateMode = false;
let currentFieldCode = null;

// Open the field modal
const openFieldModal = () => {
  fieldModal.style.display = "block";
  if (!isFieldUpdateMode) {
    fieldImageInputs.forEach((inputDiv) => (inputDiv.innerHTML = ""));
  }
};

// Close the field modal
const closeFieldModal = () => {
  fieldModal.style.display = "none";
  fieldForm.reset();
  fieldButton.textContent = "Add Field";
  isFieldUpdateMode = false;
  currentFieldCode = null;
};

document
  .getElementById("add-field")
  .addEventListener("click", openFieldModal);
document
  .getElementById("field-modal-close")
  .addEventListener("click", closeFieldModal);

// Handle file input selection
fieldImageInputs.forEach((inputDiv, index) => {
  inputDiv.onclick = () => {
    const hiddenInput = inputDiv.nextElementSibling;
    hiddenInput.click();
  };

  const inputFile = inputDiv.nextElementSibling;
  inputFile.onchange = function () {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "100px";
      img.style.height = "100px";
      inputDiv.innerHTML = "";
      inputDiv.appendChild(img);
    };
    reader.readAsDataURL(this.files[0]);
  };
});

// Fetch all fields and populate the table
const loadFieldsIntoTable = async () => {
  try {
    const response = await fetch("http://localhost:5055/courseWork/api/v1/field/allField");
    if (!response.ok) {
      throw new Error(`Failed to fetch fields: ${response.statusText}`);
    }
    const fields = await response.json();
    fieldTableList.innerHTML = "";
    fields.forEach((field) => addFieldToTable(field));
  } catch (error) {
    console.error("Error loading fields:", error);
  }
};

// Add a single field to the table
const addFieldToTable = (field) => {
  const row = document.createElement("tr");

  const keys = ["fieldCode", "fieldName", "location", "extentSize"];
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = key === "location" ? `${field.location.x},${field.location.y}` : field[key];
    row.appendChild(cell);
  });

  // Add field images
  ["fieldImage1", "fieldImage2"].forEach((imageKey) => {
    const imageCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${field[imageKey]}`;
    img.style.width = "50px";
    img.style.height = "50px";
    imageCell.appendChild(img);
    row.appendChild(imageCell);
  });

  // Add Update button
  const updateCell = document.createElement("td");
  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.className = "action-button";
  updateButton.addEventListener("click", () => {
    openFieldModal();
    fillFormWithFieldData(field);
    isFieldUpdateMode = true;
    currentFieldCode = field.fieldCode;
    fieldButton.textContent = "Update Field";
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
      const response = await fetch(`http://localhost:5055/courseWork/api/v1/field/${field.fieldCode}`, {
        method: "DELETE",
      });
      if (response.ok) {
        row.remove();
      } else {
        console.error("Failed to delete field");
      }
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  });
  removeCell.appendChild(removeButton);
  row.appendChild(removeCell);

  // Append row to table
  fieldTableList.appendChild(row);
};

// Fill form with field data for updating
const fillFormWithFieldData = (field) => {
  document.getElementById("fieldcode").value = field.fieldCode;
  document.getElementById("name").value = field.fieldName;
  document.getElementById("location").value = `${field.location.x},${field.location.y}`;
  document.getElementById("size").value = field.extentSize;

  // Add images to form
  [field.fieldImage1, field.fieldImage2].forEach((imageBase64, index) => {
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${imageBase64}`;
    img.style.width = "100px";
    img.style.height = "100px";
    fieldImageInputs[index].innerHTML = "";
    fieldImageInputs[index].appendChild(img);
  });
};

// Handle form submission
fieldForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fieldCode = document.getElementById("fieldcode").value;
  const fieldName = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const extentSize = parseFloat(document.getElementById("size").value);

  const formData = new FormData();
  formData.append("fieldName", fieldName);
  formData.append("fieldLocation", location);
  formData.append("fieldSize", extentSize);

  fieldImageInputs.forEach((inputDiv, index) => {
    const fileInput = inputDiv.nextElementSibling;
    if (fileInput.files[0]) {
      formData.append(`fieldImage${index + 1}`, fileInput.files[0]);
    }
  });

  const url = isFieldUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/field/${currentFieldCode}`
    : "http://localhost:5055/courseWork/api/v1/field";
  const method = isFieldUpdateMode ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (response.ok) {
      alert(isFieldUpdateMode ? "Field updated successfully!" : "Field added successfully!");
      loadFieldsIntoTable();
      closeFieldModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Initialize table on page load
loadFieldsIntoTable();
