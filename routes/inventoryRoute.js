// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const { invCont, itemCont, management, classificationName, inventoryItem } = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId))
router.get("/detail/:itemId", utilities.handleErrors(itemCont.buildByItemId))

router.get(
  "/management", 
  utilities.checkLogin,
  utilities.checkProfile,
  utilities.handleErrors(management.buildManagement))

router.get(
  "/newClassification", 
  utilities.checkProfile,
  utilities.handleErrors(classificationName.buildClassificationName))
router.post(
    "/add-classification",
    utilities.checkProfile,
    regValidate.inventoryRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(classificationName.regClassificationName))

router.get(
  "/newInventory", 
  utilities.checkProfile,
  utilities.handleErrors(inventoryItem.buildInventoryItem))
router.post(
  "/add-inventory",
  utilities.checkProfile,
  regValidate.addInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(inventoryItem.regInventoryItem))

router.get(
  "/getInventory/:classification_id", 
  utilities.checkProfile,
  utilities.handleErrors(invCont.getInventoryJSON))

// Route to build the view where we edit the inventory item.
router.get(
  "/edit/:itemId", 
  utilities.checkProfile,
  utilities.handleErrors(inventoryItem.editInventoryItem))
router.post(
  "/update-inventory",
  utilities.checkProfile,
  regValidate.addInventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(inventoryItem.updateInventory)
)

router.get(
  "/delete/:itemId", 
  utilities.checkProfile,
  utilities.handleErrors(inventoryItem.buildDeleteView))
router.post(
  "/delete-inventory",
  utilities.checkProfile,
  utilities.handleErrors(inventoryItem.deleteInventory)
)
module.exports = router;