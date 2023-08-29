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
    process.env.DB_URL
)

module.exports = db