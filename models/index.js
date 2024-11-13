const Restaurant = require('./Restaurant')
const Menu = require('./Menu')
const Item = require('./Item')


// In models/index.js, define the following association: 
// - A Restaurant may have one or more Menu(s), but every Menu has one Restaurant 
// - There are also many Item(s) included in a Menu and an Item can be on many Menus

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)

Menu.belongsToMany(Item, { through: 'MenuItems' });  
Item.belongsToMany(Menu, { through: 'MenuItems' }); 



module.exports = {Restaurant, Menu, Item}