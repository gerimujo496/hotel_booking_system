const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Hotel Booking API",
    version: "1.0.0",
    description: "API documentation for the Hotel Booking System",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "../swaggerSchema.js",
    "./modules/auth/auth.router.js",
    "./modules/manager/manager.router.js",
    "./modules/booking/booking.router.js",
    "./modules/room/*.js",

    ,
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
