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
    origin: "http://localhost:5173", // Replace with your frontend origin
  })
);
app.use(express.json()); // Enable JSON parsing
app.use(morgan("dev")); // HTTP request logging

// Serve static files for product photos with CORS headers
app.use(
  "/api/v1/product/product-photo",
  express.static("path/to/images", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173"); // Adjust origin as needed
    },
  })
);

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
