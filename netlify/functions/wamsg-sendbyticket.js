const db = require('./dbusingpgpromise.js');
//var nodemailer = require('nodemailer')
import axios from "axios"

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
      var results = await db.query("select * from wamsg where ticket_id=$1 and is_sent=0",
        [ticket_id])
        console.log(results)
        if (results.length !== 'Undefined') {
         today = new Date();
         date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
         time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
         dateTime = date + ' ' + time;
        console.log("2"+dateTime)
        if (results.length > 0) {

          let to = results[0].recipient
          let type = "text"
          let text = results[0].content
          let useTyping = "true"
          await axios.post(process.env.WA_URL, { to, type, text, useTyping }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'authorization': 'Bearer ' + process.env.WA_TOKEN
            }
          })
          today = new Date();
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          dateTime = date + ' ' + time;
           console.log("3"+dateTime)
          //callback(null, { statusCode: 200, body: JSON.stringify({}) })
          await db.query("update wamsg set is_sent=1, sent_at=CURRENT_TIMESTAMP where id=$1",
            [results[0].id])
            today = new Date();
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            dateTime = date + ' ' + time;
             console.log("4"+dateTime)
        }
        /*
        if (results.length > 1) {
          let to = results[1].recipient
          let type = "text"
          let text = results[1].content
          let useTyping = "true"
          today = new Date();
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          dateTime = date + ' ' + time;
           console.log("5"+dateTime)
          await axios.post(process.env.WA_URL, { to, type, text, useTyping }, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'authorization': 'Bearer ' + process.env.WA_TOKEN
            }
          })
          today = new Date();
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          dateTime = date + ' ' + time;
           console.log("6"+dateTime)

          //callback(null, { statusCode: 200, body: JSON.stringify({}) })
          await db.query("update emails set is_sent=1, sent_at=CURRENT_TIMESTAMP where id=$1",
            [results[1].id])
            today = new Date();
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            dateTime = date + ' ' + time;
             console.log("7"+dateTime)
  
        }
        */

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