const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");
const restaurantRouter = require("../routes/restaurants")


app.use(express.json());

app.use("/restaurants", restaurantRouter);


module.exports = app;