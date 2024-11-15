const request = require("supertest");
const app = require("./src/app");
const Restaurant = require("./models/Restaurant");

describe("express validator checks for /post restaurant", () => {
    it("should return error when name isn't passed", async () => {
      // Create new restaurant without 'name'
      const newRestaurant = {
        location: 'Georgia',
        cuisine: 'mexican',
      };
  
      const response = await request(app).post("/restaurants").send(newRestaurant);
  
      // Log the response body to inspect
      console.log(response.body);
  
      // Expect the response status to be 400 (bad request)
      expect(response.status).toBe(400);
  
      // Expect the response body to have an error related to the 'name' field
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: "Name is required",  // Custom error message you set
            path: "name",             // The field that failed (use 'path' instead of 'param')
          })
        ])
      );
    });

    it("should return error when name length is below 10 or above 30", async () => {
        const restaurant1 = {
            name:"Sal's",
            location:"New Jersey",
            cuisine:"Italian",
            createdAt: "2024-11-13T17:25:05.434Z",
            updatedAt: "2024-11-13T17:25:05.434Z"
        }

        const restaurant2 = {
            name:"Salvatore's great big restaurant with lots of food",
            location:"New Jersey",
            cuisine:"Italian",
            createdAt: "2024-11-13T17:25:05.434Z",
            updatedAt: "2024-11-13T17:25:05.434Z"
        }

        //check for below 10 name length
        const response = await request(app).post("/restaurants").send(restaurant1)
        
         //check for below 10 name length
        const response2= await request(app).post("/restaurants").send(restaurant1)

        expect(response.body.error).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Name must be between 10 and 30 characters",  
                path: "name",             
              })
            ])
          );

          expect(response2.body.error).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Name must be between 10 and 30 characters",  
                path: "name",             
              })
            ])
          );
    });
  });
  
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
