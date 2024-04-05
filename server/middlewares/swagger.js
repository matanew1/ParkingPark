// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "ParkingPark API",
            version: "1.0.0", // version of the API
            description: "ParkingPark API Information",
            contact: {
                name: "Developer",
                email: "matanew1@bardugo.com", // your email
            },
            license: {
                name: "MIT License",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: "http://localhost:4000",
                description: "Local server",
            },
            // add other servers if any
        ],
    },
    apis: ["./routes/*.js"], // files containing annotations as above
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};