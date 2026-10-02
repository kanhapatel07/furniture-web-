import express from "express";

import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.put("/:id", updateOrder);

export default router;
