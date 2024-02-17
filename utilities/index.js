const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
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
            '<a href="/inventory/type/' +
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
            grid += '<a href = "../../inventory/detail/' + vehicle.inv_id
            +'" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src= "' + vehicle.inv_thumbnail
            + '" alt= "Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inventory/detail/' + vehicle.inv_id + '" title="View '
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
    // console.log(grid)
    return grid
}


Util.buildLoginGrid = async function(){
    let grid

    grid = `<div class="form-container">
        <form id="loginForm" action="/account/login" method="post">
            <div class="form-group">
                <label for="account_email">Email:</label>
                <input type="email" id="account_email" name="account_email" required>
            </div>
            <div class="form-group">
                <label for="account_password">Password:</label>
                <input type="password" id="account_password" name="account_password" required>
            </div>
            <div class="form-group">
                <input type="submit" value="LOGIN">
            </div>
            <div class="link-container"><a href="/account/register" title="Sign up?"> No account? <b>Sign-up</b></a></div>
        </form>
    </div>`

    
    return grid
}

Util.buildRegisterGrid = async function() {
    let grid

    grid = `<div class="form-container">
                <form action="/account/register" method="post">
                    <div class="form-group">
                        <label for="account_firstname">First name:</label>
                        <input type="text" id="account_firstname" name="account_firstname" required value="<%= locals.account_firstname %>">
                    </div>
                    <div class="form-group">
                        <label for="account_lastname">Last name:</label>
                        <input type="text" id="account_lastname" name="account_lastname" required value="<%= locals.account_lastname %>">
                    </div>
                    <div class="form-group">
                        <label for="account_email">Email:</label>
                        <input type="email" id="account_email" name="account_email" required value="<%= locals.account_email %>">
                    </div>
                    <div class="form-group">
                        <label for="account_password">Password:</label>
                        <input type="password" id="account_password" name="account_password" minlength="12" 
                        pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"
                        title="Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character">
                    </div>
                    
                    <div class="form-group">
                        <input type="submit" value="Register">
                    </div>
                    <span id='shwPrdBtn' onclick="shwPass(this)">Show password</span>
                </form>
            </div>`

    
    return grid
}


Util.buildManagementView = async function() {
    let grid
    // console.log("utils")
    grid = `<ul>
                <li><a href="/inv/add-classification/">Add a new classification</a></li>
                <li><a href="/newClassItem">Add new Item</a></li>
            </ul>`

    return grid
}




Util.getClassificationSelect = async function() {
    let data = await invModel.getClassifications()
    let select
    select = '<div>'
    data.rows.forEach((row) => {
        select += `<option value="${row.classification_id}">${row.classification_name}</option>`
    })
    select += '</div>'

    return select
}

Util.getClasses = async function() {
    let data = await invModel.getClassifications ()

    return data.rows
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



/********************************************
 * Middleware to check token validity
******************************************* */

Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if(err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    res.locals.loggedIn = 0; 
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.userName = accountData.account_firstname
                res.locals.loggedIn = 1
                next()
            })
    } else {
        res.locals.loggedIn = 0; 
        next()
    }
}

/*******************************************************
 * Check Authority
 *******************************************************/
Util.checkAdminAuthorization = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
            console.log(accountData.account_type)
            if (err) {
                console.log(err)
            } else {
                if (accountData.account_type === 'Admin' || accountData.account_type === 'Employee') {
                    next(); 
                } else {
                    req.flash("notice", "Please log in as admin or employee");
                    res.clearCookie("jwt");
                    res.locals.loggedIn = 0;
                    return res.redirect("/account/login");
                }
            }
        });
    } 
    else {
        req.flash("notice", "Please log in as admin or employee");
        res.clearCookie("jwt");
        res.locals.loggedIn = 0;
        return res.redirect("/account/login");
    }

}


/*******************************************************
 * Check Login
 *******************************************************/
Util.checkLogin = (req, res, next) => {
    if(res.locals.loggedIn) {
        next()
    } else {
        req.flash("Please log in")
        return res.redirect("/account/login")
    }
}


// Util.checkAdminAuthorization = (req, res, next) => {
//     if (req.cookies.jwt) {
//         jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
//             if (err) {
//                 console.log(err)
//             } else {
//                 if (accountData.account_type === 'Admin' || accountData.account_type === 'Employee') {
//                     next(); 
//                 } else {
//                     req.flash("notice", "Please log in as admin");
//                     res.clearCookie("jwt");
//                     res.locals.loggedIn = 0;
//                     return res.redirect("/account/login");
//                 }
//             }
//         });
//     } 
//     else {
//         req.flash("notice", "Please log in as admin");
//         res.clearCookie("jwt");
//         res.locals.loggedIn = 0;
//         return res.redirect("/account/login");
//     }

// }

module.exports = Util