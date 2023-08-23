
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
var USERS = require('../arrayusers.js')

exports.handler = async function (event, context) {

    let username = event.body.username
    let password = event.body.password
    let json_msg = "";
  let i = 0
  while (i < USERS.length) {
    const value = USERS[i]
    if (value.username === username) {
      bcrypt.compare(password, value.password, (err, valid) => {
        if (err) {
          console.log("Error on password validation");
          json_msg = '{ result: "Not Ok", message: "Error on password validation" }';
          //res.status(200).json({ result: "Not Ok", message: "Error on password validation" });
        }
        if (valid) {
          console.log('User [' + req.body.username + '] has logged in.');
          const body = req.body;
          const ptoken = jwt.sign({ user: body }, KEY_TOKEN);
          console.log(login_ok)
          json_msg = '{ result: "OK", message: "Login OK", user_id: value.id, username: value.username, role_user: value.role_user, email: value.email, token: ptoken }';
          //res.status(200).json({ result: "OK", message: "Login OK", user_id: value.id, username: value.username, role_user: value.role_user, email: value.email, token: ptoken });
        } else {
            json_msg = '{ result: "Not Ok", message: "Incorrect username or password" }';
          //res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
        }
      });
      break;
    }
    else {
      i++
    }
  }
  if (i == USERS.length) {
    console.log(login_ok)
    json_msg = '{ result: "Not Ok", message: "Incorrect username or password" }';
    //res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
  }
  return {
    statusCode: 200,
    body: JSON.stringify(json_msg),
  };
}
