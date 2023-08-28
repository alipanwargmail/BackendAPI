const db = require('./dbusingpgpromise.js');

exports.handler = async function (event, context) {

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
    console.log(event.httpMethod)
    console.log(process.env.DB_URL)
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

    
    try {
      const result = await db.query('select * from users')
      console.log(result)
      json_msg = result;
    }
    catch (e) {
      json_msg = '{ result: "Error", message: "Server Error" ' + e + ' }'
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