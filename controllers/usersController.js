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
  try {
    const data = await usersModel.getUserById(user_Id)

    if(!data) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err)
    }
    
    res.render("users/user", {
      title: "Edit User",
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userPassword: data.userPassword,
      userRole: data.userRole,
    })
  } catch (err) {
    console.error(`error fetching user with ID ${user_Id}:`, err);
    err.status = 400;
    next(err);
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

const deleteUser = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const deleteResult = await usersModel.deleteUser(userId);

    if (!deleteResult) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    return res.redirect("/admin/users");

  } catch (err) {
    console.error(`Error deleting user with ID ${userId}:`, err);
    err.status = 500;
    return next(err);
  }
};

module.exports = { getAllUsers, getUserAdm, updateUser, buildCreateUser, createNewUser, deleteUser }