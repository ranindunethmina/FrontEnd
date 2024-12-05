import { getCookie } from "./TokenController.js";

// Select Elements
var imageInput = document.getElementById("input-image");
var imageInputDiv = document.querySelector(".image-input");
const cropTableList = document.getElementById("crop-table-list");
const cropModal = document.getElementById("crop-modal");
const cropForm = document.getElementById("crop-form");
const cropButton = document.getElementById("crop-submit");

imageInputDiv.onclick = function () {
  imageInput.click();
};

imageInput.onchange = function () {
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = document.createElement("img");
    img.id = "crop-image-id";
    img.src = e.target.result;
    img.style.width = "100px";
    img.style.height = "100px";

    // Clear the div and add the new image
    imageInputDiv.innerHTML = "";
    imageInputDiv.appendChild(img);
  };

  // Read the image file as a data URL
  reader.readAsDataURL(this.files[0]);
};

const openCropModal = () => {
  cropModal.style.display = "block";
  cropForm.reset();
  imageInputDiv.innerHTML = "";
};

let isCropUpdateMode = false;
let currentCropCode = null;

const closeCropModal = () => {
  cropModal.style.display = "none";
  cropForm.reset();
  cropButton.textContent = "Add Crop";
  isCropUpdateMode = false;
  currentCropCode = null;
};

document
  .getElementById("add-crop")
  .addEventListener("click", openCropModal);
document
  .getElementById("crop-modal-close")
  .addEventListener("click", closeCropModal);

async function authenticatedFetch(url, options = {}) {
  const token = getCookie("authToken");

  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token}`;

  return fetch(url, { ...options, headers });
}

// Fetch all crops and populate the table
export async function loadCropsIntoTable() {
  try {
    const response = await authenticatedFetch(
      "http://localhost:5055/courseWork/api/v1/crops/allCrop", 
      { method: "GET"}
    );

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

  const imageCell = document.createElement("td");
  const image = document.createElement("img");

  const base64Image = crop.cropImage;

  const imageFormat = getImageFormat(base64Image);
  image.src = `data:${imageFormat};base64,${base64Image}`;
  image.className = "crop-image";
  image.style.width = "50px";
  image.style.height = "50px";
  imageCell.appendChild(image);
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
      const response = await authenticatedFetch(
        `http://localhost:5055/courseWork/api/v1/crops/${crop.cropCode}`,
        { method: "DELETE" }
      );

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

function getImageFormat(base64String) {
  const prefix = base64String.substr(0, 5);
  if (prefix === "/9j/4") return "image/jpeg";
  if (prefix === "iVBOR") return "image/png";
  return "image/png";
}

const fillFormWithCropData = (crop) => {
  // Populate text fields
  document.getElementById("cropCommonName").value = crop.commonName;
  document.getElementById("cropScientificName").value = crop.scientificName;
  document.getElementById("cropCategory").value = crop.category;
  document.getElementById("cropSeason").value = crop.season;
  document.getElementById("cropField").value = crop.fieldCode;

  // Populate image preview
  const base64Image = crop.cropImage; // Use the crop object directly
  if (base64Image) {
    const imageFormat = getImageFormat(base64Image);
    const img = document.createElement("img");
    img.src = `data:${imageFormat};base64,${base64Image}`;
    img.id = "crop-image-id";
    img.style.width = "100px";
    img.style.height = "100px";

    // Clear previous image and set new image
    imageInputDiv.innerHTML = "";
    imageInputDiv.appendChild(img);
  } else {
    imageInputDiv.innerHTML = "No Image Available";
  }
};

// Handle form submission
cropForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const commonName = document.getElementById("cropCommonName").value;
  const scientificName = document.getElementById("cropScientificName").value;
  const category = document.getElementById("cropCategory").value;
  const season = document.getElementById("cropSeason").value;
  const field = document.getElementById("cropField").value;
  
  // Validate form data
  if (!commonName) {
    alert("Common Name cannot be empty");
    return;
  }
  if (commonName.length < 3 || commonName.length > 100) {
    alert("Common Name must be between 3 and 100 characters");
    return;
  }
  if (scientificName.length > 150) {
    alert("Scientific Name must not exceed 150 characters");
    return;
  }
  if (category.length > 50) {
    alert("Category must not exceed 50 characters");
    return;
  }
  if (!field) {
    alert("Field Code cannot be empty");
    return;
  }

  const formData = new FormData();
  formData.append("commonName", commonName);
  formData.append("scientificName", scientificName);
  formData.append("category", category);
  formData.append("season", season);
  formData.append("fieldCode", field);

  let imageFile = imageInput.files[0];

  if (imageFile) {
    formData.append("cropImage", imageFile, imageFile.name);
  } else {
    formData.append("cropImage", new Blob(), "empty");
  }

  try {
    let url = "http://localhost:5055/courseWork/api/v1/crops";
    let method = isCropUpdateMode ? "PATCH" : "POST";
    let successMessage = isCropUpdateMode
      ? "Crop Updated Successfully"
      : "Crop Added Successfully";

  if (isCropUpdateMode) {
    url += `/${currentCropCode}`;
  }

  const response = await authenticatedFetch(url, {
      method: method,
      body: formData,
  });

    if (response.ok) {
      const result = await response.text();
      alert(successMessage);
      await loadCropsIntoTable();
      closeCropModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    alert("An error occurred while processing the crop data.");
  }
});

loadCropsIntoTable();