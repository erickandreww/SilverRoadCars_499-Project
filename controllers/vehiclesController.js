const vehiclesModel = require('../models/vehicles');
const utilities = require('../utilities/index');
const { getPageOffset, getPaginationData } = require("../utilities/pagination");

const getAllVehicles = async (req, res, next) => {
    try {
    const vehicles = await vehiclesModel.getAllVehicles();
    res.render("vehicles/vehicles", {
        title: "Our Fleet",
        vehicles,
    })
    } catch (err) {
        next(err);
    }
}

const admGetAllVehicles = async (req, res, next) => {
  try {
    const { limit, offset } = getPageOffset(req, 8);

    const totalItems = await vehiclesModel.countAllVehicles();
    const vehicles = await vehiclesModel.admGetAllVehicles(limit, offset);

    const pagination = getPaginationData(req, totalItems, limit);

    res.render("vehicles/admVehicles", {
      title: "Vehicles",
      vehicles,
      pagination
    });
  } catch (err) {
    next(err);
  }
};

const getCar = async (req, res, next) => {
    const carId = req.params.carId;
    try {
    const vehicle = await vehiclesModel.getCar(carId);
    if (!vehicle) {
        const err = new Error("Vehicle not found");
        err.status = 404;
        return next(err);
    }
    const reviewsModel = require('../models/reviews');
    const reviews = await reviewsModel.getReviewsByVehicleId(carId);
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    res.render("vehicles/car", {
        title: vehicle.brand + " " + vehicle.model,
        vehicle,
        reviews,
        avgRating,
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
      errors: null,
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

const deleteCar = async (req, res, next) => {
  const { vehicleId } = req.body;
  try {
    const deleteResult = await vehiclesModel.deleteCar(vehicleId);

    if(!deleteResult) {
      const err = new Error("Car not found!")
      err.status = 404;
      return next(err)
    }

    return res.redirect("/admin/vehicles")

  } catch (err) {
    console.error(`Error deleting car with ID ${vehicleId}:`, err);
    err.status = 505;
    return next(err);
  }
}

module.exports = {getAllVehicles, getCar, admGetAllVehicles, admGetCar, buildCreateCar, createNewCar, updateCar, deleteCar}