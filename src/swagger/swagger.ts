
import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen();

const doc = {
  info: {
    title: "Student Grading API",
    description: "API documentation",
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.ts"];

swagger(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger docs generated");
});