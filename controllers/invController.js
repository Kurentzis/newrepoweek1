const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  console.log(req.params)
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className
  try{
    className = data[0].classification_name
  } catch {
    className = 'No'
  }
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory detail
 * ************************** */
invCont.buildByItemId = async function (req, res, next) {
  const item_id = req.params.itemId
  const data = await invModel.getItemById(item_id)
  const grid = await utilities.buildItemGrid(data)
  let nav = await utilities.getNav()
  const itemName = data[0].inv_make
  const itemModel = data[0].inv_model
  const itemYear = data[0].inv_year
  res.render("./inventory/itemDetail", {
    title: `${itemName} ${itemModel} ${itemYear}`,//${itemYear}
    nav,
    grid,
  })
}

// 500 ERROR
invCont.InternalErrShow = async function (req, res, next){
  let nav = await utilities.getNav()
  const data = await invModel.getItemByIdErr()
  res.render("error"), {
    // title: `${data[0].inv_make}`,
    nav
  }
}


/* ***************************
 *  Build inventory manager
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const grid = await utilities.buildManagementView()
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
   // grid,
  })
}

/* ***************************
 *  Add new class 
 * ************************** */
invCont.buildNewClass = async function (req, res, next) {
  const grid = await utilities.buildManagementView()
  let nav = await utilities.getNav()
  res.render("inventory/addClassification", { 
    title: "Add new catalog",
    nav,
    grid,
    errors: null
  })
}


// Process add classification async function 
invCont.addClassification = async function(req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.getClassificationSelect()
  const { classification_name } = req.body
  console.error("addClassification")
  const addResult = await invModel.addClass(classification_name)
  console.log(addResult)
  if(addResult) {
      req.flash(
          "notice", 
          `Congratulations! You added ${classification_name} catalog.` 
      )
      res.status(201).render("inventory/management", {
          title: "Add new Item",
          errors: null,
          //select,
          nav,
      })
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("inventory/addClassification", {
          title: "Add new catalog",
          nav,
          errors: null
      })
  }
}




/* ***************************
 *  Add new inventory item 
 * ************************** */
invCont.buildNewItem = async function (req, res, next) {
  let select = await utilities.getClassificationSelect()
  let options = await utilities.getClasses()
  let nav = await utilities.getNav()
  res.render("inventory/addNewItem", { 
    title: "Add new inventory Item",
    nav,
    select,
    options,
    errors: null
  })
}



// Process add new inventory async function 
invCont.addItem = async function(req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.getClassificationSelect()
  let options = await utilities.getClasses()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail,  inv_price,  inv_year,  inv_miles,  inv_color} = req.body
  const addResult = await invModel.addItem( classification_id,  inv_make, inv_model, inv_description, inv_image, inv_thumbnail,  inv_price,  inv_year,  inv_miles,  inv_color)
  console.log(addResult)
  if(addResult) {
      req.flash(
          "notice", 
          `Congratulations! You added new item!.` 
      )
      res.status(201).render("inventory/management", {
          title: "Inventory Management",
          errors: null,
          //select,
          nav,
      })
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("inventory/addNewItem", {
          title: "Add new Item",
          nav,
          select,
          options,
          errors: null
      })
  }
}


module.exports = invCont