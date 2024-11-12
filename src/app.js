const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

//TODO: Create your GET Request Route Below: 

app.get('/restaurants', async (req,res) => {
    const allRestaurants = await Restaurant.findAll()

    res.json(allRestaurants)
})

app.get("/restaurants/:id", async (req,res) => {
    const number = req.params.id

    const restaurant = await Restaurant.findByPk(number);

    res.json(restaurant)
})




module.exports = app;