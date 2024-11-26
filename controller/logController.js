// Select Elements
const logTableList = document.getElementById("log-table-list");
const logModal = document.getElementById("log-modal");
const logForm = document.getElementById("log-form");
const logButton = document.getElementById("log-submit");
const addLogButton = document.getElementById("add-log");

let isLogUpdateMode = false;
let currentLogCode = null;

// Open the log modal
const openLogModal = () => {
  logModal.style.display = "block";
  logForm.reset();
  logButton.textContent = "Add Log";
};

// Close the log modal
const closeLogModal = () => {
  logModal.style.display = "none";
  logForm.reset();
  isLogUpdateMode = false;
  currentLogCode = null;
};

// Event Listeners for Modal Open/Close
addLogButton.addEventListener("click", openLogModal);
document.getElementById("log-modal-close").addEventListener("click", closeLogModal);

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

  // Add table cells for each key
  keys.forEach((key) => {
    const cell = document.createElement("td");
    cell.textContent = log[key] || "N/A";
    row.appendChild(cell);
  });

  // Image column
  const imageCell = document.createElement("td");
  imageCell.innerHTML = log.observedImage ? `<img src="${log.observedImage}" alt="Image" width="50" height="50" />` : "N/A";
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
      const response = await fetch(`http://localhost:5055/courseWork/api/v1/logs/${log.logCode}`, {
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

// Fill form with log data for updating
const fillFormWithLogData = (log) => {
//   document.getElementById("logCode").value = log.logCode || "";
  document.getElementById("logDate").value = log.logDate || "";
  document.getElementById("logDetails").value = log.details || "";
  document.getElementById("observedImage").value = log.observedImage || "";
  document.getElementById("field").value = log.field || "";
  document.getElementById("crop").value = log.crop || "";
  document.getElementById("staff").value = log.staff || "";
};

// Handle form submission
logForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const logData = {
    // logCode: document.getElementById("logCode").value,
    logDate: document.getElementById("logDate").value,
    details: document.getElementById("logDetails").value,
    observedImage: document.getElementById("observedImage").files[0]?.name || "N/A",
    field: document.getElementById("field").value,
    crop: document.getElementById("crop").value,
    staff: document.getElementById("staff").value,
  };

  const url = isLogUpdateMode
    ? `http://localhost:5055/courseWork/api/v1/logs/${currentLogCode}`
    : "http://localhost:5055/courseWork/api/v1/logs";
  const method = isLogUpdateMode ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method,
      body: logData,
    });

    if (response.ok) {
      alert(isLogUpdateMode ? "Log updated successfully!" : "Log added successfully!");
      loadLogsIntoTable();
      closeLogModal();
    } else {
      const errorText = await response.text();
      alert(`Operation failed: ${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Initialize table on page load
loadLogsIntoTable();