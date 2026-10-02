import express from "express";

import {
    getProfile,
    updateProfile,
} from "../controller/profile.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


// GET PROFILE
router.get("/profile", authMiddleware, getProfile);


// UPDATE PROFILE
router.put("/profile", authMiddleware, updateProfile);


export default router;