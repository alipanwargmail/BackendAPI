

const initOptions = {

    // pg-promise initialization options...

    connect(e) {
        const cp = e.client.connectionParameters;
        console.log('Connected to database:', cp.database);
    }

};
const pgp = require('pg-promise')(initOptions)
const db = pgp({
    "DATABASE": "postgres://ixiihrnc:HP06So35UiQcqRXFXVlUZ6Us8NNZC5gH@floppy.db.elephantsql.com:5432/ixiihrnc"
})

module.exports = db