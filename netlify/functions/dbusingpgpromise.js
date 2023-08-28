const pgp = require('pg-promise')
const db = pgp({
    'DATABASE': 'postgres://ixiihrnc:HP06So35UiQcqRXFXVlUZ6Us8NNZC5gH@floppy.db.elephantsql.com:5432/ixiihrnc'
})

module.exports = db