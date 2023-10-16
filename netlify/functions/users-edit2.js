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
    let paramid = event.queryStringParameters.id;
    console.log("param id: " + paramid)
    let lusername = JSON.parse(event.body).username
    let lemail = JSON.parse(event.body).email
    let lpassword = JSON.parse(event.body).password
    let lphone_no = JSON.parse(event.body).phone_no
    let lrole_user = JSON.parse(event.body).role_user
    let lanper = JSON.parse(event.body).anper
    console.log(lusername)
    console.log(lemail)
    console.log(lpassword)
    console.log(lphone_no)
    console.log(lrole_user)
    console.log(lanper)
    try {
      const result = await db.query('select password from users where id=$1', [paramid])      
      if (lpassword !== result[0].password) {
        console.log("password changed...")
        let hash = bcryptjs.hashSync(lpassword, 10)
        lpassword = hash
      }
      const result2 = await db.query('UPDATE users SET username = $1, email = $2, password=$3, phone_no=$4, role_user=$5, anper=$6, updated_at=CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [lusername, lemail, lpassword, lphone_no, lrole_user, lanper, paramid])
      console.log(result2)
      json_msg = result2;
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error " + e
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