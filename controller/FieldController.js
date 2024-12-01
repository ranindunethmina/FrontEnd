// Select Elements
var imageInput1 = document.getElementById("field-image-1");
var imageInputDiv1 = document.querySelector(".image-input-1");
var imageInput2 = document.getElementById("field-image-2");
var imageInputDiv2 = document.querySelector(".image-input-2");
const fieldTableList = document.getElementById("field-table-list");
const fieldModal = document.getElementById("field-modal");
const fieldForm = document.getElementById("field-form");
const fieldButton = document.getElementById("field-submit");

imageInputDiv1.onclick = function () {
  imageInput1.click();
};

imageInput1.onchange = function () {
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = document.createElement("img");
    img.id = "field-image-id1";
    img.src = e.target.result;
    img.style.width = "100px";
    img.style.height = "100px";

    // Clear the div and add the new image
    imageInputDiv1.innerHTML = "";
    imageInputDiv1.appendChild(img);
  };

  // Read the image file as a data URL
  reader.readAsDataURL(this.files[0]);
};

imageInputDiv2.onclick = function () {
  imageInput2.click();
};

imageInput2.onchange = function () {
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = document.createElement("img");
    img.id = "field-image-id2";
    img.src = e.target.result;
    img.style.width = "100px";
    img.style.height = "100px";

    // Clear the div and add the new image
    imageInputDiv2.innerHTML = "";
    imageInputDiv2.appendChild(img);
  };

  // Read the image file as a data URL
  reader.readAsDataURL(this.files[0]);
};

const openFieldModal = () => {
  fieldModal.style.display = "block";
  fieldForm.reset();
  imageInputDiv1.innerHTML = "";
  imageInputDiv2.innerHTML = "";

  if (!isFieldUpdateMode) {
    currentFieldCode = null;
  }
};

let isFieldUpdateMode = false;
let currentFieldCode = null;

// Close the field modal
const closeFieldModal = () => {
  fieldModal.style.display = "none";
  fieldForm.reset();
  fieldButton.textContent = "Add Field";
  isFieldUpdateMode = false;
  currentFieldCode = null;
};

// Event Listeners for Modal Open/Close
document
  .getElementById("add-field")
  .addEventListener("click", openFieldModal);
document
  .getElementById("field-modal-close")
  .addEventListener("click", closeFieldModal);

// Fetch all fields and populate the table
const loadFieldIntoTable = async () => {
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
  const keys = ["fieldCode", "fieldName", "extentSize"];

  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = field[key];
    row.appendChild(cell);
  });

  const locationCell = document.createElement("td");
  locationCell.textContent = `${field.location.x},${field.location.y}`;
  row.appendChild(locationCell);

  // Add field images
  const image1Cell = document.createElement("td");
  const img1 = document.createElement("img");

  const base64Image1 = field.fieldImage1;

  const imageFormat1 = getImageFormat(base64Image1);
  img1.src = `data:${imageFormat1};base64,${base64Image1}`;
  img1.className = "field-image-1";
  img1.style.width = "50px";
  img1.style.height = "50px";
  image1Cell.appendChild(img1);
  row.appendChild(image1Cell);

  const image2Cell = document.createElement("td");
  const img2 = document.createElement("img");

  const base64Image2 = field.fieldImage2;

  const imageFormat2 = getImageFormat(base64Image2);
  img2.src = `data:${imageFormat2};base64,${base64Image2}`;
  img2.className = "field-image-2"; 
  img2.style.width = "50px";
  img2.style.height = "50px";
  image2Cell.appendChild(img2);
  row.appendChild(image2Cell);

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

function getImageFormat(base64String) {
  const prefix = base64String.substr(0, 5);
  if (prefix === "/9j/4") return "image/jpeg";
  if (prefix === "iVBOR") return "image/png";
  return "image/png";
}

// Fill form with field data for updating
const fillFormWithFieldData = (field) => {
  document.getElementById("name").value = field.fieldName;
  document.getElementById("location").value = `${field.location.x},${field.location.y}`;
  document.getElementById("size").value = field.extentSize;

  // Clear and add first image
  const img1 = document.createElement("img");
  const base64Image1 = field.fieldImage1; // Handle missing image
  const imageFormat1 = getImageFormat(base64Image1);
  img1.src = base64Image1 ? `data:${imageFormat1};base64,${base64Image1}` : "";
  img1.id = "field-image-id1";
  img1.style.width = "100px";
  img1.style.height = "100px";

  imageInputDiv1.innerHTML = "";
  imageInputDiv1.appendChild(img1);

  // Clear and add second image
  const img2 = document.createElement("img");
  const base64Image2 = field.fieldImage2; // Handle missing image
  const imageFormat2 = getImageFormat(base64Image2);
  img2.src = base64Image2 ? `data:${imageFormat2};base64,${base64Image2}` : "";
  img2.id = "field-image-id2";
  img2.style.width = "100px";
  img2.style.height = "100px";

  imageInputDiv2.innerHTML = "";
  imageInputDiv2.appendChild(img2);
};

// Handle form submission
fieldForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const locationInput = document.getElementById("location").value;
  const size = document.getElementById("size").value;

  const [latitude, longitude] = locationInput.split(",").map(coord => parseFloat(coord.trim()));
  if (isNaN(latitude) || isNaN(longitude)) {
    alert("Please enter a valid location in the format: latitude,longitude");
    return;
  }

  const location = `${latitude},${longitude}`; // Format as "latitude,longitude"

  const formData = new FormData();
  formData.append("fieldName", name);
  formData.append("fieldLocation", location);
  formData.append("fieldSize", size);

  let imageFile1 = imageInput1.files[0];
  if (imageFile1) {
    formData.append("fieldImage1", imageFile1, imageFile1.name);
  } else {
    formData.append("fieldImage1", new Blob(), "empty");
  }
  
  let imageFile2 = imageInput2.files[0];
  if (imageFile2) {
    formData.append("fieldImage2", imageFile2, imageFile2.name);
  } else {
    formData.append("fieldImage2", new Blob(), "empty");
  }

  const staffIds = document.getElementById("staff-ids")?.value || ""; // Get staff IDs or default to empty
  const staffIdArray = staffIds.split(",").map(id => id.trim()).filter(id => id); // Split and clean

  if (staffIdArray.length === 0) {
    formData.append("staffIds", ""); // Send an empty value if no staffIds provided
  } else {
    staffIdArray.forEach((staffId, index) => {
      formData.append(`staffIds[${index}]`, staffId); // Append each staffId
    });
  }

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
      loadFieldIntoTable();
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
loadFieldIntoTable();