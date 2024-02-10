const pool = require("../database/")


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try{
        const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        console.log(sql)
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}



/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }
  

/****************************************
 * Return account data using mail
 ***************************************/
async function getAccountByEmail(account_email) {
  try{
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_type, account_password FROM account WHERE account_email = $1 `, 
      [account_email])
      console.log(result)
      return result.rows[0]
  } catch(error) {
    return new Error("Wrong email or password!!")
  }
}


async function getAccountById(account_id) {
  try{
    const result = await pool.query(
      `SELECT account_firstname, account_lastname, account_type, account_password, account_email FROM account WHERE account_id = $1 `, 
      [account_id])
      console.log(result)
      return result.rows[0]
  } catch(error) {
    return new Error("Wrong ID!!")
  }
}

async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id) {
  try{
      const sql =  `UPDATE account SET account_firstname=$1, account_lastname=$2, account_email=$3 WHERE account_id = $4 RETURNING *`
      const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
      console.log(data)
      return data.rows[0]
  } catch(error) {
    return error.message
  }
}

async function updateAccountPassword(account_password, account_id) {
  try{
    const sql =  `UPDATE account SET account_password=$1 WHERE account_id = $2 RETURNING *`
    const data = await pool.query(sql, [account_password, account_id])
    console.log(data)
    return data.rows[0]
} catch(error) {
  return error.message
}
}
module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountInfo, updateAccountPassword}