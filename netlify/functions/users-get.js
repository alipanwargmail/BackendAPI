const db = require('./dbusingpgpromise.js')

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
    console.log(process.env.DB_URL)
    let json_msg = "";
    let paramid = event.queryStringParameters.id;
    console.log("param id: "+paramid)
    try {
      const result = await db.query('select * from users where id=$1', [paramid])
      console.log(result)
      if (result.length > 0)
        json_msg = result[0];
      else
        json_msg = {}
    }
    catch (e) {
      json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
    }
    /*
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
    */
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