import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen();

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.ts"];

swagger(outputFile, endpointsFiles).then(() => {
  console.log("Swagger docs generated");
});
