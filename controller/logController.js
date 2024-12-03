// Select Elements
var imageInput = document.getElementById("observedImage");
var imageInputDiv = document.querySelector(".image-input");
const logTableList = document.getElementById("log-table-list");
const logModal = document.getElementById("log-modal");
const logForm = document.getElementById("log-form");
const logButton = document.getElementById("log-submit");

imageInputDiv.onclick = function () {
  imageInput.click();
};

imageInput.onchange = function () {
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = document.createElement("img");
    img.id = "log-image-id";
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

const openLogModal = () => {
  logModal.style.display = "block";
  logForm.reset();
  imageInputDiv.innerHTML = "";
};

let isLogUpdateMode = false;
let currentLogCode = null;

const closeLogModal = () => {
  logModal.style.display = "none";
  logForm.reset();
  logButton.textContent = "Add Log";
  isLogUpdateMode = false;
  currentLogCode = null;
};

document
  .getElementById("add-log")
  .addEventListener("click", openLogModal);
document
  .getElementById("log-modal-close")
  .addEventListener("click", closeLogModal);

// Fetch all logs and populate the table
const loadLogsIntoTable = async () => {
  try {
    const response = await fetch("http://localhost:5055/courseWork/api/v1/logs/allLogs");
    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.statusText}`);
    }
    const logs = await response.json();
    logTableList.innerHTML = "";
    logs.forEach((log) => addLogToTable(log));
  } catch (error) {
    console.error("Error loading logs:", error);
  }
};

// Add a single log entry to the table
const addLogToTable = (log) => {
  const row = document.createElement("tr");
  const keys = ["logCode", "details", "logDate"];
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = log[key];
    row.appendChild(cell);
  });

  const imageCell = document.createElement("td");
  const image = document.createElement("img");

  const base64Image = log.observedImage;
  
  const imageFormat = getImageFormat(base64Image);
  image.src = `data:${imageFormat};base64,${base64Image}`;
  image.className = "log-image";
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
    openLogModal();
    fillFormWithLogData(log);
    isLogUpdateMode = true;
    currentLogCode = log.logCode;
    logButton.textContent = "Update Log";
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
      const response = await fetch(`http://localhost:5055/courseWork/api/v1/logs/${log.logCode}`,{
        method: "DELETE",
      });
      if (response.ok) {
        row.remove();
      } else {
        console.error("Failed to delete log");
      }
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  });
  removeCell.appendChild(removeButton);
  row.appendChild(removeCell);

  // Append row to table
  logTableList.appendChild(row);
};

function getImageFormat(base64String) {
  const prefix = base64String.substr(0, 5);
  if (prefix === "/9j/4") return "image/jpeg";
  if (prefix === "iVBOR") return "image/png";
  return "image/png";
}

const fillFormWithLogData = (log) => {
    // Populate text fields
  document.getElementById("logDate").value = log.logDate;
  document.getElementById("logDetails").value = log.details;
  document.getElementById("field").value = log.fieldCodes;
  document.getElementById("crop").value = log.cropCodes;
  document.getElementById("staff").value = log.staffIds;
  
  console.log(log); // Debug log data

  const base64Image = log.observedImage;
  if(base64Image) {
    const imageFormat = getImageFormat(base64Image);
    const img = document.createElement("img");
    img.src = `data:${imageFormat};base64,${base64Image}`;
    img.id = "log-image-id";
    img.style.width = "100px";
    img.style.height = "100px";

    imageInputDiv.innerHTML = "";
    imageInputDiv.appendChild(img);
  }else{
    imageInputDiv.innerHTML = "No Image Available";
  }  
};

// Handle form submission
logForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const logDate = document.getElementById("logDate").value;
  const logDetails = document.getElementById("logDetails").value;
  const field = document.getElementById("field").value;
  const crop = document.getElementById("crop").value;
  const staff = document.getElementById("staff").value;

  const formData = new FormData();
  formData.append("logDate", logDate);
  formData.append("details", logDetails);
  formData.append("fieldCodes", field);
  formData.append("cropCodes", crop);
  formData.append("staffIds", staff);

  let imageFile = imageInput.files[0];

  if (imageFile) {
    formData.append("observedImage", imageFile, imageFile.name);
  } else {
    formData.append("observedImage", new Blob(), "empty");
  }

  try {
    let url = "http://localhost:5055/courseWork/api/v1/logs";
    let method = isLogUpdateMode ? "PATCH" : "POST";
    let successMessage = isLogUpdateMode
      ? "Log Updated Successfully"
      : "Log Added Successfully";
  
  if (isLogUpdateMode) {
    url += `/${currentLogCode}`;
  }
  
  const response = await fetch(url, {
    method: method,
    body: formData,
  });
  
    if (response.ok) {
      const result = await response.text();
      alert(successMessage);
      await loadLogsIntoTable();
      closeLogModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    alert("An error occurred. Check the console for details.");
  }
});

loadLogsIntoTable();