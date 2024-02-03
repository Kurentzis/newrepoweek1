// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// 500 ERROR
router.get("/error/", invController.InternalErrShow)
module.exports = router;

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Route to build inventory detail
router.get("/detail/:itemId", utilities.handleErrors(invController.buildByItemId));

// Route to build management page
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification
router.get("/addClassification", utilities.handleErrors(invController.buildNewClass))

// Route to build add item
router.get("/addNewItem", utilities.handleErrors(invController.buildNewItem))


router.post('/addClassification',
            invValidate.classificationRules(),
            invValidate.checkClassData, 
            utilities.handleErrors(invController.addClassification)
            )

 router.post('/addNewItem',
            invValidate.itemRules(),
            invValidate.checkItemData, 
            utilities.handleErrors(invController.addItem)
            )