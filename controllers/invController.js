const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

const itemCont = {}

/* ***************************
 *  Build details page by item view
 * ************************** */
itemCont.buildByItemId = async function (req, res, next) {
  const item_id = req.params.itemId
  const data = await invModel.getCarByItemId(item_id)
  const carGrid = await utilities.buildItemDetailsGrid(data)
  let nav = await utilities.getNav()
  const carMake = data[0].inv_make
  const carModel = data[0].inv_model
  res.render("./inventory/item", {
    title: carMake + " " + carModel,
    nav,
    carGrid,
  })
}

const management = {}

management.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
    errors: null
  })
}

const classificationName = {}

classificationName.buildClassificationName = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add classification",
    nav,
    errors: null
  })
}

classificationName.regClassificationName = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regClassName = await invModel.registerClassName(classification_name)

  if (regClassName) {
    req.flash(
      "notice",
      `Nice! Your Classification name ${classification_name} was registered.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add classification",
      nav, 
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the name registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
      errors: null
    })
  }
}

const inventoryItem = {}

inventoryItem.buildInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  let select = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add inventory",
    nav,
    select,
    errors: null
  })
}

inventoryItem.regInventoryItem = async function (req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.buildClassificationList()

  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body

  const regVehicle = await invModel.registerVehicleData(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (regVehicle) {
    req.flash(
      "notice",
      `Perfect! Your vehicle ${inv_make} ${inv_model} was registered.`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add inventory",
      nav, 
      select,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the vehicle registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add inventory",
      nav,
      select,
      errors: null
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
inventoryItem.editInventoryItem = async function (req, res) {
  const inv_id = parseInt(req.params.itemId)
  let nav = await utilities.getNav()
  
  const itemData = await invModel.getCarByItemId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  let classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
inventoryItem.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {
    inv_id, 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body

  const updateVehicle = await invModel.updateVehicleData(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateVehicle) {
    req.flash(
      "notice",
      `Perfect! Your vehicle ${inv_make} ${inv_model} was updated.`
    )
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Builds the view to delete inventory confirmation
 * ************************** */
inventoryItem.buildDeleteView = async function (req, res) {
  const inv_id = parseInt(req.params.itemId)
  let nav = await utilities.getNav()
  
  const itemData = await invModel.getCarByItemId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
inventoryItem.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const { inv_id } = req.body

  const deletedVehicle = await invModel.deleteVehicleData(inv_id)

  if (deletedVehicle) {
    const itemName = `${deletedVehicle.inv_make} ${deletedVehicle.inv_model}`

    req.flash(
      "success",
      `The vehicle ${itemName} was deleted.`
    )
    res.redirect("/inv/management")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(500).render("inventory/delete-confirm", {
      title: "Delete Vehicle",
      nav,
      errors: null,
      inv_id
    })
  }
}

module.exports = { invCont, itemCont, management, classificationName, inventoryItem }