const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
var USERS = require('../../arrayusers.js')

exports.handler = async function (event, context) {
  
  let user = JSON.parse(event.body).username
  let password = JSON.parse(event.body).password
  let json_msg = "";
  let i = 0
  var breakloop = false
  let log = event.body + "|" //JSON.stringify(body)+"|";
  log += "username: " + user + " password: " + password + "|USERS.length: " + USERS.length + "|"
  
   // json_msg = '{log="'+log+'"}'

    while (i < USERS.length && !breakloop) {
      log += USERS[i].username+ "|<"+JSON.parse(event.body).username+">|"+user+"|"
      
      /*
      if (USERS[i].username == username) {
        log += "username " + username + " found|"
        
        bcryptjs.compare(password, value.password, (err, valid) => {
          if (err) {
            log += "Error on password validation|";
            json_msg = '{ result: "Not Ok", message: "Error on password validation", log="' + log + '"}';
            //res.status(200).json({ result: "Not Ok", message: "Error on password validation" });
          }
          if (valid) {
            //const body = event.body;
            const ptoken = "TOKEN"//jwt.sign({ user: body }, KEY_TOKEN);
            json_msg = '{ result: "OK", message: "Login OK" }'
            //json_msg = '{ result: "OK", message: "Login OK", user_id: value.id, username: value.username, role_user: value.role_user, email: value.email, token: '+ptoken+', log="'+log+'" }';
            //res.status(200).json({ result: "OK", message: "Login OK", user_id: value.id, username: value.username, role_user: value.role_user, email: value.email, token: ptoken });
          } else {
            json_msg = '{ result: "Not Ok", message: "Incorrect username or password", log="' + log + '" }';
            //res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
          }
        });
        
        log += "about to break i: " + i + "|"
        breakloop = true
      }
      else {
        i++
      }
     */
    i++
    }
    if (i == USERS.length) {
      log += "i == USERS.length|";
      //console.log(login_ok)
      json_msg = '{ result: "Not Ok", message: "Incorrect username or password", log="' + log + '" }';
      //res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
    }

  return {
    statusCode: 200,
    body: JSON.stringify(json_msg),
  };
}
