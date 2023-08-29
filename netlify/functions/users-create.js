const db = require('./dbusingpgpromise.js');
const bcryptjs = require('bcryptjs')

exports.handler = async function (event, context) {
  console.log(event.httpMethod)
  let json_msg = {};
  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
    };
  }
  else {
    let lusername = JSON.parse(event.body).username
    let lemail = JSON.parse(event.body).email
    let lpassword = JSON.parse(event.body).password
    let lphone_no = JSON.parse(event.body).phone_no
    let lrole_user = JSON.parse(event.body).role_user
    console.log(lusername)
    console.log(lemail)
    console.log(lpassword)
    console.log(lphone_no)
    console.log(lrole_user)
    try {
      const hash = bcryptjs.hashSync(lpassword, 10)
      const result = await db.query('INSERT INTO users (username, email, password, phone_no, role_user, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', 
        [lusername, lemail, hash, lphone_no, lrole_user])
      console.log(result)
      json_msg = result;
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error "+e
      //json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json_msg),
    };
  }
}