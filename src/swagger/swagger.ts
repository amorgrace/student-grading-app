import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen();

const doc = {
  host: "student-grading-app-ten.vercel.app",
  schemes: ["https", "http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.ts"];

swagger(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger docs generated");
});