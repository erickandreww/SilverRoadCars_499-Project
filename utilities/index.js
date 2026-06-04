require("dotenv").config()
const Util = {}

Util.getUsersGrid = async function(data) {
  let grid = "";
  grid = '<a href="/admin/users/create">Create User</a>';
  if (data && data.length > 0) {
    grid += '<ul id="inv-display">';
    data.forEach(user => {
      grid += `<li> ${user.userName}, ${user.userEmail}, ${user.userPassword}, ${user.userRole}, ${user.userId} </li> 
      <a href="/admin/users/${user.userId}">Edit</a>`;
  });
  grid += "</ul>";
  } else { 
    grid += '<p class="notice">Sorry, no users could be found.</p>';
  }
  grid += '<a href="/admin">Return</a>';
  return grid;
}

Util.getVehiclesGrid = async function (data) {
  let grid = "";
  if (data && data.length > 0){
    grid = '<ul id="inv-display">';
    data.forEach(vehicle=>{
      grid += `<li>vehicle: ${vehicle.vehicleId} ${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.dailyPrice} </li>`
    })
    grid += "</ul>";
  }
    else {
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
}

Util.admGetVehiclesGrid = async function (data) {
  let grid = "";
  grid = '<a href="/admin/vehicles/create">Create Car</a>';
  if (data && data.length > 0){
    grid += '<ul id="inv-display">';
    data.forEach(vehicle=>{
      grid += `<li>vehicle: ${vehicle.vehicleId} ${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.dailyPrice} </li>
      <a href="/admin/vehicles/${vehicle.vehicleId}">Edit</a>`
    })
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  grid += '<a href="/admin">Return</a>';
  return grid;
}

Util.getVehiclesGridId = async function (data) {
  let carInformation = "";
  if (data){
    carInformation += `<p>vehicle: ${data.brand} ${data.model} ${data.year} ${data.imageUrl} ${data.color} ${data.category}
    ${data.fuelType} ${data.transmission} ${data.seats} ${data.mileage} ${data.maintenanceStatus} ${data.dailyPrice} </p>`; 
  }
  else {
      carInformation = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return carInformation;
}

module.exports = Util