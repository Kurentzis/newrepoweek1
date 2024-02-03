const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")


//Registratiuon Data Validation Rules

validate.classificationRules = () => {
    return [
        //firstname is required and muist be string
        body("classification_name")
            .trim()
            .isLength({min: 2})
            .withMessage("Please provide a classification name.")
            .custom(value => !/\s/.test(value)),
    ]
}



/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/addClassification", {
        title: "Add new catalog",
        errors,
        nav,
        classification_name
      })
      return
    }
    next()
  }
  
  module.exports = validate






  
validate.itemRules = () => {
  return [
      //firstname is required and muist be string
      body("classification_id")
          .notEmpty()
          .withMessage("Please select a classification."),

      body("inv_make")
          .trim()
          .isLength({min: 3})
          .withMessage("Please provide a make."),

      body("inv_model")
          .trim()
          .isLength({min: 2})
          .withMessage("Please provide a model."),

      body("inv_description")
          .trim()
          .isLength({min: 10})
          .withMessage("Please provide a description."),

      body("inv_image")
          .trim()
          .isLength({min: 2})
          .withMessage("Please provide an image path."),

      body("inv_thumbnail")
          .trim()
          .isLength({min: 2})
          .withMessage("Please provide an image path."),

      body("inv_price")
          .trim()
          .isLength({min: 1})
          .withMessage("Only decimals and integers are allowed.")
          .custom(value => /^\d*\.?\d*$/.test(value)),

      body("inv_year")
          .trim()
          .isLength({min: 1})
          .withMessage("Please provide a 4-digit year.")
          .custom(value => /^\d{4}$/.test(value)),

      body("inv_miles")
          .trim()
          .isLength({min: 1})
          .withMessage("Only digits.")
          .custom(value => /^\d*\//.test(value)),

      body("inv_color")
          .trim()
          .isLength({min: 3})
          .withMessage("Please provide a color.")

  ]
}
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkItemData = async (req, res, next) => {
  const { classification_id,  inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  let select = await utilities.getClassificationSelect()
  let options = await utilities.getClasses()
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addNewItem", {
      title: "Add new Item",
      errors,
      nav,
      select,
      options,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}

module.exports = validate