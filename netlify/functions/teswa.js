import axios from "axios"

exports.handler = async function (event, context, callback) {
  let json_msg = {}
  let to = "6282115237855"
  let type = "text"
  let text = "tes pake netlify4"
  let useTyping = true
  try {
    var info = await axios.post(process.env.WA_URL, {to, type, text, useTyping}, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + process.env.WA_TOKEN
      }
    })
    callback(null, { statusCode: 200, body: JSON.stringify(info) })
    console.log(info);
    json_msg = info
  }
  catch (e) {
    console.log("Exception "+e)
    json_msg.result = "Error"
    json_msg.message = "Server Error "+e
    callback(e)
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
};