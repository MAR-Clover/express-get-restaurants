const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");
const restaurantRouter = require("../routes/restaurants")

//TODO: Create your GET Request Route Below: 

app.use(express.json());

// Use the restaurantRouter for routes starting with "/restaurants"
app.use("/restaurants", restaurantRouter);




module.exports = app;