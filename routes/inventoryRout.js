// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// 500 ERROR
router.get("/error/", invController.InternalErrShow)
module.exports = router;

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build inventory detail
router.get("/detail/:itemId", utilities.handleErrors(invController.buildByItemId));


