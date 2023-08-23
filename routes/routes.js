const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const pool = require('../database.js')
var nodemailer = require('nodemailer')
var USERS = require('../arrayusers.js')
var TICKETS = require('../arraytickets.js')

const router = express.Router();
const KEY_TOKEN = process.env.SECRETTOKEN
const USE_DB = process.env.USEDB;
console.log("USEDB: " + USE_DB)
console.log(KEY_TOKEN)

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ikeltiga@gmail.com',
    //pass: 'Isupportkelompok32'
    pass: 'ewxsofcnulplgjhn'
  }
});

var mailOptions = {
  from: 'isupport-kelompok3',
  to: 'alipanwar@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

router.get('/', (req, res) => {
  res.json({ status: "OK called from root" });
})

router.get('/test', function (request, response) {
  response.sendFile('tes.html', { root: __dirname });
});

router.get('/testmail', function (request, res) {

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json({ status: "ERR", message: error })
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ status: "OK", message: info.response })
    }
  });

});

router.get('/cekdb', async function (request, res) {


  const client = await pool.connect()
  try {
    return res.status(200).json(client);
  }
  catch (e) {
    return res.status(500).json({ result: "Error", message: "Server Error" + e })
  }

});

router.get('/new', function (request, response) {
  response.sendFile('new.html', { root: __dirname });
});

