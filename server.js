/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use((req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()

  const status = err.status || 500

  console.error(`Error at: "${req.originalUrl}":`, err)

  let message

  if (status === 404) {
    message = err.message
  } else if (status === 500) {
    message = 'Our servers ran into a problem. Please try again in a few minutes.'
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }

  res.render("errors/error", {
    title: status === 404 ? 'Error 404: Page Not Found' : 'Error 500: Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on http://${host}:${port}`)
})
