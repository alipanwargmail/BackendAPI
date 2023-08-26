var USERS = require('../../arrayusers.js')

exports.handler = async function (event, context) {


    return {
        statusCode: 200,
        body: JSON.stringify(USERS),
      };
}