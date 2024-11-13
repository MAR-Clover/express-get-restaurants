const request = require("supertest");
const app = require("./src/app");
const Restaurant = require("./models");
const sequelize = require("./models").sequelize;

// Minimal setup/teardown
beforeAll(async () => {
    await sequelize.authenticate();
});

afterAll(async () => {
    await sequelize.close();
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

    // Simplified correct data test
    it("should return the correct data", async () => {
        const response = await request(app).get("/restaurants");
        const expected = await Restaurant.findAll()
        expect(response.body).toMatchObject(expected);
    });

    it("get restaurant/:id returns correct data", async () => {
        const restaurantbyID = await Restaurant.findByPk(2);
        const response = await request(app).get("/restaurants/2");

        expect(response.body.name).toBe(restaurantbyID.name);
        expect(response.body.location).toBe(restaurantbyID.location);
        expect(response.body.cuisine).toBe(restaurantbyID.cuisine);
    });
});

// Rest of the tests remain the same...