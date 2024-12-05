import { loadCropsIntoTable } from "./CropController.js";
import { loadFieldIntoTable } from "./FieldController.js";
import { loadVehiclesIntoTable } from "./VehicleController.js";
import { loadStaffIntoTable } from "./StaffController.js";
import { loadEquipmentIntoTable } from "./EquipmentController.js"; 
import { loadLogsIntoTable } from "./logController.js";

document.getElementById("home-button").addEventListener("click", function () {
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("log-page").style.display = "none";
  document.getElementById("home-page").style.display = "flex";
});

document.getElementById("field-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
  document.getElementById("log-page").style.display = "none";
  document.getElementById("field-page").style.display = "flex";

  // Load field
  loadFieldIntoTable();
});

document.getElementById("crop-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";  
  document.getElementById("log-page").style.display = "none";
  document.getElementById("crop-page").style.display = "flex";

  // Load crops
  loadCropsIntoTable();
});

document.getElementById("staff-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
  document.getElementById("log-page").style.display = "none";
  document.getElementById("staff-page").style.display = "flex";

  // Load staff
  loadStaffIntoTable();
});

document.getElementById("log-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
  document.getElementById("log-page").style.display = "flex";

  // Load logs
  loadLogsIntoTable();
});

document.getElementById("vehicle-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
  document.getElementById("log-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "flex";

  // Load vehicles
  loadVehiclesIntoTable();
});

document.getElementById("equipment-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("log-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "flex";

  // Load equipment
  loadEquipmentIntoTable();
});