import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen();

const doc = {
  info: {
    title: "Student Grading API",
    description: "API documentation",
  },
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT Bearer token for authentication",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.ts"];

swagger(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger docs generated");
});
