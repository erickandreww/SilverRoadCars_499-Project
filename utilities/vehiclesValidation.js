const { body, validationResult } = require("express-validator");

const vehicleRules = () => {
  return [
    body("brand")
      .trim()
      .notEmpty()
      .withMessage("Brand is required."),

    body("model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("plate")
      .trim()
      .notEmpty()
      .withMessage("Plate is required."),

    body("year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1})
      .withMessage("Please enter a valid vehicle year."),

    body("transmission")
      .isIn(["automatic", "manual"])
      .withMessage("Please choose a valid transmission."),

    body("seats")
      .isInt({ min: 1})
      .withMessage("Seats must be at least 1."),

    body("mileage")
      .isInt({ min: 0 })
      .withMessage("Please enter a valid mileage."),

    body("dailyPrice")
      .isFloat({ min: 0 })
      .withMessage("Daily price must be 0 or higher."),

    body("availabilityStatus")
      .isIn(["available", "reserved", "rented", "maintenance"])
      .withMessage("Please choose a availability status."),
    
    body("maintenanceStatus")
      .isIn(["true", "false"])
      .withMessage("Please choose a valid maintenance status.")
  ];
}

const checkVehicleData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("vehicles/newCar", {
      title: "Create a New Car",
      errors,
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
      maintenanceStatus: req.body.maintenanceStatus
    });
  }

  next();
}

const checkUpdateVehicleData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("vehicles/editCar", {
      title: "Edit Car",
      errors,
      vehicleId: req.body.vehicleId,
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
      maintenanceStatus: req.body.maintenanceStatus
    });
  }

  next();
}

module.exports = { vehicleRules, checkVehicleData, checkUpdateVehicleData }