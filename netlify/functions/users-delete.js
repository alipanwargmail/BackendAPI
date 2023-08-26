var USERS = require('../../arrayusers.js')

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
    let paramid = event.queryStringParameters.id;
    console.log(event.queryStringParameters)
    console.log(paramid)
    let retval = null
let json_msg = ""
    let i = 0
    let deleted = false;
    while (i < USERS.length) {
      const value = USERS[i]
      if (value.id == paramid) {
        USERS.splice(i, 1)
        deleted = true
        json_msg = '{ result: "OK", message: "User deleted with ID: "' + value.id + '"}'
        //res.status(200).json({ result: "OK", message: "User deleted with ID: " + value.id })
        break;
      }
      else {
        i++;
      }
    }
    console.log(deleted)
    if (!deleted) {
      json_msg = '{ result: "Err", message: "User with ID: ' + req.params.id +' Not Found" }'
      //return res.status(200).json({ result: "Err", message: "User with ID: " + req.params.id + " Not Found" })
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