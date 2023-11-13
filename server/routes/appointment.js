const express = require("express");
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Get all
routes.route("/appointment").get(async function (req, response) {
    let db_connect = dbo.getDb();

    try {
        var records = await db_connect
            .collection("appointment")
            .find({})
            .toArray();
        response.json(records);
    } catch (e) {
        console.log("An error occurred pulling the records. " + e);
    }

});

//Find appointments
routes.route("/appointment/email=:email").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const email = req.params.email;

    try {
        var appointments = await db_connect
            .collection("appointment")
            .find({ email: email })
            .toArray(); // Convert the cursor to an array

        if (appointments.length >= 0) {
            response.json(appointments);
        } else {
            response.status(404).json({ message: "appointments not found" });
        }
    } catch (e) {
        console.log("An error occurred pulling the appointments. " + e);
        response.status(500).json({ message: "Internal server error" });
    }
});


//Add appointment
routes.route("/appointment/").post(async function (req, response) {
    let db_connect = dbo.getDb();

    try {
        const newappointment = {
            email: req.body.email,
            clinicGP: req.body.clinicGP,
            timeslot: req.body.timeslot,
        };

        const result = await db_connect.collection("appointment").insertOne(newappointment);

        if (result.acknowledged) {
            response.status(201).json({ message: "appointment created successfully" });
        } else {
            response.status(500).json({ message: "appointment creation failed" });
        }
    } catch (e) {
        console.error("Error creating appointment:", e);
        response.status(500).json({ message: "Internal server error" });
    }
});

// Delete an appointment by ID
routes.route("/appointment/delete/:id").delete(async function (req, response) {
    let db_connect = dbo.getDb();
    const id = req.params.id;

    try {
        var appointment = await db_connect
            .collection("appointment")
            .deleteOne({ _id: new ObjectId(id) });

        if (appointment.deletedCount > 0) {
            response.json({ message: "Appointment deleted successfully" });
        } else {
            response.status(404).json({ message: "Appointment not found" });
        }
    } catch (e) {
        console.log("An error occurred deleting the appointment. " + e);
        response.status(500).json({ message: "Internal server error" });
    }
});


module.exports = routes;