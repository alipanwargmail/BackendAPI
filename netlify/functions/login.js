const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
const pg = require('./databasefunction.js')

exports.handler = async function (event, context) {

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
    console.log(event.httpMethod)
    let user = JSON.parse(event.body).username
    let pass = JSON.parse(event.body).password
    let json_msg = "";
    const client = await pg.connect()
    try {
      client.query('select id, "username", "password", "role_user", "email" from "users" where "username"=$1', [username], (err, result) => {
        if (err) {
          status = 401;
          json_msg = { result: "ERR", message: "Unauthorized" }
          //return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        else {
          if (result.rowCount > 0) {
            bcryptjs.compare(password, result.rows[0].password, (err, valid) => {
              if (err) {
                console.log("Error on password validation");
                json_msg = '{ result: "Not Ok", message: "Error on password validation" }'
                //return res.status(200).json({ result: "Not Ok", message: "Error on password validation" });
              }
              if (valid) {
                console.log('User [' + req.body.username + '] has logged in.');
                const body = req.body;
                const ptoken = jwt.sign({ user: body }, "TOP_SECRET");
                client.release()
                json_msg = '{ result: "OK", message: "Login OK", user_id: '+result.rows[0].id+', username: '+result.rows[0].username+', role_user: '+result.rows[0].role_user+', email: '+result.rows[0].email+', token: '+ptoken+' }'
                //return res.status(200).json({ result: "OK", message: "Login OK", user_id: result.rows[0].id, username: result.rows[0].username, role_user: result.rows[0].role_user, email: result.rows[0].email, token: ptoken });
              } else {

                client.release()
                json_msg = '{ result: "Not Ok", message: "Incorrect username or password" }'
                //return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
              }
            });
          }
          else {

            client.release()
            json_msg = '{ result: "Not Ok", message: "Incorrect username or password2" }'
            //return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
          }
        }
      })
    }
    catch (e) {
      json_msg = '{ result: "Error", message: "Server Error" '+ e +' }'
      //return res.status(500).json({ result: "Error", message: "Server Error" + e })
    }
    console.log("login LEWAT SINI")

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
}
