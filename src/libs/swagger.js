// // src/lib/swagger.js
// import { swaggerJsdoc } from "swagger-jsdoc";
import { createSwaggerSpec } from "next-swagger-doc";

const customerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Customer API",
      version: "1.0.0",
      description:
        "This is the API documentation for the Customer side of the Ecommerce and Style Web Next.js project",
    },
  },
  apis: ["src/apis/customer/**/*.{js,ts,jsx,tsx}"], // Ensure this path is correct
};

const adminOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin API",
      version: "1.0.0",
      description:
        "This is the API documentation for the Admin side of the Ecommerce and Style Web Next.js project",
    },
  },
  apis: ["src/apis/admin/**/*.{js,ts,jsx,tsx}"], // Ensure this path is correct
};

// Generate Swagger specs
const customerSwaggerSpec = createSwaggerSpec(customerOptions);
const adminSwaggerSpec = createSwaggerSpec(adminOptions);

// Log Swagger specs to check
console.log(
  "Customer Swagger Spec:",
  JSON.stringify(customerSwaggerSpec, null, 2)
);
console.log("Admin Swagger Spec:", JSON.stringify(adminSwaggerSpec, null, 2));

// Export both specs
export { customerSwaggerSpec, adminSwaggerSpec };

// import { spec } from "node:test/reporters";
// import { Component } from "react";

export const getAPIDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ecommerce and Style Web Customer API Documentation",
        version: "1.0.0",
        description:
          "This is the API documentation for the Customer side of the Ecommerce and Style Web Next.js project",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  });
  return spec;
};
