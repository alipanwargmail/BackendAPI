const db = require('./dbusingpgpromise.js');

exports.handler = async function (event, context) {
  console.log(event.httpMethod)
  let json_msg = {};
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
    let luser_id = JSON.parse(event.body).user_id
    let lusername = JSON.parse(event.body).username  
    let ltitle = JSON.parse(event.body).title
    let ldeskripsi = JSON.parse(event.body).deskripsi
    let lpriority = JSON.parse(event.body).priority
    let lemail = JSON.parse(event.body).email
    console.log(luser_id)
    console.log(lusername)
    console.log(ltitle)
    console.log(ldeskripsi)
    console.log(lpriority)
    console.log(lemail)
    try {
      console.log("find agent===============")
      const results = await db.query("select a.id,a.username,a.email,count(*) from users a left join tickets b \
      on a.id=b.handler_user_id and b.status <> 'DONE' \
      where a.role_user='AGENT'  \
      group by a.id,a.username,a.email \
      order by count(*)")
      console.log(results)
      const handler_user_id = results[0].id;
      const handler_username = results[0].username;
      const handler_email = results[0].email;
      console.log(handler_user_id)
      console.log(handler_username)
      console.log(handler_email)

      json_msg = results;
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