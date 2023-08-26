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
    let i = 0
    while (i < USERS.length) {
      const value = USERS[i]
      if (value.id == paramid) {

        retval = value;
        //res.status(200).json(value);
        break;
      }
      else {
        i++;
      }
    }
    if (i == USERS.length) {
      //return res.status(200).json("");
      retval = "";
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",

      },
      body: JSON.stringify(retval),
    };
  }
}