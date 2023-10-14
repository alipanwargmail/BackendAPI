const db = require('./dbusingpgpromise.js');

exports.handler = async function (event, context) {
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
    let ticket_id = event.queryStringParameters.ticket_id;
    console.log(event.httpMethod)
    console.log(process.env.DB_URL)
    
    try {
      const result = await db.query('select * from wamsg where ticket_id=$1 order by id', [ticket_id])
      console.log(result)
      json_msg = result;
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error "+e
      console.log("Server Error "+e)
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