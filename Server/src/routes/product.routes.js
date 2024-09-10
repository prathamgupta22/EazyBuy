import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/product.controller.js";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/user.middleware.js";
import Stripe from "stripe";

const key =
  "sk_test_51Pl85d2M0LYmn6s9ohO3x618qmYyhR8qqhKvMDABKWgQrcFKAPrelXqQ2Tl48mkzXAGkOXGpU9V0M3rCZDfoOktN00YWvrB5dQ";

const router = express.Router();
const stripe = new Stripe(key);

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// get products
router.get("/get-product", getProductController);

// single product
router.get("/get-product/:slug", getSingleProductController);

// get photo
// router.get("/product-photo/:pid", productPhotoController);
// Image endpoint
app.get("/product-photo/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).select("photo");
    if (!product) {
      console.error(`Product with ID ${req.params.pid} not found`);
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    if (product.photo && product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      console.error(`Photo for Product with ID ${req.params.pid} not found`);
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.error("Error retrieving photo:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error: error.message,
    });
  }
});

// delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

// Payment route using Stripe
router.post("/payments", async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    // Log products data for debugging
    console.log("Received products:", products);

    const lineItems = products.map((product) => {
      const unitAmount = Math.round(product.price * 100); // Convert dollars to cents

      // Log unit amount and quantity
      console.log(
        `Product: ${product.name}, Unit Amount: ${unitAmount}, Quantity: ${product.quantity}`
      );

      if (unitAmount < 100) {
        throw new Error(
          `Product ${product.name} has a unit amount less than 1 cent.`
        );
      }
      if (product.quantity < 1) {
        throw new Error(`Product ${product.name} has a quantity less than 1.`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: unitAmount,
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({
      error: "Failed to create Stripe session",
      details: error.message,
    });
  }
});

export default router;
