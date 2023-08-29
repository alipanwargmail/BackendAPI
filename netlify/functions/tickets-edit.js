const db = require('./dbusingpgpromise.js');
var nodemailer = require('nodemailer')

exports.handler = async function (event, context, callback) {
  console.log(event.httpMethod)
  let json_msg = {};
  if (event.httpMethod == 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "PUT",
        "Content-Type": "application/json",
      },
    };
  }
  else {
    let paramid = event.queryStringParameters.id;
    console.log("param id: "+paramid)   
    let llogin_id = JSON.parse(event.body).login_id
    let lloginname = JSON.parse(event.body).loginname
    let lloginrole = JSON.parse(event.body).loginrole
    let luser_id = JSON.parse(event.body).user_id
    let lhandler_user_id = JSON.parse(event.body).handler_user_id
    let lusername = JSON.parse(event.body).username
    let lhandler_username = JSON.parse(event.body).handler_username
    let ltitle = JSON.parse(event.body).title
    let ldeskripsi = JSON.parse(event.body).deskripsi
    let lstatus = JSON.parse(event.body).priority
    let lemail = JSON.parse(event.body).email
    let lphone_no = JSON.parse(event.body).phone_no
    let lhandler_phone_no = JSON.parse(event.body).handler_phone_no
    console.log(llogin_id)
    console.log(lloginname)
    console.log(lloginrole)
    console.log(luser_id)
    console.log(lhandler_user_id)
    console.log(lusername)
    console.log(lhandler_username)
    console.log(luser_id)
    console.log(lusername)
    console.log(ltitle)
    console.log(ldeskripsi)
    console.log(lstatus)
    console.log(lemail)
    console.log(lphone_no)
    console.log(lhandler_phone_no)
    try {
      var results = await db.query('UPDATE tickets SET user_id = $1, handler_user_id=$2, username=$3, handler_username=$4, title=$5, deskripsi=$6, priority=$7, status=$8, updated_at=CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [luser_id, lhandler_user_id, lusername, lhandler_username, ltitle, ldeskripsi, lpriority, lstatus, paramid])
      json_msg = results;
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
        subject: 'Ticket with ID: ' + results[0].id + ' has been updated',
        text: 'Ticket with ID: ' + results[0].id + 'has been updated by ' + lloginname + '(' + lloginrole + ')\n' +
        "Requester: " + results[0].username + "\n" +
        "Title: " + results[0].title + "\n" +
        "Deskripsi: " + results[0].deskripsi + "\n" +
        "Priority: " + results[0].priority + "\n" +
        "Status: " + results[0].status + "\n" +
        "Created at: " + results[0].created_at + "\n" +
        "Updated at: " + results[0].updated_at + "\n"
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
      callback(null, { statusCode: 200, body: JSON.stringify(info) });
      /*
      var to = lphone_no
      const type = "text"
      var text = 'Your ticket has been created with ID: '+results2[0].id+' and handle by ' + handler_username
      const useTyping = "true"
      axios.post(process.env.WA_URL, {to, type, text, useTyping}, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + process.env.WA_TOKEN
        }
      })
      //console.log(info3);
      callback(null, { statusCode: 200, body: JSON.stringify({}) })
      
      to = handler_phone_no
      text = "Your ticket has been opened with ID: "+results2[0].id+" and dispatched to you (" + handler_username + ") with detail: \n" +
      "Requester: "+ lusername + "\n" +
      "Title: " + ltitle + "\n" +
      "Deskripsi: " + ldeskripsi + "\n" +
      "Priority: " + lpriority + "\n" +
      "Created at: " + results2[0].created_at
      axios.post(process.env.WA_URL, {to, type, text, useTyping}, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + process.env.WA_TOKEN
        }
      })
      //console.log(info3);
      callback(null, { statusCode: 200, body: JSON.stringify({}) })   
      */   
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