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

module.exports = { invCont, itemCont }