import express, { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./modules/authentication/auth.routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger/swagger-output.json' with { type: 'json' };
import cors from "cors"
import userRoutes from "./modules/user/user.routes.js";
import teacherRoutes from "./modules/teacher/teacher.routes.js"


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://student-grading-app-ten.vercel.app",
      "https://sbm-jade.vercel.app",
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const swaggerDocument = JSON.parse(JSON.stringify(swaggerDoc));
  swaggerDocument.host = process.env.NODE_ENV === "production"
    ? "student-grading-app-ten.vercel.app"
    : "localhost:3000";
  swaggerDocument.schemes = process.env.NODE_ENV === "production"
    ? ["https"]
    : ["http"];

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js",
  ]
}));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teacher", teacherRoutes)

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/api/docs`);
  });
}

export default app;