import express from "express";
import {
  forgotPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/user.controller.js";
import { isAdmin, requireSignIn } from "../middlewares/user.middleware.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

//router object
const router = express.Router();

//routing

// Register Route - POST /api/v1/user/register
router.post("/register", limiter, registerController);

//LOGIN ROUTE || POST
router.post("/login", limiter, loginController);

//FORGOT PASSWORD || POST
router.post("/forgot-password", forgotPasswordController);

//protected test
router.post("/test", requireSignIn, isAdmin, testController);

//PROTECTED ROUTE AUTH
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//PROTECT ROUTE ADMIN
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//UPDATE PROFILE
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// Create an order route
router.post("/create", requireSignIn, async (req, res) => {
  try {
    const { products, payment } = req.body; // Expecting products and payment details from the request

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    // Create a new order
    const newOrder = new Order({
      products,
      payments: payment, // Save the payment details if available
      buyer: req.user._id, // Store the buyer information
      status: payment ? "Processing" : "Not Processed", // Update based on payment
    });

    // Save the order to the database
    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

export default router;
