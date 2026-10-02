 // import express from "express";
// import { createCategory } from "../controller/category.controller.js";


// const router = express.Router();

// router.post("/create", createCategory);


// export default router;  

import express from "express";

import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controller/category.Controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createCategory);

router.get("/create", authMiddleware, getCategories);

router.get("/create/:id", authMiddleware, getCategoryById);

router.put("/create/:id", authMiddleware, updateCategory);

router.delete("/create/:id", authMiddleware, deleteCategory);

export default router;
