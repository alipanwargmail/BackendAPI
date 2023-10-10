//USERS = require('../../arrayusers.js')
const db = require('./dbusingpgpromise.js')
exports.handler = async function (event, context) {
  console.log(event.httpMethod)
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
    let json_msg = "";
    let paramid = event.queryStringParameters.id;
    console.log("param id: "+paramid)
    try {
      const result = await db.query('delete from tickets where id=$1', [paramid])
      console.log(result)
      json_msg.result = "OK"
      json_msg.message = "Ticket deleted with ID: "+paramid
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error "+e
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