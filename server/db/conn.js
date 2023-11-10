
const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db);

let _db;

module.exports = {
  connectToServer: async function (callback) {

    try {
      await client.connect();
      console.log("Successfully connected to MongoDB."); 
    } catch (e) {
      console.error(e);
    }

    _db = client.db("Healthbook");

    return (_db === undefined ? false : true);
  },
  getDb: function () {
    return _db;
  },
};