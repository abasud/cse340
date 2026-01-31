const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accounts = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accounts.buildLogin))
router.get("/registration", utilities.handleErrors(accounts.buildRegister))

// Process the registration data
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accounts.registerAccount)
)

module.exports = router;