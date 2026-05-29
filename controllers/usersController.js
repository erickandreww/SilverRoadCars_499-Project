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

const getUserAdm = async (req,res, next) => {
  const user_Id = req.params.userId
  const data = await usersModel.getUserById(user_Id)
  
  if (data) {
    res.render("users/user", {
      title: "Edit User",
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userPassword: data.userPassword,
      userRole: data.userRole,
    })
  } else {
    res.redirect("/admin/users")
  }
}

const buildCreateUser = async (req, res, next) => {
  res.render("users/newUser" , {
    title: "Create a New User",
    errors: null
  })
}

const createNewUser = async (req, res, next) => {
  try {
    const {userName, userEmail, userPassword, userRole} = req.body;
    const userResult = await usersModel.createNewUser(
      userName, userEmail, userPassword, userRole
    );

    if (userResult) {
      res.redirect("/admin/users");
    }
  } catch (error) {
    console.error(error);

    res.render("users/newUser", {
      title: "Create a New User",
      errors: null,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userRole: req.body.userRole
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
  const {userId, userName, userEmail, userPassword, userRole} = req.body;
  const updateResult = await usersModel.updateUser(
    userId, userName, userEmail, userPassword, userRole
  );
  
  if (updateResult) {
    res.redirect("/admin/users")
  } else {
    res.status(500).render("users/user", {
      title: "Edit User ",
      userId,
      userName,
      userEmail,
      userPassword,
      userRole,
    })
  }
  } catch(error) {
    console.error(error)
    res.status(500).send("Update failed")
  }
}

module.exports = { getAllUsers, getUserAdm, updateUser, buildCreateUser, createNewUser }