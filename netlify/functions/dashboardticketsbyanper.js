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
    let json_msg = new Object();
    try {
      const result = await db.query("select a.anper, (select count(*) from tickets where status='OPEN' and anper=a.anper) as OPEN, (select count(*) from tickets where status='IN PROGRESS' and anper=a.anper) as INPROGRESS, (select count(*) from tickets where status='DONE' and anper=a.anper) as DONE FROM (select distinct anper from tickets) a order by a.anper")
      console.log(result)
      if (result.length > 0) {
        json_msg = result;
      }
      else {
        item = new Object();
        item.anper = "anper"
        item.open = 0;
        item.inprogress = 0;
        item.done = 0;
        json_msg.push(item)
      }
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json_msg),
    };
  }
}