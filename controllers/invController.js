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
  // const classificationSelect = await utilities.getClassificationSelect()
  const classificationSelect = await utilities.getClasses()
  console.log(classificationSelect)
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
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


// Process update inventory async function 
invCont.updateItem = async function(req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.getClassificationSelect()
  let classificationSelect = await utilities.getClasses()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail,  inv_price,  inv_year,  inv_miles,  inv_color, inv_id} = req.body
  const updateResult = await invModel.editItem( classification_id,  inv_make, inv_model, inv_description, inv_image, inv_thumbnail,  inv_price,  inv_year,  inv_miles,  inv_color, inv_id)
  const itemName = `${inv_make} ${inv_model}`
  if(updateResult) {
      req.flash(
          "notice", 
          `The ${itemName} was successfully update!` 
      )
      res.render("inventory/management", {
          title: "Inventory Management",
          errors: null,
          select,
          classificationSelect,
          nav,
      })
  } else {

      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
          title: `Edit ${itemName}`,
          nav,
          select,
          errors: null,
          classificationSelect,
          classification_id,
          inv_make,
          inv_model,
          inv_description,
          inv_image,
          inv_thumbnail, 
          inv_price, 
          inv_year, 
          inv_miles, 
          inv_color,
          inv_id
      })
  }
}



// Process delete inventory async function 
invCont.deleteItem = async function(req, res) {
  let nav = await utilities.getNav()
  let select = await utilities.getClassificationSelect()
  let classificationSelect = await utilities.getClasses()

  const {inv_make, inv_model, inv_price, inv_year, inv_id} = req.body
  const updateResult = await invModel.deleteItem(parseInt(inv_id))
  const itemName = `${inv_make} ${inv_model}`
  if(updateResult) {
      req.flash(
          "notice", 
          `The ${itemName} was successfully deleted!` 
      )
      res.render("inventory/management", {
          title: "Inventory Management",
          errors: null,
          select,
          classificationSelect,
          nav,
      })
  } else {

      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("/delete/:inventory_id", {
          title: `Delete ${itemName}`,
          nav,
          errors: null,
          inv_make,
          inv_model,
          inv_price, 
          inv_year, 
          inv_id
      })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  console.log(invData)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


// Render an Update vehicle view!
invCont.buildEditItem = async(req,res,next) => {
  let inventory_id = parseInt(req.params.inventory_id)
  let select = await utilities.getClassificationSelect()
  let options = await utilities.getClasses()
  let invItem = await invModel.getItemById(inventory_id)
  let nav = await utilities.getNav()
  let itemName = `${invItem[0].inv_make} ${invItem[0].inv_model}`
  console.log(invItem)
  res.render("inventory/edit-inventory", { 
    title: `Edit ${itemName}`,
    nav,
    select,
    options,
    errors: null,
    inv_id: inventory_id,
    inv_make: invItem[0].inv_make,
    inv_model: invItem[0].inv_model,
    inv_description: invItem[0].inv_description,
    inv_image: invItem[0].inv_image,
    inv_thumbnail: invItem[0].inv_thumbnail, 
    inv_price: invItem[0].inv_price, 
    inv_year: invItem[0].inv_year, 
    inv_miles: invItem[0].inv_miles, 
    inv_color: invItem[0].inv_color,
    classification_id: invItem[0].classification_id
  })
}


// Render delete vehicle view!
invCont.buildDeleteView = async(req,res,next) => {
  let inventory_id = parseInt(req.params.inventory_id)
  let invItem = await invModel.getItemById(inventory_id)
  let nav = await utilities.getNav()
  let itemName = `${invItem[0].inv_make} ${invItem[0].inv_model}`
  console.log(invItem)
  res.render("inventory/delete-confirm", { 
    title: `Delete ${itemName}`,
    nav,
    errors: null,
    inv_id: inventory_id,
    inv_make: invItem[0].inv_make,
    inv_model: invItem[0].inv_model,
    inv_price: invItem[0].inv_price, 
    inv_year: invItem[0].inv_year, 
  })
}

module.exports = invCont