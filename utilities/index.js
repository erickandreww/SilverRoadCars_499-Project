require("dotenv").config()
const Util = {}

Util.getUsersGrid = async function(data) {
    let grid = "";
    if (data && data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach(user => {
        grid += `<li> ${user.userName}</li>`;
    });
    grid += "</ul>";
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
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

Util.getVehiclesGridId = async function (data) {
  let carInformation = "";
  if (data){
    carInformation += `<p>vehicle: ${data.brand} ${data.model} ${data.year} ${data.dailyPrice} </p>`; 
  }
  else {
      carInformation = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return carInformation;
}

module.exports = Util