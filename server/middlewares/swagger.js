// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    swaggerDefinition: {
        info: {
            title: "ParkingPark API",
            description: "ParkingPark API Information",
            contact: {
                name: "Developer",
            },
            servers: ["http://localhost:4000"],
        },
    },
    apis: ["./routes/user.js"],
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};