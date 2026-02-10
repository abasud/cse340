const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.inventoryRules = () => {
    return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty().withMessage("A name is required")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Remember that only letters and numbers are allowed. No spaces or special characters.")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
          errors,
          title: "Add classification",
          nav,
          classification_name,
        })
        return
      }
      next()
}

validate.addInventoryRules = () => {
  return [

    body("inv_make")
      .exists({ checkFalsy: true }).withMessage("Make is required")
      .bail()
      .trim()
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage("Only letters, numbers, and spaces allowed."),

    body("inv_model")
      .exists({ checkFalsy: true }).withMessage("Model is required")
      .bail()
      .trim()
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage("Only letters, numbers, and spaces allowed."),

    body("inv_year")
      .exists({ checkFalsy: true }).withMessage("Year is required")
      .bail()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Enter a valid year"),

    body("inv_description")
      .exists({ checkFalsy: true }).withMessage("Description is required")
      .bail()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be 500 characters or less"),

    body("inv_price")
      .exists({ checkFalsy: true }).withMessage("Price is required")
      .bail()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("inv_miles")
      .exists({ checkFalsy: true }).withMessage("Miles is required")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number"),

    body("inv_color")
      .exists({ checkFalsy: true }).withMessage("Color is required")
      .bail()
      .trim()
      .matches(/^[a-zA-Z0-9 ]+$/)
      .withMessage("Only letters, numbers, and spaces allowed."),

    body("classification_id")
      .exists({ checkFalsy: true })
      .withMessage("Classification is required")
      .bail()
      .isInt()
      .withMessage("Invalid classification"),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
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
    let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
          errors,
          title: "Add inventory",
          nav,
          select,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id,
        })
        return
      }
      next()
}

validate.checkUpdateData = async (req, res, next) => {
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
      classification_id,
      inv_id } = req.body
    let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildClassificationList()
        res.render("inventory/edit-inventory", {
          errors,
          title: "Edit inventory",
          nav,
          select,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id,
          inv_id
        })
        return
      }
      next()
}

module.exports = validate