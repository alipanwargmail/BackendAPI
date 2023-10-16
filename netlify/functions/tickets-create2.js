const db = require('./dbusingpgpromise.js');
//var nodemailer = require('nodemailer')
//import axios from "axios"

exports.handler = async function (event, context, callback) {
  console.log(event.httpMethod)
  let json_msg = {};
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
    let luser_id = JSON.parse(event.body).user_id
    let lusername = JSON.parse(event.body).username
    let ltitle = JSON.parse(event.body).title
    let ldeskripsi = JSON.parse(event.body).deskripsi
    let lpriority = JSON.parse(event.body).priority
    let lemail = JSON.parse(event.body).email
    let lphone_no = JSON.parse(event.body).phone_no
    let lanper = JSON.parse(event.body).anper
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    console.log(dateTime)
    
    console.log(luser_id)
    console.log(lusername)
    console.log(ltitle)
    console.log(ldeskripsi)
    console.log(lpriority)
    console.log(lemail)
    console.log(lphone_no)
    console.log(lanper)
    try {
      console.log("find agent===============")
      const results = await db.query("select a.id,a.username,a.email,a.phone_no,count(*) from users a left join tickets b \
      on a.id=b.handler_user_id and b.status <> 'DONE' \
      where a.role_user='AGENT' and a.anper=$1  \
      group by a.id,a.username,a.email,a.phone_no \
      order by count(*)", [lanper])
      console.log(results)
      var handler_user_id = results[0].id;
      var handler_username = results[0].username;
      var handler_email = results[0].email;
      var handler_phone_no = results[0].phone_no
      console.log(handler_user_id)
      console.log(handler_username)
      console.log(handler_email)
      console.log(handler_email)
      var results2 = await db.query("INSERT INTO tickets (user_id, username, email, title, deskripsi, priority, handler_user_id, handler_username, status, phone_no, handler_email, handler_phone_no, created_at, updated_at, anper) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'OPEN', $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $12) RETURNING *",
        [luser_id, lusername, lemail, ltitle, ldeskripsi, lpriority, handler_user_id, handler_username, lphone_no, handler_email, handler_phone_no, lanper])
      json_msg = results2;
    }
    catch (e) {
      json_msg.result = "Error"
      json_msg.message = "Server Error " + e
      console.log("Server Error " + e)
      //json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
    }

    try {
      /*
      console.log(process.env.EMAIL_SERVICE)
      console.log(process.env.EMAIL_PASS)
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
      })*/
      let subject = 'New ticket created with ID: ' + results2[0].id
      let body = 'Your ticket has been created and handle by ' + handler_username
      var results3 = await db.query("INSERT INTO emails(recipient, subject, body, created_at, is_sent, ticket_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0, $4) RETURNING *",
      [lemail, subject, body, results2[0].id]);      

      //callback(null, { statusCode: 200, body: JSON.stringify(info) });
      today = new Date();
      date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      dateTime = date + ' ' + time;
      console.log(dateTime)
      console.log('Email for user pushed to db, email id: ' + results3[0].id);
      /**/
      /*
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
      */
      subject = 'New ticket dispatched to you with ID: ' + results2[0].id,
      body = 'New ticket has been opened and dispatched to you (' + handler_username + ") with detail \n \
      Requester: "+ lusername + "\n" +
        "Title: " + ltitle + "\n" +
        "Deskripsi: " + ldeskripsi + "\n" +
        "Priority: " + lpriority + "\n" +
        "Created at: " + results2[0].created_at + "\n"
      var results4 = await db.query("INSERT INTO emails(recipient, subject, body, created_at, is_sent, ticket_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0, $4) RETURNING *",
      [handler_email, subject, body, results2[0].id]);      
  
      today = new Date();
      date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      dateTime = date + ' ' + time;
      console.log(dateTime)
      console.log('Email for agent pushed to db, email id: ' + results4[0].id);
      //callback(null, { statusCode: 200, body: JSON.stringify(info) });
      /**/
      /** */
      var to = lphone_no
      var text = 'Your ticket has been created with ID: '+results2[0].id+' and handle by ' + handler_username
      var results5 = await db.query("INSERT INTO wamsg(recipient, content, created_at, is_sent, ticket_id) VALUES ($1, $2, CURRENT_TIMESTAMP, 0, $3) RETURNING *",
      [to, text, results2[0].id]);            
      today = new Date();
      date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      dateTime = date + ' ' + time;
      console.log(dateTime)
      console.log('Wa message for user pushed to db, wamsg id: ' + results5[0].id);
      /*
      const useTyping = "true"
      const type = "text"
      await axios.post(process.env.WA_URL, {to, type, text, useTyping}, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + process.env.WA_TOKEN
        }
      })
      */
      //console.log(info3);
      //callback(null, { statusCode: 200, body: JSON.stringify({}) })
      
      to = handler_phone_no
      text = "Your ticket has been opened with ID: "+results2[0].id+" and dispatched to you (" + handler_username + ") with detail: \n" +
      "Requester: "+ lusername + "\n" +
      "Title: " + ltitle + "\n" +
      "Deskripsi: " + ldeskripsi + "\n" +
      "Priority: " + lpriority + "\n" +
      "Created at: " + results2[0].created_at
      var results6 = await db.query("INSERT INTO wamsg(recipient, content, created_at, is_sent, ticket_id) VALUES ($1, $2, CURRENT_TIMESTAMP, 0, $3) RETURNING *",
      [to, text, results2[0].id]);            
      today = new Date();
      date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      dateTime = date + ' ' + time;
      console.log(dateTime)
      console.log('Wa message for user pushed to db, wamsg id: ' + results6[0].id);

      /*
      await axios.post(process.env.WA_URL, {to, type, text, useTyping}, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + process.env.WA_TOKEN
        }
      })
      */
      //console.log(info3);
      //callback(null, { statusCode: 200, body: JSON.stringify({}) })   
      /**/
    }
    catch (error) {      
      console.log("Server Error " + error)
      callback(error);
    }
    console.log("LEWAT SINI")
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