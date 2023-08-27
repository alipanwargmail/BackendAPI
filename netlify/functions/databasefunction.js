const { Pool } = require('pg')

const pg = new Pool({
    user: "ixiihrnc",
	host: "floppy.db.elephantsql.com",
	database: "ixiihrnc",
	password: "HP06So35UiQcqRXFXVlUZ6Us8NNZC5gH",
	max: 100,
	port: 5432,
	ssl: false
})

module.exports = pg;