document.getElementById("home-button").addEventListener("click", function () {
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("home-page").style.display = "flex";
});
  
//   document.getElementById("customer-button").addEventListener("click", function () {
//     document.getElementById("home-page").style.display = "none";
//     document.getElementById("order-page").style.display = "none";
//     document.getElementById("customer-page").style.display = "flex";
//     document.getElementById("item-page").style.display = "none";
  
//     //Load customers
//     loadCustomersIntoTable();
//   });
  
//   document.getElementById("order-button").addEventListener("click", function () {
//     document.getElementById("home-page").style.display = "none";
//     document.getElementById("order-page").style.display = "flex";
//     document.getElementById("customer-page").style.display = "none";
//     document.getElementById("item-page").style.display = "none";
  
  
//     //Poupulate Methods
//     populateCustomerDropdown();
//     populateOrderItems();
//     loadOrderId();
//   });
  
//   document.getElementById("item-button").addEventListener("click", function () {
//     document.getElementById("home-page").style.display = "none";
//     document.getElementById("order-page").style.display = "none";
//     document.getElementById("customer-page").style.display = "none";
//     document.getElementById("item-page").style.display = "flex";
  
//     //Load items
//     loadItemsIntoTable();
//   });

document.getElementById("field-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("vehicle-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
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
  document.getElementById("staff-page").style.display = "flex";

  // Load staff
  loadStaffIntoTable();
});

// document.getElementById("log-button").addEventListener("click", function () {
//   document.getElementById("home-page").style.display = "none";
//   document.getElementById("field-page").style.display = "none";
//   document.getElementById("crop-page").style.display = "none";
//   document.getElementById("staff-page").style.display = "none";
//   document.getElementById("vehicle-page").style.display = "none";
//   document.getElementById("equipment-page").style.display = "none";
//   document.getElementById("log-page").style.display = "flex";

//   // Load logs
//   loadLogsIntoTable();
// });

document.getElementById("vehicle-button").addEventListener("click", function () {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("field-page").style.display = "none";
  document.getElementById("crop-page").style.display = "none";
  document.getElementById("staff-page").style.display = "none";
  document.getElementById("equipment-page").style.display = "none";
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
  document.getElementById("equipment-page").style.display = "flex";

  // Load equipment
  loadEquipmentIntoTable();
});