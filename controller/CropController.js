// Select Elements
const cropTableList = document.getElementById("crop-table-list");
const cropModal = document.getElementById("crop-modal");
const cropForm = document.getElementById("crop-form");
const cropButton = document.getElementById("crop-submit");
const cropImageInput = document.getElementById("cropImage");
const addCropButton = document.getElementById("add-crop");

let isCropUpdateMode = false;
let currentCropCode = null;

// Open the crop modal
const openCropModal = () => {
  cropModal.style.display = "block";
  if (!isCropUpdateMode) {
    cropImageInput.value = ""; // Clear file input
  }
};

// Close the crop modal
const closeCropModal = () => {
  cropModal.style.display = "none";
  cropForm.reset();
  cropButton.textContent = "Add Crop";
  isCropUpdateMode = false;
  currentCropCode = null;
};

// Event Listeners for Modal Open/Close
addCropButton.addEventListener("click", openCropModal);
document
  .getElementById("crop-modal-close")
  .addEventListener("click", closeCropModal);

// Fetch all crops and populate the table
const loadCropsIntoTable = async () => {
  try {
    const response = await fetch("http://localhost:5055/courseWork/api/v1/crops/allCrop");
    if (!response.ok) {
      throw new Error(`Failed to fetch crops: ${response.statusText}`);
    }
    const crops = await response.json();
    cropTableList.innerHTML = "";
    crops.forEach((crop) => addCropToTable(crop));
  } catch (error) {
    console.error("Error loading crops:", error);
  }
};

// Add a single crop to the table
const addCropToTable = (crop) => {
  const row = document.createElement("tr");

  const keys = ["cropCode", "commonName", "scientificName", "category", "season", "fieldCode"];
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = crop[key];
    row.appendChild(cell);
  });

  // Add crop image
  const imageCell = document.createElement("td");
  const img = document.createElement("img");
  img.src = `data:image/png;base64,${crop.cropImage}`;
  img.style.width = "50px";
  img.style.height = "50px";
  imageCell.appendChild(img);
  row.appendChild(imageCell);

  // Add Update button
  const updateCell = document.createElement("td");
  const updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.className = "action-button";
  updateButton.addEventListener("click", () => {
    openCropModal();
    fillFormWithCropData(crop);
    isCropUpdateMode = true;
    currentCropCode = crop.cropCode;
    cropButton.textContent = "Update Crop";
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
      const response = await fetch(`http://localhost:5055/courseWork/api/v1/crops/${crop.cropCode}`, {
        method: "DELETE",
      });
      if (response.ok) {
        row.remove();
      } else {
        console.error("Failed to delete crop");
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
    }
  });
  removeCell.appendChild(removeButton);
  row.appendChild(removeCell);

  // Append row to table
  cropTableList.appendChild(row);
};

// Fill form with crop data for updating
const fillFormWithCropData = (crop) => {
  document.getElementById("cropCode").value = crop.cropCode;
  document.getElementById("cropCommonName").value = crop.commonName;
  document.getElementById("cropScientificName").value = crop.scientificName;
  document.getElementById("cropCategory").value = crop.category;
  document.getElementById("cropSeason").value = crop.season;
  document.getElementById("cropField").value = crop.fieldCode;

  // Add image preview
  const img = document.createElement("img");
  img.src = `data:image/png;base64,${crop.cropImage}`;
  img.style.width = "100px";
  img.style.height = "100px";
  const imagePreview = document.querySelector(".crop-form-row-image");
  imagePreview.appendChild(img);
};

// Handle form submission
cropForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cropCode = document.getElementById("cropCode").value;
  const commonName = document.getElementById("cropCommonName").value;
  const scientificName = document.getElementById("cropScientificName").value;
  const category = document.getElementById("cropCategory").value;
  const season = document.getElementById("cropSeason").value;
  const field = document.getElementById("cropField").value;

  const formData = new FormData();
  formData.append("cropCode", cropCode);
  formData.append("commonName", commonName);
  formData.append("scientificName", scientificName);
  formData.append("category", category);
  formData.append("season", season);
  formData.append("fieldCode", field);

  if (cropImageInput.files[0]) {
    formData.append("cropImage", cropImageInput.files[0]);
  }

  const url = isCropUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/crops/${currentCropCode}`
    : "http://localhost:5055/courseWork/api/v1/crops";
  const method = isCropUpdateMode ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (response.ok) {
      alert(isCropUpdateMode ? "Crop updated successfully!" : "Crop added successfully!");
      loadCropsIntoTable();
      closeCropModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Initialize table on page load
loadCropsIntoTable();