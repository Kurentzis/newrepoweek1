// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/logout", utilities.handleErrors(accountController.logOut))

router.get('/register', utilities.handleErrors(accountController.buildRegistration))


router.post('/register',
            regValidate.registrationRules(),
            regValidate.checkRegData, 
            utilities.handleErrors(accountController.registerAccount)
            )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
  )

  router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLoggedIn))
module.exports = router

router.get('/manageAccount', utilities.handleErrors(accountController.buildAccountManageView))

router.get('/edit/:id', utilities.handleErrors(accountController.buildEditAccount))

router.post('/update_account',
            regValidate.accountUpdateRules(),
            regValidate.checkUpdateData, 
            utilities.handleErrors(accountController.updateAccount)  
)



router.post("/update_password",
            regValidate.passwordUpdateRules(),
            regValidate.checkUpdatePassword, 
            utilities.handleErrors(accountController.updatePassword)
)