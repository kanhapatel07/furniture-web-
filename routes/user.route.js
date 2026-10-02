import express from "express";

import {
    getUserProfile,
    updateProfile,
    //deleteUser,
    deleteUserById
} from "../controller/user.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);

router.put("/profile", authMiddleware, updateProfile);

//router.delete("/profile", authMiddleware, deleteUser);

router.delete("/:id", authMiddleware, deleteUserById);

export default router;

