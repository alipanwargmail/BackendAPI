const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	max: 100,
	port: process.env.PGPORT,
	ssl: true
})

module.exports = pool;