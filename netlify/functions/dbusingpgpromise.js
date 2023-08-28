

const initOptions = {

    error: function (error, e) {
        if (e.cn) {
            // A connection-related error;
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);
        }
    }

};
const pgp = require('pg-promise')(initOptions)
const db = pgp(
    "postgres://ixiihrnc:HP06So35UiQcqRXFXVlUZ6Us8NNZC5gH@floppy.db.elephantsql.com:5432/ixiihrnc"
)

module.exports = db