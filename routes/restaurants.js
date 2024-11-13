const express = require("express");
const router = express.Router();
const {Restaurant, Menu, Item} = require("../models/index")

// Define your Express router to be able to handle creating, reading, updating, and deleting resources from your Restaurants database.

//reading all restaurants
router.get("/", async (req,res) => {

    try{
        const allRestaurants = await Restaurant.findAll({
            include: [
                {
                    model: Menu, 
                    include: [
                        {
                            model: Item, 
                            through: { MenuItem: [] }, 
                        },
                    ],
                },
            ],
        });
        
        
        // const allRestaurants = await Restaurant.findAll()
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
router.post("/", async (req, res) => {
    // Use req.body to add to the Restaurant db
    try {
        // Create new restaurant
        const newRest = await Restaurant.create(req.body);

        // Fetch all restaurants after creation
        const newRestaurants = await Restaurant.findAll();

        // Send response with new restaurant and updated list
        res.status(201).json({
            message: "New restaurant created successfully",
            data: newRest,
            allRestaurants: newRestaurants
        });
    } catch (e) {
        // Handle errors
        res.status(500).json({ message: "Error creating restaurant", error: e.message });
    }
});


//updating restaurant
router.put("/:id", async (req, res) => {
    try {
        await Restaurant.update(req.body, { where: { id: req.params.id } });

        const restaurants = await Restaurant.findAll();

       // res.status(200)
        res.json(restaurants)
    } catch (e) {
        res.status(500).json({ message: "Error updating restaurant", error: e.message });
    }
});


//deleting restaurant
router.delete("/:id", async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.destroy({
            where: { id: req.params.id }
        });

        if (deletedRestaurant === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const restaurants = await Restaurant.findAll();

        res.status(200).json(restaurants);
    } catch (e) {
        // Handle any errors that occur
        res.status(500).json({ message: "Error deleting restaurant", error: e.message });
    }
});


module.exports = router