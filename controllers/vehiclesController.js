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

const admGetAllVehicles = async (req, res, next) => {
    try {
    const data =await vehiclesModel.getAllVehicles();
    const grid =await utilities.admGetVehiclesGrid(data);
    res.render("vehicles/admVehicles", {
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

const admGetCar = async (req,res, next) => {
  const car_id = req.params.vehicleId
  const data = await vehiclesModel.getCar(car_id)
  
  if (data) {
    res.render("vehicles/editCar", {
      title: "Edit Car",
      vehicleId: data.vehicleId,
      brand: data.brand,
      model: data.model,
      plate: data.plate,
      year: data.year,
      imageUrl: data.imageUrl,
      color: data.color,
      category: data.category,
      transmission: data.transmission,
      fuelType: data.fuelType,
      seats: data.seats,
      mileage: data.mileage,
      dailyPrice: data.dailyPrice,
      availabilityStatus: data.availabilityStatus,
      maintenanceStatus: data.maintenanceStatus,
    })
  } else {
    res.redirect("/admin/vehicles")
  }
}

const buildCreateCar = async (req, res, next) => {
  res.render("vehicles/newCar" , {
    title: "Create a New Car",
    errors: null
  })
}

const createNewCar = async (req, res, next) => {
  try {
    const {brand, model, plate, year, imageUrl, color, category, 
        transmission, fuelType, seats, mileage, dailyPrice, 
        availabilityStatus, maintenanceStatus} = req.body;
    
    const vehicleResult = await vehiclesModel.newCar(
      brand, model, plate, year, imageUrl, color, category,
      transmission, fuelType, seats, mileage, dailyPrice,
      availabilityStatus, maintenanceStatus
    );

    if (vehicleResult) {
      res.redirect("/admin/vehicles");
    }
  } catch (error) {
    console.error(error);

    res.render("vehicles/newCar", {
      title: "Create a New Car",
      errors: null,
      brand: req.body.brand,
      model: req.body.model,
      plate: req.body.plate,
      year: req.body.year,
      imageUrl: req.body.imageUrl,
      color: req.body.color,
      category: req.body.category,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      seats: req.body.seats,
      mileage: req.body.mileage,
      dailyPrice: req.body.dailyPrice,
      availabilityStatus: req.body.availabilityStatus,
      maintenanceStatus: req.body.maintenanceStatus,
    });
  }
};

const updateCar = async (req, res, next) => {
    try {
        const {vehicleId, brand, model, plate, year, imageUrl, color, 
            category, transmission, fuelType, seats, mileage, 
            dailyPrice, availabilityStatus, maintenanceStatus} = req.body;
        
        const updateResult = await vehiclesModel.updateCar(
        vehicleId, brand, model, plate, year, imageUrl, color, category,
        transmission, fuelType, seats, mileage, dailyPrice,
        availabilityStatus, maintenanceStatus
        );

        if (updateResult) {
            res.redirect("/admin/vehicles")
        } else {
            res.status(500).render("vehicles/editCar", {
                title: "Edit Car",
                vehicleId,
                brand,
                model,
                plate,
                year,
                imageUrl,
                color,
                category,
                transmission,
                fuelType,
                seats,
                mileage,
                dailyPrice,
                availabilityStatus,
                maintenanceStatus,
            })
        }
    } catch(error) {
        console.error(error)
        res.status(500).send("Update failed")
    }
}

module.exports = {getAllVehicles, getCar, admGetAllVehicles, admGetCar, buildCreateCar, createNewCar, updateCar}