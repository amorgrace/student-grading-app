import express, { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./modules/authentication/auth.routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger-output.json' with { type: 'json' };
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  })
)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes);


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export { app, prisma };
