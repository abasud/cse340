// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const { invCont, itemCont } = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId))
router.get("/detail/:itemId", utilities.handleErrors(itemCont.buildByItemId))

module.exports = router;