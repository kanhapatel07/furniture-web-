import express from "express";

import upload from "../middleware/upload.js";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/", upload.single("productUrl"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("productUrl"), updateProduct);
router.delete("/:id", deleteProduct);


export default router;