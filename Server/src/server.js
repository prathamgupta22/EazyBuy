import app from "./app.js";
import connectDB from "./config/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ` + process.env.PORT + " 🚀");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
    process.exit(1);
  });
