import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/user";
import softwareRoutes from "./routes/software";
import requestRoutes from "./routes/request";

dotenv.config();
AppDataSource.initialize().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/software", softwareRoutes);
  app.use("/api/requests", requestRoutes);

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
