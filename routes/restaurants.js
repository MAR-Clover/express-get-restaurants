const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant")

// Define your Express router to be able to handle creating, reading, updating, and deleting resources from your Restaurants database.

//reading all restaurants
router.get("/", async (req,res) => {
    try{
        const allRestaurants = await Restaurant.findAll()
        res.status(200)
        res.json(allRestaurants)
        
    }catch(e){
        res.status(400).json({message:"Cannot retrieve restaurants", error:e.message})
    }

})

//get specific restaurant by id
router.get("/:id", async (req,res) => {
    try{
        const requestedRestaurant = await Restaurant.findByPk(req.params.id)
        res.json(requestedRestaurant)
    }catch(e){
        res.status(400).json({message:"Cannot retrieve restaurant", error:e.message})
    }

})

//creating restaurant
router.post("/", async (req,res) => {
    //use req.body to add to Restaurant db
    try{
        const newRest = await Restaurant.create(req.body)
        res.status(201).json({
            message: "New restaurant created successfully",
            data: newRest
        });
        const newRestaurants = await Restaurant.findAll()
        res.json(newRestaurants)
    }catch(e){
        res.status(500).json({ message: "Error creating restaurant", error: e.message });
    }
})

//updating restaurant
router.put("/:id", async (req,res) => {
    try{
        const updatedRestaurant = Restaurant.update(req.body, {where:{id:req.params.id}})

        //send new restaurants array with updated value
        const restaurants = await Restaurant.findAll()
        res.json(restaurants)
    }catch(e){
        res.send("error updating restaurant")
    }
})

//deleting restaurant
router.delete("/:id", async (req,res) => {
    try{
        await Restaurant.destroy({where:{id:req.params.id}})
    }catch(e){
        res.send("error deleting restaurant")
    }
})

module.exports = router