const utilities = require("../utilities/")
const js = require('../public/js/script.js');
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


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
    // console.log(regResult)
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


/****************************************
 * Process update account info request
 * **************************************/
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    
    const {account_firstname, account_lastname, account_email, account_id} = req.body
    let accountName = account_firstname
    let accountType = res.locals.accountData.account_type
    let id = res.locals.accountData.account_id
    const editResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)
    // console.log(regResult)
    if(editResult) {
        req.flash(
            "notice", 
            `${account_firstname} your account info successfully updated!` 
        )
        res.status(201).render("account/accountManagement", {
            title: `Welcome ${account_firstname}`,
            nav,
            accountName,
            accountType,
            id
        })
    } else {
        req.flash("notice", "Sorry, update failed.")
        res.status(501).render("account/editAccount", {
            title: `Edit ${account_firstname} ${account_lastname}`,
            nav, 
            accountName,
            accountType,
            id
        })
    }
}

async function updatePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_email, account_id} = req.body
    let accountName = res.locals.accountData.account_firstname
    let account_lastname = res.locals.accountData.account_lastname
    let accountType = res.locals.accountData.account_type
    let id = res.locals.accountData.account_id

    //Hash the password before storing
    let hashedPassword
    try{
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error){
        req.flash("notice", "Sorry, there was an error updating your password.")
        res.status(500).render ("account/editAccount", {
            title:  `Edit ${accountName} ${account_lastname}`,
            nav,
            errors: null,
            account_firstname: accountName,
            account_lastname,
            account_email
        })
    }
    
    const editResult = await accountModel.updateAccountPassword(hashedPassword, account_id)
    // console.log(regResult)
    if(editResult) {
        req.flash(
            "notice", 
            `${accountName} your password successfully updated!` 
        )
        res.status(201).render("account/accountManagement", {
            title: `Welcome ${accountName}`,
            nav,
            accountName,
            accountType,
            id
        })
    } else {
        req.flash("notice", "Sorry, update failed.")
        res.status(501).render("account/editAccount", {
            title: `Edit ${accountName} ${account_lastname}`,
            nav, 
            accountName,
            accountType,
            id,
            account_email
        })
    }
}

/****************************************
 * Process login request
 * **************************************/
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    // console.log(account_email, account_password)
    const accountData = await accountModel.getAccountByEmail(account_email)
    let form = await utilities.buildLoginGrid()
    // console.log(accountData)
    if(!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            form
        })
        return
    }
    try{
        let hashedPassword = bcrypt.hashSync(account_password, 10)
        let test = await bcrypt.compare(account_password, accountData.account_password)
        if(test) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600* 1000 })
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            return res.redirect("/account/")
        }
    } catch(error) {
        return new Error('Access Forbidden')
    }
}

async function buildLoggedIn(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/logged", {
        title: "You are logged in!",
        nav
    })
}

async function logOut(req, res, next) {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
            if (err) {
                console.log(err)
            } else {
                if (res.locals.loggedIn == 0) {
                    next(); 
                } else {
                    req.flash("notice", "You are logged out!");
                    res.clearCookie("jwt");
                    res.locals.loggedIn = 0;
                    return res.redirect("/");
                }
            }
        });
    } 
}


async function buildAccountManageView(req, res, next) {
    let nav = await utilities.getNav()
    let accountType = res.locals.accountData.account_type
    let accountName = res.locals.accountData.account_firstname
    // let email = res.locals.accountData.account_email
    // let account_info = accountModel.getAccountByEmail(email)
    let id = res.locals.accountData.account_id
    res.render("account/accountManagement", {
        title: "Account Management",
        nav,
        accountType,
        accountName,
        id
    })
}


async function buildEditAccount(req, res, next) {
    let account_id = parseInt(req.params.id)
    let account_info = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    let accountName = `${account_info.account_firstname} ${account_info.account_lastname}`
    console.log(accountName)
    res.render("account/editAccount", { 
      title: `Edit ${accountName}`,
      nav,
      errors: null,
      account_firstname: account_info.account_firstname,
      account_lastname: account_info.account_lastname,
      account_email: account_info.account_email,
      account_id
    })
}

async function deleteAccount(req, res, next) {
    let account_id = parseInt(req.params.id)
    let account_info = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    let accountName = `${account_info.account_firstname} ${account_info.account_lastname}`
    console.log('deleteConfirm', accountName)
    res.render("account/deleteAccountConfirm", { 
        title: `Delete ${accountName} account`,
        nav,
        errors: null,
        account_firstname: account_info.account_firstname,
        account_lastname: account_info.account_lastname,
        account_email: account_info.account_email,
        account_id
      })
}


async function deleteAccountSubmit(req, res, next) {
    let account_id = parseInt(req.body.account_id)
    let account_info = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    let result = await accountModel.deleteAccountById(account_id)
    let form = await utilities.buildLoginGrid()

    if(result) {
        req.flash("notice", "Account deleted!");
        res.clearCookie("jwt");
        res.locals.loggedIn = 0;
        return res.redirect("/account/login");

        res.render("account/login", {
            title: "Home",
            errors: null,
            nav,
        })

    } else {
        res.render("account/deleteAccountConfirm", {
            title: "Delete",
            errors: null,
            nav,
            account_firstname: account_info.account_firstname,
            account_lastname: account_info.account_lastname,
            account_email: account_info.account_email,
            account_id
        })
    }
}
module.exports = {buildLogin, buildRegistration, registerAccount, accountLogin, buildLoggedIn, logOut, 
    buildAccountManageView, buildEditAccount, updateAccount, updatePassword, deleteAccount, deleteAccountSubmit}