import express from "express";
import {
  loginController,
  registerController,
  testController,
} from "../controllers/user.controller.js";
import { isAdmin, requireSignIn } from "../middlewares/user.middleware.js";

//router object
const router = express.Router();

//routing

// Register Route - POST /api/v1/user/register
router.post("/register", registerController);

//LOGIN ROUTE || POST
router.post("/login", loginController);

//protected test
router.post("/test", requireSignIn, isAdmin, testController);

//PROTECTED ROUTE AUTH
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
