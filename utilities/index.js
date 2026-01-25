const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span class=classification-price>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemDetailsGrid = async function(vehicle){
  let item
  if (vehicle.length > 0) {
    const car = vehicle[0]
    item = 
    `<div class="car-details">
      <img src="${car.inv_image}" alt="Image of ${car.inv_make} ${car.inv_model} on CSE Motors">
      <div class="car-details-info">
        <ul>
          <li><p><span class="car-data">Make:</span> ${car.inv_make}</p></li>
          <li><p><span class="car-data">Model:</span> ${car.inv_model}</p></li>
          <li><p><span class="car-data">Year:</span> ${car.inv_year}</p></li>
          <li><p><span class="car-data">Color:</span> ${car.inv_color}</p></li>
          <li><p><span class="car-data">Miles:</span><span> ${new Intl.NumberFormat('en-US').format(car.inv_miles)}</span></p></li>
        </ul>
        <h2><span>Price: $${new Intl.NumberFormat('en-US').format(car.inv_price)}</span></h2>
      </div>
      <p id="car-description"><span class="car-data">Description:</span> ${car.inv_description}</p>
    </div>`
  } else { 
    item = '<p class="notice">Sorry, the vehicle could not be found.</p>'
  }
  return item
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util