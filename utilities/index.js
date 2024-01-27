const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title = "See our inventory of ' +
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
Util.buildClassificationGrid = async function(data) {
    let grid
    //console.log(data.length);
    if(data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href = "../../inv/detail/' + vehicle.inv_id
            +'" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src= "' + vehicle.inv_thumbnail
            + '" alt= "Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' </a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'  
        })
        grid += '</ul>'
    } else {
        grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
    }
    return grid
}

Util.buildItemGrid = async function(data){
    let grid
    if(data.length > 0) {
        grid = '<div id="item-display">'
        data.forEach(item => {
            // grid += '<p>'+ item.inv_description + '</p>'
            grid += `<div id="item_image">
                        <img src="${item.inv_image}" alt="big image of the vehicle">
                     </div>
                     <div class="vertical-line"></div>
                     <div id="item-description">
                        <h2>${item.inv_make} ${item.inv_model}</h2>
                        <h3>$${new Intl.NumberFormat('en-US').format(item.inv_price)}</h3>
                        <p><b>Color:</b> ${item.inv_color}</p>
                        <p><b>Mileage:</b> ${new Intl.NumberFormat('en-US').format(item.inv_miles)}</p>
                        <p><b>Year:</b> ${item.inv_year}</p>
                        <p>${item.inv_description}</p>
                     </div>`
        })
        grid += '</div>'
    }
    else {
        grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
    }
    console.log(grid)
    return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util