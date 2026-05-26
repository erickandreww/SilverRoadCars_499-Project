const vehiclesModel = require('../models/vehicles');
const utilities = require('../utilities/index');

const getAllVehicles = async (req, res, next) => {
    try {
    const data =await vehiclesModel.getAllVehicles();
    const grid =await utilities.getVehiclesGrid(data);
    res.render("vehicles/vehicles", {
        title: "Vehicles",
        grid,
    })
    } catch (err) {
        next(err);
    }
}

const getCar = async (req, res, next) => {
    const carId = req.params.carId;
    try {
    const data = await vehiclesModel.getCar(carId);
    if (!data) {
        const err = new Error("Vehicle not found");
        err.status = 404;
        return next(err);
    }
    const carInformation = await utilities.getVehiclesGridId(data);

    res.render("vehicles/car", {
        title: data.brand + " " + data.model,
        carInformation,
    })
    } catch (err) {
        console.error(`error fetching vehicle with ID ${carId}:`, err);
        err.status = 400;
        next(err);
    }
}   

module.exports = {getAllVehicles, getCar}