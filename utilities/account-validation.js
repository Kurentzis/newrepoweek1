const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


//Registratiuon Data Validation Rules

validate.registrationRules = () => {
    return [
        //firstname is required and muist be string
        body("account_firstname")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a first name."),

        body("account_lastname")
            .trim()
            .isLength({min: 2})
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                  throw new Error("Email exists. Please log in or use different email")
                }
            }),

        body("account_password")
            .trim()
            .isStrongPassword({
              minLength: 12,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
            
    ]
}

validate.loginRules = () => [
  body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("A valid email is required.")
]

validate.accountUpdateRules = () => [
          body("account_firstname")
          .trim()
          .isLength({min: 1})
          .withMessage("Please provide a first name."),

        body("account_lastname")
          .trim()
          .isLength({min: 2})
          .withMessage("Please provide a last name."),

        body("account_email")
          .trim()
          .isEmail()
          .normalizeEmail()
          .withMessage("A valid email is required.")
          .custom(async (account_email) => {
              const emailExists = await accountModel.checkExistingEmail(account_email)
              if (emailExists){
                throw new Error("Email already exists.")
              }
          }),
]


validate.passwordUpdateRules = () => [
  body("account_password")
  .trim()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password does not meet requirements.")
]

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let form = await utilities.buildRegisterGrid()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        form,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }


  validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let form = await utilities.buildLoginGrid()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        form,
        account_email,
      })
      return
    }
    next()
  }

  validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/editAccount", {
        errors,
        title: `Edit ${account_firstname} ${account_lastname}`,
        nav,
        account_email,
        account_firstname,
        account_lastname,
        account_id 
      })
      return
    }
    next()
  }
  
  validate.checkUpdatePassword = async(req, res, next) => {
    const { account_password,  account_id  } = req.body
    let account_firstname = res.locals.accountData.account_firstname
    let account_lastname = res.locals.accountData.account_lastname
    let account_email = await accountModel.getAccountById(account_id)
    let mail = account_email.account_email
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let form = await utilities.buildLoginGrid()
      res.render("account/editAccount", {
        errors,
        title: `Edit ${account_firstname} ${account_lastname}`,
        nav,
        account_email: mail,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_id 
      })
      return
    }
    next()
  }
  module.exports = validate