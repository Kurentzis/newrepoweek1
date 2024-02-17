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
router.get("/inventory", utilities.checkAdminAuthorization, utilities.handleErrors(invController.buildManagement))
router.get("/", utilities.checkAdminAuthorization, utilities.handleErrors(invController.buildManagement))
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

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditItem))

router.post("/update",
            invValidate.itemRules(),
            invValidate.checkUpdateData, 
            utilities.handleErrors(invController.updateItem))


router.get("/delete/:inventory_id", utilities.handleErrors(invController.buildDeleteView))

router.post("/delete", utilities.handleErrors(invController.deleteItem))
