const db = require('./dbusingpgpromise.js');
var nodemailer = require('nodemailer')

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
      const results = await db.query("select a.id,a.username,a.email,a.phone_no,count(*) from users a left join tickets b \
      on a.id=b.handler_user_id and b.status <> 'DONE' \
      where a.role_user='AGENT'  \
      group by a.id,a.username,a.email,a.phone_no \
      order by count(*)")
      console.log(results)
      var handler_user_id = results[0].id;
      var handler_username = results[0].username;
      var handler_email = results[0].email;
      console.log(handler_user_id)
      console.log(handler_username)
      console.log(handler_email)
      var results2 = await db.query("INSERT INTO tickets (user_id, username, email, title, deskripsi, priority, handler_user_id,handler_username, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5,$6,$7,$8, 'OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
        [luser_id, lusername, lemail, ltitle, ldeskripsi, lpriority, handler_user_id, handler_username])
      json_msg = results2;
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error " + e
      //json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
    }
    try {
      var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          //pass: 'Isupportkelompok32'
          pass: process.env.EMAIL_PASS
        }
      });
      var info = await transporter.sendMail({
        from: 'isupport-kelompok3',
        to: lemail,
        subject: 'New ticket created with ID: ' + results2[0].id,
        text: 'Your ticket has been created and handle by ' + handler_username
      })      
      callback(null, { statusCode: 200, body: JSON.stringify(info) });
      console.log('Email for user sent: ' + info.response);
      
      var info2 = await transporter.sendMail({
        from: 'isupport-kelompok3',
        to: handler_email,
        subject: 'New ticket dispatched to you with ID: ' + results2[0].id,
        text: 'New ticket has been opened and dispatched to you (' + handler_username + ") with detail \n \
        Requester: "+ lusername + "\n" +
          "Title: " + ltitle + "\n" +
          "Deskripsi: " + ldeskripsi + "\n" +
          "Priority: " + lpriority + "\n" +
          "Created at: " + results2[0].created_at + "\n"
      })
      console.log('Email for agent sent: ' + info2.response);
    }
    catch (error) {
      callback(error);
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