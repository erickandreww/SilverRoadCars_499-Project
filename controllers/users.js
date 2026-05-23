const usersModel = require("../models/users")
const utilities = require("../utilities/index")

const getAllUsers = async (req,res, next) => {
  // const user_Id = req.params.userId
  const data = await usersModel.getAllUsers()
  const grid = await utilities.getUsersGrid(data)
  res.render("users/users", {
    title: "Users",
    grid,
  })
}

module.exports = {getAllUsers}