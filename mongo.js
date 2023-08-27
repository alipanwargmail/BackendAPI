const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://isupportdba:9JySYE3rdLrFOCYR@cluster0.y4yqs9n.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://alipanwar:5Xs2by2Td0JlZgGp@cluster0.y4yqs9n.mongodb.net/isupport-mongodb?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true, 
  },
});

module.exports=client