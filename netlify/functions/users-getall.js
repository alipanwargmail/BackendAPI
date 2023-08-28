const db = require('./dbusingpgpromise.js');

exports.handler = async function (event, context) {

  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json",
      },
    };
  }
  else {
    console.log(event.httpMethod)
    console.log(process.env.DB_URL)
    let json_msg = "";
    try {
      const result = await db.query('select * from users')
      console.log(result)
      json_msg = result;
    }
    catch (e) {
      json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
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