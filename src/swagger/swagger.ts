import swaggerAutogen from "swagger-autogen";

const swagger = swaggerAutogen();

const isProduction = process.env.NODE_ENV === "production";

const doc = {
  host: isProduction ? "student-grading-app-ten.vercel.app" : "localhost:3000",
  schemes: isProduction ? ["https"] : ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.ts"];

swagger(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger docs generated");
});