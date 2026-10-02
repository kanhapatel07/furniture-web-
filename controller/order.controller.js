
import db from "../config/db.js";


// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = (req, res) => {

    const { address, phone, total } = req.body;

    console.log("Order data:", req.body);

    if (!address || !phone) {

        return res.status(400).json({
            success: false,
            message: "Address and phone are required"
        });

    }

    const status = "PENDING";

    const sql = `
        INSERT INTO orders
        (address, phone, total, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [address, phone, total || 0, status],
        (err, result) => {

            if (err) {

                console.error("Create order error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create order"
                });

            }

            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                orderId: result.insertId,
                total: total || 0,
                status: status
            });

        }
    );
};

// ======================================================
// GET ALL ORDERS
// ======================================================

export const getOrders = (req, res) => {

    const sql = `
        SELECT
            id,
            address,
            phone,
            total,
            status,
            created_at
        FROM orders
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to get orders"
            });

        }

        return res.status(200).json({
            success: true,
            data: result
        });

    });
};


// ======================================================
// GET ORDER BY ID
// ======================================================

export const getOrderById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            address,
            phone,
            total,
            status,
            created_at
        FROM orders
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error("Get order error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to get order"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }

            return res.status(200).json({
                success: true,
                data: result[0]
            });

        }
    );
};


// ======================================================
// UPDATE ORDER
// ======================================================

export const updateOrder = (req, res) => {

    const { id } = req.params;

    const { address, phone, status } = req.body;

    // Allowed order statuses
    const allowedStatus = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
    ];

    // Check required fields
    if (!address || !phone || !status) {

        return res.status(400).json({
            success: false,
            message: "Address, phone and status are required"
        });

    }

    // Check status
    if (!allowedStatus.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid status",
            allowedStatus: allowedStatus
        });

    }

    const sql = `
        UPDATE orders
        SET
            address = ?,
            phone = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [address, phone, status, id],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update order"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }

            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                orderId: id,
                status: status
            });

        }
    );
};

