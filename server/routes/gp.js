const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Get all
routes.route("/gp/").get(async function (req, response) {
    let db_connect = dbo.getDb();

    try {
        var records = await db_connect
            .collection("gp")
            .find({})
            .toArray();
        response.json(records);
    } catch (e) {
        console.log("An error occurred pulling the records. " + e);
    }

});


module.exports = routes;