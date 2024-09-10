import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// Initialize Express app
const app = express();

// Configure dotenv
dotenv.config();

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(
  cors({
    credentials: true,
    origin: "*", // Allow all origins
  })
);
app.use(express.json()); // Enable JSON parsing
app.use(morgan("dev")); // HTTP request logging

// Basic route
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Eazy Buy",
  });
});

// Import and use routes
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Export app
export default app;
