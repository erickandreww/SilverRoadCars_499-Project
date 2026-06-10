const maintenanceModel = require('../models/maintenance');
const vehiclesModel = require('../models/vehicles');

const getAllMaintenances = async (req, res, next)  => {
  try {
    const data = await maintenanceModel.getAllMaintenances();

    res.render("maintenance/maintenance", {
      title: "Maintenance", 
      data
    });
  } catch (err) {
    next(err);
  }
}

const getMaintenance = async (req, res, next) => {
  const maintenanceId = req.params.maintenanceId;
  try {
    const data = await maintenanceModel.getMaintenance(maintenanceId);
    const vehicles = await vehiclesModel.getAllVehicles();

    if (!data) {
      const err = new Error("Maintenance record not found");
      err.status = 404;
      return next(err);
    }

    res.render("maintenance/editMaintenance", {
      title: "Edit Maintenance Record",
      errors: null,
      vehicles,
      maintenanceId: data.maintenanceId,
      vehicleId: data.vehicleId,
      maintenanceType: data.maintenanceType,
      description: data.description,
      maintenanceDate: data.maintenanceDate,
      cost: data.cost,
      status: data.status
    })
  } catch (err) {
    next(err);
  }
}

const buildCreateMaintenance = async (req, res, next) => {
  try {
    const vehicles = await vehiclesModel.getAllVehicles();

    res.render("maintenance/newMaintenance", {
      title: "Create Maintenance Record",
      errors: null,
      vehicles
    });
  } catch (err) {
    next(err);
  }
}

const createMaintenance = async (req, res, next) => {
  try {
    const {vehicleId, maintenanceType, description, 
      maintenanceDate, cost, status} = req.body;
    
    const createdBy = req.authUser.userId;

    const result = await maintenanceModel.newMaintenance(
      vehicleId, createdBy, maintenanceType, description, 
      maintenanceDate, cost, status
    );

    if (result) {
      return res.redirect("/users/maintenance");
    }

    res.status(500).send("Maintenance creation failed");
  } catch (err) {
    next(err);
  }
}

const updateMaintenance = async (req, res, next) => {
  try {
    const {maintenanceId, vehicleId, maintenanceType,
      description, maintenanceDate, cost, status} = req.body;

    const result = await maintenanceModel.updateMaintenance(
      maintenanceId, vehicleId, maintenanceType, 
      description, maintenanceDate, cost, status
    );

    if (result) {
      return res.redirect("/users/maintenance");
    }

    res.status(500).send("Maintenance update failed");
  } catch (err) {
    next(err);
  }
};

const deleteMaintenance = async (req, res, next) => {
  const { maintenanceId } = req.body;
  try {
    const deleteResult = await maintenanceModel.deleteMaintenance(maintenanceId);

    if(!deleteResult) {
      const err = new Error("Maintenance record not found!")
      err.status = 404;
      return next(err)
    }

    return res.redirect("/users/maintenance")

  } catch (err) {
    return next(err);
  }
}

module.exports = { getAllMaintenances, getMaintenance, buildCreateMaintenance, createMaintenance, updateMaintenance, deleteMaintenance}