router.post('/login', async (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  console.log(USE_DB)
  console.log(KEY_TOKEN)
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    const client = await pool.connect()
    try {
      client.query('select id, "username", "password", "role_user", "email" from "users" where "username"=$1', [username], (err, result) => {
        if (err) {
          status = 401;
          json_msg = { result: "ERR", message: "Unauthorized" }
          //return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        else {
          if (result.rowCount > 0) {
            bcrypt.compare(password, result.rows[0].password, (err, valid) => {
              if (err) {
                console.log("Error on password validation");
                return res.status(200).json({ result: "Not Ok", message: "Error on password validation" });
              }
              if (valid) {
                console.log('User [' + req.body.username + '] has logged in.');
                const body = req.body;
                const ptoken = jwt.sign({ user: body }, KEY_TOKEN);
                client.release()
                return res.status(200).json({ result: "OK", message: "Login OK", user_id: result.rows[0].id, username: result.rows[0].username, role_user: result.rows[0].role_user, email: result.rows[0].email, token: ptoken });
              } else {

                client.release()
                return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
              }
            });
          }
          else {

            client.release()
            return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
          }
        }
      })
    }
    catch (e) {
      return res.status(500).json({ result: "Error", message: "Server Error" + e })
    }
    console.log("login LEWAT SINI")
  }
  else {
    let i = 0
    while (i < USERS.length) {
      const value = USERS[i]
      if (value.username === username) {
        bcrypt.compare(password, value.password, (err, valid) => {
          if (err) {
            console.log("Error on password validation");
            res.status(200).json({ result: "Not Ok", message: "Error on password validation" });
          }
          if (valid) {
            console.log('User [' + req.body.username + '] has logged in.');
            const body = req.body;
            const ptoken = jwt.sign({ user: body }, KEY_TOKEN);
            console.log(login_ok)
            res.status(200).json({ result: "OK", message: "Login OK", user_id: value.id, username: value.username, role_user: value.role_user, email: value.email, token: ptoken });
          } else {
            res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
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
      return res.status(200).json({ result: "Not Ok", message: "Incorrect username or password" });
    }
  }
});

router.get('/dashboardtickets', verifyToken, async (req, res, next) => {

  console.log("get /dashboardtickets called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {

    try {
      const client = await pool.connect()
      client.query('select status argument, count(*) value from tickets group by status;', function (err, result) {
        if (err) {
          console.log("get /dashboardtickets pool.query err")
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        client.release()
        return res.status(200).json(result.rows);
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0;

    let summary = new Map()
    while (i < TICKETS.length) {
      const value = TICKETS[i]

      let ret = summary.get(value.status)
      console.log("summary.get " + ret + " " + value.status)
      if (ret === undefined) {
        summary.set(value.status, parseInt(0))
      }
      else {

        ret += parseInt(1);
        console.log("set summary : " + value.status + " " + ret)
        summary.set(value.status, ret)
      }
      i++;
    }
    let retval = []
    for (const x of summary.entries()) {
      console.log(x[0] + " " + x[1])
      let item = {
        "argument": x[0],
        "value": x[1]
      }
      retval.push(item)
    }
    return res.status(200).json(retval);
  }
});

router.get('/dashboardticketsbycs', verifyToken, async (req, res, next) => {

  console.log("get /dashboardticketsbycs called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {

    try {
      const client = await pool.connect()
      client.query('select handler_username argument, count(*) value from tickets group by handler_username;', function (err, result) {
        if (err) {
          console.log("get /dashboardticketsbycs pool.query err")
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        client.release()
        return res.status(200).json(result.rows);
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0;

    let summary = new Map()
    while (i < TICKETS.length) {
      const value = TICKETS[i]

      let ret = summary.get(value.handler_username)
      console.log("summary.get " + ret + " " + value.handler_username)
      if (ret === undefined) {
        summary.set(value.handler_username, parseInt(0))
      }
      else {

        ret += parseInt(1);
        console.log("set summary : " + value.handler_username + " " + ret)
        summary.set(value.handler_username, ret)
      }
      i++;
    }
    let retval = []
    for (const x of summary.entries()) {
      console.log(x[0] + " " + x[1])
      let item = {
        "argument": x[0],
        "value": x[1]
      }
      retval.push(item)
    }
    return res.status(200).json(retval); 
  }
});

router.get('/users', verifyToken, async (req, res, next) => {

  console.log("get /users called")
  console.log(USE_DB)
  console.log(KEY_TOKEN)
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      client.query('select * from users', function (err, result) {
        if (err) {
          console.log("get /users pool.query err")
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        client.release()
        return res.status(200).json(result.rows);
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    return res.status(200).json(USERS);
  }

});

router.get('/users/:id', verifyToken, async (req, res, next) => {

  console.log("get /users/:" + req.params.id + " called")

  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      const id = parseInt(req.params.id)
      client.query('select * from users where id=$1', [id], function (err, result) {
        if (err) {
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        if (result.rowCount > 0) {
          client.release()
          return res.status(200).json(result.rows[0]);
        }
        else {
          client.release()
          return res.status(200).json("");
        }
      })
    }
    catch (e) {
      return res.status(500).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0
    while (i < USERS.length) {
      const value = USERS[i]
      if (value.id == req.params.id) {

        res.status(200).json(value);
        break;
      }
      else {
        i++;
      }
    }
    if (i == USERS.length) {
      return res.status(200).json("");
    }
  }
});

router.post('/users', verifyToken, async (req, res, next) => {

  console.log("post /users called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    let { username, email, password, phone_no, role_user } = req.body
    try {
      const client = await pool.connect()
      const hash = await bcrypt.hash(password, 10)
      password = hash
      client.query('INSERT INTO users (username, email, password, phone_no, role_user, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        [username, email, password, phone_no, role_user], (error, results) => {
          if (error) {
            client.release()
            return res.status(500).json({ result: "ERR", message: error })
          }
          client.release()
          return res.status(201).json({ result: "OK", message: "User added with ID: " + results.rows[0].id })
        })
    }
    catch (e) {
      return res.status(500).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let { username, email, password, phone_no, role_user } = req.body
    let i = 0
    let max_id = 0;
    while (i < USERS.length) {
      const value = USERS[i]
      if (parseInt(value.id) > max_id) {
        max_id = parseInt(value.id);
      }
      i++;
    }
    const hash = await bcrypt.hash(password, 10)
    password = hash
    var user = {
      "id": max_id + 1,
      "username": username,
      "email": email,
      "password": hash,
      "phone_no": phone_no,
      "role_user": role_user,
      "created_at": new Date().toLocaleString(),
      "updated_at": new Date().toLocaleString()
    }
    USERS.push(user)
    return res.status(201).json({ result: "OK", message: "User added with ID: " + user.id })
  }
});

router.put('/users/:id', verifyToken, async (req, res, next) => {

  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      let old_password = "";
      const client = await pool.connect()
      const id = parseInt(req.params.id)
      let { username, email, password, phone_no, role_user } = req.body
      console.log("id: " + id)
      console.log("password from client: " + password)
      console.log("put username: " + username + ", email: " + email + ", password: " + password + ", phone_no: " + phone_no + ", role_user: " + role_user)
      client.query('SELECT password FROM users WHERE id=' + id, async (error, results) => {
        if (error) {
          console.log("error")
          client.release()
          return res.status(500).json({ result: "Error", message: "1Server Error " + error })
        }
        if (results) {
          console.log(results)
          old_password = results.rows[0].password
          console.log("password from db: " + old_password)
          console.log("old_password: " + old_password)
          if (password !== old_password) {
            console.log("old_password and password BEDA!")
            const hash = await bcrypt.hash(password, 10)
            password = hash
          }
        }
      })
      client.query(
        'UPDATE users SET username = $1, email = $2, password=$3, phone_no=$4, role_user=$5, updated_at=CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [username, email, password, phone_no, role_user, id], (error, results) => {
          if (error) {
            client.release()
            return res.status(500).json({ result: "Error", message: "2Server Error " + error })
          }
          //return res.status(201).json({ result: "OK", message: "Update users with ID: " + results.rows[0].id })
          client.release()
          return res.status(201).json(results.rows[0])
        })
    }
    catch (e) {
      return res.status(500).json({ result: "Error", message: "3Server Error " + e })
    }
  }
  else {
    let { username, email, password, phone_no, role_user } = req.body
    let i = 0
    let deleted = false;
    while (i < USERS.length) {
      const value = USERS[i]
      if (parseInt(value.id) == parseInt(req.params.id)) {

        if (value.password !== password) {
          const hash = await bcrypt.hash(password, 10)
          password = hash
        }
        value.username = username;
        value.email = email;
        value.password = password;
        value.phone_no = phone_no;
        value.role_user = role_user;
        value.updated_at = new Date().toLocaleString()
        res.status(201).json(value)
        break;
      }
      else {
        i++;
      }
    }
    if (i == USERS.length) {
      return res.status(200).json({ result: "Err", message: "User with ID: " + req.params.id + " Not Found" })
    }
  }
});

router.delete('/users/:id', verifyToken, async (req, res, next) => {

  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      const id = parseInt(req.params.id)
      client.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
          client.release()
          return res.status(500).json({ result: "Error", message: "Server Error " + error })
        }
        //res.status(200).send(`User deleted with ID: ${id}`)
        client.release()
        return res.status(200).json({ result: "OK", message: "User deleted with ID: " + id })
      })
    }
    catch (e) {
      return res.status(500).json({ result: "Error", message: "Server Error" + e })
    }
  }
  else {
    let i = 0
    let deleted = false;
    while (i < USERS.length) {
      const value = USERS[i]
      if (parseInt(value.id) == parseInt(req.params.id)) {
        USERS.splice(i, 1)
        deleted = true
        res.status(200).json({ result: "OK", message: "User deleted with ID: " + value.id })
        break;
      }
      else {
        i++;
      }
    }
    console.log(deleted)
    if (!deleted) {
      return res.status(200).json({ result: "Err", message: "User with ID: " + req.params.id + " Not Found" })
    }
  }

});

function verifyToken(req, res, next) {

  //console.log(req.headers)
  try {
    const bearerHeader = req.headers['authorization']
    //console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      //req.token = bearerToken
      jwt.verify(bearerToken, KEY_TOKEN, (err, valid) => {
        if (err) {
          console.log("get /users verify err")
          return res.status(403).json({ result: "ERR", message: "Forbidden" })
        }
      })
      next()
    }
    else {
      console.log("verifyToken else")
      return res.status(403).json({ Status: "ERR", message: "Invalid token" })
    }
  }
  catch (e) {
    console.log("verifyToken exception catch")
    return res.status(500).json({ result: "Error", message: "Server Error" + e })
  }
}

router.get('/tickets', verifyToken, async (req, res, next) => {

  console.log("get /tickets called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      client.query('select * from tickets', function (err, result) {
        if (err) {
          console.log("get /users pool.query err")
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        client.release()
        return res.status(200).json(result.rows);
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    return res.status(200).json(TICKETS);
  }
});

router.get('/tickets/:id', verifyToken, async (req, res, next) => {

  console.log("get /tickets/" + req.params.id + " called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const id = req.params.id
      const client = await pool.connect()
      client.query('select * from tickets where id=$1', [id], function (err, result) {
        if (err) {
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        if (result.rowCount > 0) {
          client.release()
          return res.status(200).json(result.rows[0]);
        }
        else {
          client.release()
          return res.status(200).json("");
        }
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0
    while (i < TICKETS.length) {
      const value = TICKETS[i]
      if (value.id === req.params.id) {

        res.status(200).json(value);
        break;
      }
      else {
        i++;
      }
    }
    if (i == TICKETS.length) {
      return res.status(200).json("");
    }
  }
});

router.post('/tickets', verifyToken, async (req, res, next) => {

  console.log("post /tickets called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      client.query("select a.id,a.username,a.email,count(*) from users a left join tickets b \
    on a.id=b.handler_user_id and b.status <> 'DONE' \
    where a.role_user='AGENT'  \
    group by a.id,a.username,a.email \
    order by count(*)"
        , (error, results) => {
          if (error) {

            console.log('error when querying...')
          }
          else {
            const handler_user_id = results.rows[0].id;
            const handler_username = results.rows[0].username;
            const handler_email = results.rows[0].email;
            console.log(handler_user_id)
            console.log(handler_username)
            console.log(handler_email)
            let { user_id, username, title, deskripsi, priority, email } = req.body
            console.log(email)
            client.query("INSERT INTO tickets (user_id, username, email, title, deskripsi, priority, handler_user_id,handler_username, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5,$6,$7,$8, 'OPEN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
              [user_id, username, email, title, deskripsi, priority, handler_user_id, handler_username], (error, results) => {
                if (error) {
                  console.log('error ' + error.message)
                  client.release()
                  return res.status(200).json({ result: "ERR", message: error.message })
                }
                client.release()
                var usermail = {
                  from: 'isupport-kelompok3',
                  to: email,
                  subject: 'New ticket created with ID: ' + results.rows[0].id,
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
                      subject: 'New ticket dispatched to you with ID: ' + results.rows[0].id,
                      text: 'New ticket has been opened and dispatched to you (' + handler_username + ") with detail \n \
                    Requester: "+ results.rows[0].username + "\n" +
                        "Title: " + results.rows[0].title + "\n" +
                        "Deskripsi: " + results.rows[0].deskripsi + "\n" +
                        "Priority: " + results.rows[0].priority + "\n" +
                        "Created at: " + results.rows[0].created_at + "\n"
                    }
                    transporter.sendMail(agentmail, function (error, info) {
                      if (error) {
                        console.log(error);
                        //res.json({ status: "ERR", message: error })
                      } else {
                        console.log('Email for agent sent: ' + info.response);
                        return res.status(201).json({ result: "OK", message: "Tickets added with ID: " + results.rows[0].id })
                        //res.json({ status: "OK", message: info.response })
                      }
                    })
                  }
                });

              })
          }
        })
    }
    catch (e) {
      return res.status(500).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0
    let handler_id = "";
    let handler_username = "";
    let handler_email = "";
    let agent = [];
    let summary = new Map()
    while (i < USERS.length) {
      const value = USERS[i]
      if (value.role_user === "AGENT") {
        agent.push(value)
        console.log("AGENT: " + value.id + " " + value.username)
      }
      i++;
    }

    i = 0;
    let max_id = 0;
    while (i < TICKETS.length) {
      const value = TICKETS[i]
      if (parseInt(value.id) > max_id) {
        max_id = parseInt(value.id);
      }
      let ret = summary.get(value.handler_user_id)
      console.log("summary.get " + ret + " " + value.handler_user_id)
      if (ret === undefined) {
        summary.set(value.handler_user_id, parseInt(0))
      }
      else {

        ret += parseInt(1);
        console.log("set summary : " + value.handler_user_id + " " + ret)
        summary.set(value.handler_user_id, ret)
      }
      i++;
    }
    console.log("max_id: " + max_id)
    if (agent.length !== summary.size) {
      i = 0;
      while (i < agent.length) {
        a = agent[i]
        b = summary.get(a.user_id)
        if (b) {
          //do nothing
        }
        else { // ketemu yang belum ada
          handler_id = a.id
          handler_username = a.username
          handler_email = a.email
          break;
        }
        i++;
      }
    }
    else {
      console.log("enter HERE:== ")
      let min = 9999999;
      let minkey = "";
      for (const x of summary.entries()) {
        console.log(x[0] + " " + x[1])
        if (x[1] < min) {
          minkey = x[0]
          min = x[1]
        }
      }
      console.log("minkey: " + minkey)
      console.log("min: " + min)
      i = 0;
      while (i < agent.length) {
        a = agent[i]
        if (a.id === minkey) {
          handler_id = a.id
          handler_username = a.username
          handler_email = a.email
          break;
        }
        else {
          i++;
        }
      }
    }
    console.log("handler_id: " + handler_id)
    console.log("handler_username: " + handler_username)
    console.log("handler_email: " + handler_email)
    let { user_id, username, title, deskripsi, priority, email } = req.body
    var ticket = {
      "id": max_id + 1,
      "user_id": user_id,
      "username": username,
      "title": title,
      "deskripsi": deskripsi,
      "priority": priority,
      "email": email,
      "handler_id": handler_id,
      "handler_username": handler_username,
      "status": "OPEN",
      "created_at": new Date().toLocaleString(),
      "updated_at": new Date().toLocaleString()
    }
    var usermail = {
      from: 'isupport-kelompok3',
      to: email,
      subject: 'New ticket created with ID: ' + ticket.id,
      text: 'Your ticket has been created and handle by ' + handler_username
    }
    TICKETS.push(ticket);
    transporter.sendMail(usermail, function (error, info) {
      if (error) {
        console.log(error);
        //res.json({ status: "ERR", message: error })
      } else {
        console.log('Email for user sent: ' + info.response);
        var agentmail = {
          from: 'isupport-kelompok3',
          to: handler_email,
          subject: 'New ticket dispatched to you with ID: ' + ticket.id,
          text: 'New ticket has been opened and dispatched to you (' + handler_username + ") with detail \n \
          Requester: "+ ticket.username + "\n" +
            "Title: " + ticket.title + "\n" +
            "Deskripsi: " + ticket.deskripsi + "\n" +
            "Priority: " + ticket.priority + "\n" +
            "Created at: " + ticket.created_at + "\n"
        }
        if (handler_email.length > 0) {
          transporter.sendMail(agentmail, function (error, info) {
            if (error) {
              console.log(error);
              //res.json({ status: "ERR", message: error })
            } else {
              console.log('Email for agent sent: ' + info.response);
              return res.status(201).json({ result: "OK", message: "Tickets added with ID: " + ticket.id })
              //res.json({ status: "OK", message: info.response })
            }
          })
        }
        else {
          console.log("Email to handler not sent")
          return res.status(201).json({ result: "OK", message: "Tickets added with ID: " + ticket.id })
        }
      }
    });
  }
});


router.get('/ticketsbyuser/:userid', verifyToken, async (req, res, next) => {

  console.log("get /ticketsbyuser called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      const userid = req.params.userid
      console.log(userid)
      pool.query('select * from tickets where user_id=$1', [userid], function (err, result) {
        if (err) {
          console.log("get /ticketsbyuser pool.query err")
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        client.release()
        return res.status(200).json(result.rows);
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0
    const retval = []
    while (i < TICKETS.length) {
      const value = TICKETS[i]

      if (value.user_id === req.params.userid) {
        retval.push(value)
      }
      i++;
    }
    return res.status(200).json(retval);
  }
});

router.get('/ticketsbyhandler/:handleruserid', verifyToken, async (req, res, next) => {

  console.log("get /ticketsbyhandler called")
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      const handleruserid = req.params.handleruserid
      console.log(handleruserid)
      pool.query('select * from tickets where handler_user_id=$1', [handleruserid], function (err, result) {
        if (err) {
          console.log("get /ticketsbyhandler pool.query err")
          client.release()
          return res.status(401).json({ result: "ERR", message: "Unauthorized" });
        }
        client.release()
        return res.status(200).json(result.rows);
      })
    }
    catch (e) {
      return res.status(403).json({ result: "ERR", message: e.message })
    }
  }
  else {
    let i = 0
    const retval = []
    while (i < TICKETS.length) {
      const value = TICKETS[i]
      if (value.handler_user_id === req.params.handleruserid) {
        retval.push(value)
      }
      i++;
    }
    return res.status(200).json(retval);
  }
});

router.put('/tickets/:id', verifyToken, async (req, res, next) => {
  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {

    try {
      const client = await pool.connect()
      const id = parseInt(req.params.id)
      let { login_id, loginname, loginrole, loginemail, user_id, handler_user_id, username, handler_username, title, deskripsi, priority, status, email } = req.body
      console.log("put user_id: " + user_id + ", handler_user_id: " + handler_user_id + ", deskripsi: " + deskripsi + ", status: " + status + ", email: " + email)
      client.query(
        'UPDATE tickets SET user_id = $1, handler_user_id=$2, username=$3, handler_username=$4, title=$5, deskripsi=$6, priority=$7, status=$8, updated_at=CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
        [user_id, handler_user_id, username, handler_username, title, deskripsi, priority, status, id], (error, results) => {

          if (error) {
            client.release()
            return res.status(500).json({ result: "Error", message: "2Server Error " + error })
          }
          //return res.status(201).json({ result: "OK", message: "Update users with ID: " + results.rows[0].id })
          client.release()
          var contentemail = 'Ticket with ID: ' + results.rows[0].id + 'has been updated by ' + loginname + '(' + loginrole + ')\n' +
            "Requester: " + results.rows[0].username + "\n" +
            "Title: " + results.rows[0].title + "\n" +
            "Deskripsi: " + results.rows[0].deskripsi + "\n" +
            "Priority: " + results.rows[0].priority + "\n" +
            "Status: " + results.rows[0].status + "\n" +
            "Created at: " + results.rows[0].created_at + "\n" +
            "Updated at: " + results.rows[0].updated_at + "\n"
          var editmail = {
            from: 'isupport-kelompok3',
            to: email,
            subject: 'Ticket with ID: ' + results.rows[0].id + ' has been updated',
            text: contentemail
          }
          transporter.sendMail(editmail, function (error, info) {
            if (error) {
              console.log(error);
              //res.json({ status: "ERR", message: error })
            } else {
              console.log('Email for user sent: ' + info.response);
              var editmailagent = {
                from: 'isupport-kelompok3',
                to: loginemail,
                subject: 'Ticket with ID: ' + results.rows[0].id + ' has been updated',
                text: contentemail
              }
              transporter.sendMail(editmailagent, function (error, info) {
                if (error) {
                  console.log(error);
                  //res.json({ status: "ERR", message: error })
                } else {
                  console.log('Email for agent sent: ' + info.response);
                  return res.status(201).json(results.rows[0])
                  //res.json({ status: "OK", message: info.response })
                }
              })
            }
          });
        })
      //return res.status(201).json(results.rows[0])
    }
    catch (e) {
      return res.status(500).json({ result: "Error", message: "3Server Error " + e })
    }
  }
  else {
    let i = 0
    while (i < TICKETS.length) {
      const value = TICKETS[i]
      if (parseInt(value.id) === parseInt(req.params.id)) {
        const id = parseInt(req.params.id)
        let { login_id, loginname, loginrole, loginemail, user_id, handler_user_id, username, handler_username, title, deskripsi, priority, status, email } = req.body
        //[user_id, handler_user_id, username, handler_username, title, deskripsi, priority, status, id]
        value.user_id = user_id
        value.username = username
        value.title = title
        value.deskripsi = deskripsi
        value.priority = priority
        value.status = status
        value.handler_user_id = handler_user_id
        value.handler_username = handler_username
        value.updated_at = new Date().toLocaleString()
        var contentemail = 'Ticket with ID: ' + value.id + 'has been updated by ' + loginname + '(' + loginrole + ')\n' +
          "Requester: " + value.username + "\n" +
          "Title: " + value.title + "\n" +
          "Deskripsi: " + value.deskripsi + "\n" +
          "Priority: " + value.priority + "\n" +
          "Status: " + value.status + "\n" +
          "Created at: " + value.created_at + "\n" +
          "Updated at: " + value.updated_at + "\n"
        var editmail = {
          from: 'isupport-kelompok3',
          to: email,
          subject: 'Ticket with ID: ' + value.id + ' has been updated',
          text: contentemail
        }
        transporter.sendMail(editmail, function (error, info) {
          if (error) {
            console.log(error);
            //res.json({ status: "ERR", message: error })
          } else {
            console.log('Email for user sent: ' + info.response);
            var editmailagent = {
              from: 'isupport-kelompok3',
              to: loginemail,
              subject: 'Ticket with ID: ' + value.id + ' has been updated',
              text: contentemail
            }
            transporter.sendMail(editmailagent, function (error, info) {
              if (error) {
                console.log(error);
                //res.json({ status: "ERR", message: error })
              } else {
                console.log('Email for agent sent: ' + info.response);
                return res.status(201).json(value)
                //res.json({ status: "OK", message: info.response })
              }
            })
          }
        });
        break;
      }
      else {
        i++
      }
    }
    if (i == TICKETS.length) {
      return res.status(200).json("");
    }
  }
});

router.delete('/tickets/:id', verifyToken, async (req, res, next) => {

  const use_db = (USE_DB === 'true')
  console.log("use_db: " + use_db)
  if (use_db) {
    try {
      const client = await pool.connect()
      const id = parseInt(req.params.id)
      client.query('DELETE FROM tickets WHERE id = $1', [id], (error, results) => {
        if (error) {
          client.release()
          return res.status(500).json({ result: "Error", message: "Server Error " + error })
        }
        //res.status(200).send(`User deleted with ID: ${id}`)
        client.release()
        return res.status(200).json({ result: "OK", message: "Ticket deleted with ID: " + id })
      })
    }
    catch (e) {
      return res.status(500).json({ result: "Error", message: "Server Error" + e })
    }
  }
  else {
    let i = 0
    let deleted = false;
    while (i < TICKETS.length) {
      const value = TICKETS[i]
      if (parseInt(value.id) == parseInt(req.params.id)) {
        TICKETS.splice(i, 1)
        deleted = true
        res.status(200).json({ result: "OK", message: "Ticket deleted with ID: " + value.id })
        break;
      }
      else {
        i++;
      }
    }
    console.log(deleted)
    if (!deleted) {
      return res.status(200).json({ result: "Err", message: "Ticket with ID: " + req.params.id + " Not Found" })
    }
  }
});

module.exports = router;
