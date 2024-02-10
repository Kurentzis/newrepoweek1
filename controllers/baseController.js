const utilities = require('../utilities/')
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    // checkJWTTokenconst loggedInState = utilities.checkJWTToken()
    const loggedIn = res.locals.loggedIn
    const userName = res.locals.userName
    req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", 
    nav, 
    loggedIn,
    userName
})
}

module.exports = baseController