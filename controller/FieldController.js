// Select Elements
var imageInput1 = document.getElementById("input-image-1");
var imageInput2 = document.getElementById("input-image-2");
var imageInputDiv1 = document.querySelector(".image-input-1");
var imageInputDiv2 = document.querySelector(".image-input-2");
const fieldTableList = document.getElementById("field-table-list");
const fieldModal = document.getElementById("field-modal");
const fieldForm = document.getElementById("field-form");
const fieldButton = document.getElementById("field-submit");

// Open the modal
const openFieldModal = () => {
  fieldModal.style.display = "block";
  if (!isFieldUpdateMode) {
    imageInputDiv1.innerHTML = "";
    imageInputDiv2.innerHTML = "";
  }
};

// Close the modal
const closeFieldModal = () => {
  fieldModal.style.display = "none";
  fieldForm.reset();
  fieldButton.textContent = "Add Field";
  isFieldUpdateMode = false;
  currentFieldId = null;
};

let isFieldUpdateMode = false;
let currentFieldId = null;

document.getElementById("add-field").addEventListener("click", openFieldModal);
document
  .getElementById("field-modal-close")
  .addEventListener("click", closeFieldModal);

// Handle image selection for the first input
imageInputDiv1.onclick = function () {
  imageInput1.click();
};

imageInput1.onchange = function () {
  handleImagePreview(this.files[0], imageInputDiv1);
};

// Handle image selection for the second input
imageInputDiv2.onclick = function () {
  imageInput2.click();
};

imageInput2.onchange = function () {
  handleImagePreview(this.files[0], imageInputDiv2);
};

// Function to handle image preview
function handleImagePreview(file, targetDiv) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.width = "100px";
    img.style.height = "100px";
    targetDiv.innerHTML = "";
    targetDiv.appendChild(img);
  };
  reader.readAsDataURL(file);
}

// Load fields into the table
const loadFieldsIntoTable = async () => {
  try {
    const response = await fetch("http://localhost:5055/courseWork/api/v1/field/allField");
    if (!response.ok) throw new Error(`Failed to load fields: ${response.statusText}`);
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

  // Add text cells
  ["fieldCode", "fieldName", "location", "extentSize"].forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = field[key];
    row.appendChild(cell);
  });

  // Add image cells
  ["fieldImage1", "fieldImage2"].forEach((key) => {
    const cell = document.createElement("td");
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${field[key]}`;
    img.style.width = "50px";
    img.style.height = "50px";
    cell.appendChild(img);
    row.appendChild(cell);
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
    currentFieldId = field.fieldCode;
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

  fieldTableList.appendChild(row);
};

// Fill form with field data for updating
const fillFormWithFieldData = (field) => {
  document.getElementById("name").value = field.fieldName;
  document.getElementById("location").value = field.location;
  document.getElementById("size").value = field.extentSize;

  // Add image previews
  handleImagePreviewFromBase64(field.fieldImage1, imageInputDiv1);
  handleImagePreviewFromBase64(field.fieldImage2, imageInputDiv2);
};

function handleImagePreviewFromBase64(base64Image, targetDiv) {
  const img = document.createElement("img");
  img.src = `data:image/png;base64,${base64Image}`;
  img.style.width = "100px";
  img.style.height = "100px";
  targetDiv.innerHTML = "";
  targetDiv.appendChild(img);
}

// Handle form submission
fieldForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const size = document.getElementById("size").value;

  const formData = new FormData();
  formData.append("fieldName", name);
  formData.append("location", location);
  formData.append("extentSize", size);

  if (imageInput1.files[0]) formData.append("fieldImage1", imageInput1.files[0]);
  if (imageInput2.files[0]) formData.append("fieldImage2", imageInput2.files[0]);

  const url = isFieldUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/field/${currentFieldId}`
    : "http://localhost:5055/courseWork/api/v1/field";
  const method = isFieldUpdateMode ? "PUT" : "POST";

  try {
    const response = await fetch(url, { method, body: formData });
    if (response.ok) {
      alert(isFieldUpdateMode ? "Field updated successfully!" : "Field added successfully!");
      await loadFieldsIntoTable();
      closeFieldModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Load fields on page load
loadFieldsIntoTable();