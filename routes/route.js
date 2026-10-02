import express from "express";
 

import authRoute from "./auth.route.js";
import categoryRoute from "./category.route.js";
import userRoute from "./user.route.js"
import productRoute from "./product.route.js";
import addToCart from "./cart.route.js";
import orderRoute from "./order.route.js";
import profileRoute from "./profile.route.js"


const router = express.Router();

router.use("/auth", authRoute);
router.use("/category", categoryRoute);
router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/cart", addToCart);
router.use("/order", orderRoute);
router.use("/auth", profileRoute);


export default router; 
 


