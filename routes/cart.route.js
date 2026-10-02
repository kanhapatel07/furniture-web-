import express from "express";

import {
    addToCart,
    getCart,
    updateCart,
    deleteCart,
     clearCart,
    getProductById,
 } from "../controller/cart.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


// ADD TO CART
router.post("/", authMiddleware, addToCart);


// GET CART
router.get("/", authMiddleware, getCart);


// GET PRODUCT BY ID
router.get("/create/:id", authMiddleware, getProductById);


// UPDATE CART
router.put("/:id", authMiddleware, updateCart);

router.delete("/clear",authMiddleware, clearCart);

// DELETE CART
router.delete("/:id", authMiddleware, deleteCart);


export default router;
