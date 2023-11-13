const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Get all
routes.route("/user").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect
      .collection("user")
      .find({})
      .toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }

});

//Find user
routes.route("/user/email=:email").get(async function (req, response) {
  let db_connect = dbo.getDb();
  const email = req.params.email;

  try {
    var user = await db_connect
      .collection("user")
      .findOne({ email: email });

    if (user) {
      response.json(user);
    } else {
      response.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.log("An error occurred pulling the user. " + e);
    response.status(500).json({ message: "Internal server error" });
  }
});

//Add user
routes.route("/user/").post(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    const existingUser = await db_connect.collection("user").findOne({ email: newUser.email });

    if (existingUser) {
      // Email already exists, return an error response
      return response.status(400).json({ message: "Email already taken" });
    }

    const result = await db_connect.collection("user").insertOne(newUser);

    if (result.acknowledged) {
      response.status(201).json({ message: "User created successfully"});
    } else {
      response.status(500).json({ message: "User creation failed" });
    }
  } catch (e) {
    console.error("Error creating user:", e);
    response.status(500).json({ message: "Internal server error" });
  }
});


module.exports = routes;