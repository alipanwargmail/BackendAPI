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
      const results2= await db.query("INSERT INTO tickets (user_id, username, email, title, deskripsi, priority, handler_user_id,handler_username, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5,$6,$7,$8, 'OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
      [luser_id, lusername, lemail, ltitle, ldeskripsi, lpriority, handler_user_id, handler_username])      
      json_msg = results2;
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ikeltiga@gmail.com',
          //pass: 'Isupportkelompok32'
          pass: 'ewxsofcnulplgjhn'
        }
      });
      var usermail = {
        from: 'isupport-kelompok3',
        to: lemail,
        subject: 'New ticket created with ID: ' + results2[0].id,
        text: 'Your ticket has been created and handle by ' + handler_username
      }
      transporter.sendMail(usermail, function (error, info) {
      if (error) {
        console.log(error);
        //res.json({ status: "ERR", message: error })
      } else {
        console.log('Email for user sent: ' + info.response);
        var agentmail = {
          from: 'isupport-kelompok3',
          to: handler_email,
          subject: 'New ticket dispatched to you with ID: ' + results2[0].id,
          text: 'New ticket has been opened and dispatched to you (' + handler_username + ") with detail \n \
        Requester: "+ lusername + "\n" +
            "Title: " + ltitle + "\n" +
            "Deskripsi: " + ldeskripsi + "\n" +
            "Priority: " + lpriority + "\n" +
            "Created at: " + results2[0].created_at + "\n"
        }
        transporter.sendMail(agentmail, function (error, info) {
          if (error) {
            console.log(error);
            //res.json({ status: "ERR", message: error })
          } else {
            console.log('Email for agent sent: ' + info.response);
            return res.status(201).json({ result: "OK", message: "Tickets added with ID: " + results2[0].id })
            //res.json({ status: "OK", message: info.response })
          }
        })
      }})
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