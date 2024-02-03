const utilities = require("../utilities/")
const js = require('../public/js/script.js');
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req,res,next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildLoginGrid()
    res.render("account/login", {
        title: "Login",
        nav,
        form
    })
}


async function buildRegistration(req, res,next) {
    let nav = await utilities.getNav()
    let form = await utilities.buildRegisterGrid()
    // let hi = await utilities.sayHi()
    res.render("account/register", {
        title: "Register",
        nav,
        form,
        errors: null
        // utils : js
    })
}


// Process  Registration
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    let form = await utilities.buildLoginGrid()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    //Hash the password before storing
    let hashedPassword
    try{
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error){
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render ("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
    console.log(regResult)
    if(regResult) {
        req.flash(
            "notice", 
            `Congratulations! You are registered ${account_firstname}. Please log in` 
        )
        res.status(201).render("account/login", {
            title: "Login",
            form,
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav
        })
    }
}

module.exports = {buildLogin, buildRegistration, registerAccount}