const db = require('./dbusingpgpromise.js')

exports.handler = async function (event, context) {

  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Headers" : "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type" : "application/json",
      },
    };
  }
  else {
    console.log(event.httpMethod)
    console.log(process.env.DB_URL)
    let json_msg = "";
    try {
      const result = await db.query('select status argument, count(*) value from tickets group by status')
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
    let i = 0;

    let summary = new Map()
    while (i < TICKETS.length) {
      const value = TICKETS[i]

      let ret = summary.get(value.status)
      console.log("summary.get " + ret + " " + value.status)
      if (ret === undefined) {
        summary.set(value.status, parseInt(0))
      }
      else {
        ret += parseInt(1);
        console.log("set summary : " + value.status + " " + ret)
        summary.set(value.status, ret)
      }
      i++;
    }
    let retval = []
    for (const x of summary.entries()) {
      console.log(x[0] + " " + x[1])
      let item = {
        "argument": x[0],
        "value": x[1]
      }
      retval.push(item)
    }
*/
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Headers" : "Content-Type, Authorization, Origin",
        "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE,OPTIONS",
        "Content-Type" : "application/json",
      },
      body: JSON.stringify(json_msg),
    };
  }
}