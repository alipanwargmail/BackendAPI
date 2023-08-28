const pgp = require('pg-promise')
const db = pgp({
    'host': 'floppy.db.elephantsql.com',
    'database': 'ixiihrnc',
    'user': 'ixiihrnc',
    'password': 'HP06So35UiQcqRXFXVlUZ6Us8NNZC5gH',
    'port': 5432
})

module.exports = db