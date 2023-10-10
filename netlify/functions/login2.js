const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
const db = require('./dbusingpgpromise.js');

exports.handler = async function (event, context) {

  console.log(event.httpMethod)
  console.log(event.headers)
  let json_msg = {}
  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "POST",
      },
    };
  }
  else if(event.httpMethod == 'POST'){
    
    console.log(process.env.DB_URL)
    let user = JSON.parse(event.body).username
    let pass = JSON.parse(event.body).password
    console.log(user)
    console.log(pass)
    
    //const client = await pg.connect()
    try {

      const result = await db.query('select id, "username", "password", "role_user", "email", "phone_no", "anper" from "users" where "username"=$1', [user])
      console.log(result)
      json_msg.result = result;
      //json_msg = result
      console.log(result.length)
      if (result.length > 0) {
        console.log(result[0].password)
        const valid = bcryptjs.compareSync(pass, result[0].password)
        if (valid) {
          console.log('User [' + user + '] has logged in.');
          const body = event.body;
          const ptoken = jwt.sign({ user: body }, "TOP_SECRET");
          json_msg.result = "OK"
          json_msg.message = "Login OK"
          json_msg.user_id = result[0].id
          json_msg.username = result[0].username
          json_msg.role_user = result[0].role_user
          json_msg.email = result[0].email
          json_msg.phone_no = result[0].phone_no
          json_msg.anper = result[0].anper
          json_msg.token = ptoken
          //json_msg = '{ result: "OK", message: "Login OK", user_id: ' + result[0].id + ', username: ' + result[0].username + ', role_user: ' + result[0].role_user + ', email: ' + result[0].email + ', token: ' + ptoken + ' }'
          //return res.status(200).json({ result: "OK", message: "Login OK", user_id: result[0].id, username: result[0].username, role_user: result[0].role_user, email: result[0].email, token: ptoken });
        } else {
          console.log("compareSync return false")
          json_msg.result = "Not Ok"
          json_msg.message = "Incorrect username or password"
          //json_msg = '{ result: "Not Ok", message: "Incorrect username or password" }'
          //return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
        }
      }
      else {

        json_msg.result = "Not Ok"
        json_msg.message = "Incorrect username or password2"
        //json_msg = '{ result: "Not Ok", message: "Incorrect username or password2" }'
        //return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
      }
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error "+e

      //json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
      //return res.status(500).json({ result: "Error", message: "Server Error" + e })
    }
    //console.log("login LEWAT SINI")

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json_msg),
    };
  }
  else{
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json_msg),
    };
  }
}
