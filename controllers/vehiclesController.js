const vehiclesModel = require('../models/vehicles');
const utilities = require('../utilities/index');

const getAllVehicles = async (req, res, next) => {
    const data =await vehiclesModel.getAllVehicles();
    const grid =await utilities.getVehiclesGrid(data);
    res.render("vehicles/vehicles", {
        title: "Vehicles",
        grid,
    })
}

module.exports = {getAllVehicles}