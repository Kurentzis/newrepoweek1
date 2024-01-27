const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
debugger
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  console.log(req.params)
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
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

module.exports = invCont