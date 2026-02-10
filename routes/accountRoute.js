const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accounts = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accounts.buildLogin))
router.get("/registration", utilities.handleErrors(accounts.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accounts.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accounts.accountLogin)
)

router.get(
  "/accountManagement", 
  utilities.checkLogin, 
  utilities.handleErrors(accounts.buildAccountManagement))

router.get("/user-update/:userID", utilities.handleErrors(accounts.viewUpdateUserData))
router.post(
  "/update-account",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.userUpdateRules(),
  regValidate.checkUserUpdateData,
  utilities.handleErrors(accounts.registerUserUpdate)
)
router.post(
  "/update-password",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accounts.registerNewPassword)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" })
  req.flash("success", "Your session was closed.")
  res.redirect("/")
})

module.exports = router;