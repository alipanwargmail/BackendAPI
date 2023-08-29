const db = require('./dbusingpgpromise.js');

exports.handler = async function (event, context) {
  console.log(event.httpMethod)
  let json_msg = {}
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
    console.log("param id: "+paramid)
    
    try {
      const result = await db.query('select * from tickets where user_id=$1', [paramid])
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