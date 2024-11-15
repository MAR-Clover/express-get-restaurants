const express = require("express");
const router = express.Router();
const { Restaurant, Menu, Item } = require("../models/index");
const { check, validationResult } = require("express-validator");

// Reading all restaurants
router.get("/", async (req, res) => {
  try {
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

    res.status(200).json(allRestaurants);
  } catch (e) {
    res.status(400).json({ message: "Cannot retrieve restaurants", error: e.message });
  }
});

// Get specific restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const requestedRestaurant = await Restaurant.findByPk(req.params.id);
    if (!requestedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(requestedRestaurant);
  } catch (e) {
    res.status(400).json({ message: "Cannot retrieve restaurant", error: e.message });
  }
});

// Creating a new restaurant
router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Name is required").trim(),
    check("location").not().isEmpty().withMessage("Location is required").trim(),
    check("cuisine").not().isEmpty().withMessage("Cuisine is required").trim(),
    check("name").isLength({min:10,max:30}).withMessage("Name must be between 10 and 30 characters").trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 for bad request if validation fails
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { name, location, cuisine } = req.body;
      // Create a new restaurant
      const newRestaurant = await Restaurant.create({
        name,
        location,
        cuisine,
      });

      // Optionally include related data (Menu, Item, etc.)
      res.status(201).json({
        message: "New restaurant created successfully",
        data: newRestaurant,
      });
    } catch (e) {
      res.status(500).json({ message: "Error creating restaurant", error: e.message });
    }
  }
);

// Updating a restaurant
router.put("/:id", async (req, res) => {
  try {
    await Restaurant.update(req.body, { where: { id: req.params.id } });

    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (e) {
    res.status(500).json({ message: "Error updating restaurant", error: e.message });
  }
});

// Deleting a restaurant
router.delete("/:id", async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.destroy({
      where: { id: req.params.id },
    });

    if (deletedRestaurant === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurants = await Restaurant.findAll();
    res.status(200).json(restaurants);
  } catch (e) {
    res.status(500).json({ message: "Error deleting restaurant", error: e.message });
  }
});

module.exports = router;
