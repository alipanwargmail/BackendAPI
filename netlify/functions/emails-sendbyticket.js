const db = require('./dbusingpgpromise.js');
var nodemailer = require('nodemailer')
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
    let ticket_id = event.queryStringParameters.ticket_id;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    console.log(dateTime)
    console.log(ticket_id)
    try {
      var results = await db.query("select * from emails where ticket_id=$1 and is_sent=0",
        [ticket_id])
      if (results.length !== 'Undefined') {
        var transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: 'ikeltiga@gmail.com',
            //pass: 'Isupportkelompok32'
            pass: 'ewxsofcnulplgjhn'
          }
        });

        if (results.length > 0) {
          await transporter.sendMail({
            from: 'isupport-kelompok3',
            to: results[0].recipient,
            subject: results[0].subject,
            text: results[0].body,
            html: html,
          });
        }
        if (results.length > 1) {
          await transporter.sendMail({
            from: 'isupport-kelompok3',
            to: results[1].recipient,
            subject: results[1].subject,
            text: results[1].body,
            html: html,
          });
        }

      }
      console.log(results.length);


      json_msg = results;
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
          pass: process.env.EMAIL_PASS
        }
      });      
      var info = await transporter.sendMail({
        from: 'isupport-kelompok3',
        to: lemail,
        subject: 'New ticket created with ID: ' + results2[0].id,
        text: 'Your ticket has been created and handle by ' + handler_username
      })
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
      */
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
      /*
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
       */
      /** 
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
      /*
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