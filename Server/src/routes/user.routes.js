import express from "express";
import registerController from "../controllers/user.controller.js";

//router object
const router = express.Router();

//routing

// Register Route - POST /api/v1/user/register
router.post("/register", registerController);

export default router;
