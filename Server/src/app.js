import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

// rest object
const app = express();

// Configure dotenv
dotenv.config();

//middleware
app.use(express.json()); // we can use json in req and res
app.use(morgan("dev"));

//rest api
app.get("/", (req, res) => {
  res.send({
    message: "Welcone to Eazy Buy",
  });
});

export default app;
