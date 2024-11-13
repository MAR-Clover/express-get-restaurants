const request = require("supertest");
const app = require("./src/app");
const Restaurant = require("./models");


describe("verifying get route for restaurant", () => {
    it("should return status code of 200", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.statusCode).toBe(200);
    });

    it("should return an array of restaurants", async () => {
        const response = await request(app).get("/restaurants");
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(restaurant => {
            expect(restaurant).toHaveProperty("name");
        });
    });

    it("should return correct length of restaurants", async () => {
        const response = await request(app).get("/restaurants");
        const restaurants = await Restaurant.findAll();
        expect(response.body.length).toBe(restaurants.length);
    });

    it("should return the correct data", async () => {
        const response = await request(app).get("/restaurants");
        const expected = await Restaurant.findAll();
        const expectedData = JSON.parse(JSON.stringify(expected))

        expect(response.body).toMatchObject(expectedData)
        expect(response.status).toBe(200)
    });
    

    it("get restaurant/:id returns correct data", async () => {
        const restaurantbyID = await Restaurant.findByPk(2);
        const response = await request(app).get("/restaurants/2");

        expect(response.body.name).toBe(restaurantbyID.name);
        expect(response.body.location).toBe(restaurantbyID.location);
        expect(response.body.cuisine).toBe(restaurantbyID.cuisine);
    });
});

//- Test that. POST /restaurants request returns the restaurants array has been updated with the new value
describe("POST /restaurants request returns the restaurants array has been updated with the new value", () => {
    
    it("should return array with new value", async () => {
        // New restaurant to be added
        const newRest = {
            name: "McDonald's",
            location: "California",
            cuisine: "Fast Food"
        };

        const response = await request(app).post("/restaurants").send(newRest);

        const newRestArray = await Restaurant.findAll();

        expect(response.status).toBe(201);

        // make sure last entry in the response matches the new restaurant
        const lastAddedRestaurant = newRestArray[newRestArray.length - 1];
        expect(lastAddedRestaurant.name).toBe(newRest.name);
        expect(lastAddedRestaurant.location).toBe(newRest.location);
        expect(lastAddedRestaurant.cuisine).toBe(newRest.cuisine);
    });
});


describe(" PUT /restaurants/:id request updates the restaurant array with the provided value", () =>{
    
    it("should update array with new value", async () => {
        const response = await request(app).put("/restaurants/1").send({"name":"jack in the box"})
        const expected = await Restaurant.findAll()
        const expectedData = JSON.parse(JSON.stringify(expected))
        expect(response.body).toEqual(expectedData)
    })

})
describe("DELETE /restaurants/:id request deletes the restaurant in the array with the provided value", () => {
    it("should delete the restaurant with the given id", async () => {

        //must create new restaurant to delete
        const newRestaurant = await Restaurant.create({
            id: 999,  // Explicitly set an ID for this test, using existing ID can cause issue when running test multiple times
            name: "Test Restaurant",
            location: "Test Location",
            cuisine: "Test Cuisine"
        });
        const initialRestArray = await Restaurant.findAll();

        await request(app).delete("/restaurants/999"); 

        const newRestArray = await Restaurant.findAll();

        expect(newRestArray.length).toBe(initialRestArray.length - 1);
    });
});
