const {Restaurant,Menu,Item} = require("./models/index")
const { seedRestaurant, seedMenu, seedItem} = require("./seedData");
const db = require("./db/connection")



// In seed.js: 
// - Import the Menu and Item. 
// - Import the seedMenu and seedItem data. 
// - Update the syncSeed function to bulk create new Menu and Item instances.

const syncSeed = async () => {
    await db.sync({force: true});
    await Restaurant.bulkCreate(seedRestaurant)
    // BONUS: Update with Item and Menu bulkCreate
    await Menu.bulkCreate(seedMenu)
    await Item.bulkCreate(seedItem)


}

syncSeed()