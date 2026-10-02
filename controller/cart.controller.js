import db from "../config/db.js";


// ======================================================
// ADD TO CART
// ======================================================

export const addToCart = (req, res) => {

    const userId = req.user?.id;

    const { productId, quantity } = req.body;

    console.log("User ID =", userId);
    console.log("Product ID =", productId);
    console.log("Quantity =", quantity);


    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User ID not found. Please login again."
        });
    }


    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }


    const qty = Number(quantity) || 1;


    // ======================================================
    // GET PRODUCT
    // ======================================================

    const productSql = `
        SELECT
            id,
            name,
            price,
            stock,
            product_image
        FROM products
        WHERE id = ?
    `;


    db.query(
        productSql,
        [productId],
        (err, productResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Product database error",
                    error: err.message
                });
            }


            if (productResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }


            const product = productResult[0];

            // Product price
            const price = Number(product.price);

            // Total = price × quantity
            const total = price * qty;


            // ======================================================
            // CHECK STOCK
            // ======================================================

            if (product.stock < qty) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock"
                });
            }


            // ======================================================
            // CHECK PRODUCT ALREADY IN CART
            // ======================================================

            const cartSql = `
                SELECT
                    id,
                    quantity,
                    price
                FROM cart
                WHERE userId = ?
                AND productId = ?
            `;


            db.query(
                cartSql,
                [userId, productId],
                (err, cartResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Cart database error",
                            error: err.message
                        });
                    }


                    // ==================================================
                    // PRODUCT ALREADY EXISTS
                    // ==================================================

                    if (cartResult.length > 0) {

                        const cartId = cartResult[0].id;

                        const oldQuantity =
                            Number(cartResult[0].quantity);

                        const newQuantity =
                            oldQuantity + qty;


                        // Check stock
                        if (newQuantity > product.stock) {
                            return res.status(400).json({
                                success: false,
                                message: "Not enough stock"
                            });
                        }


                        // New total
                        const newTotal =
                            price * newQuantity;


                        // ==================================================
                        // UPDATE QUANTITY + PRICE + TOTAL
                        // ==================================================

                        const updateSql = `
                            UPDATE cart
                            SET
                                quantity = ?,
                                price = ?,
                                total = ?
                            WHERE id = ?
                            AND userId = ?
                        `;


                        db.query(
                            updateSql,
                            [
                                newQuantity,
                                price,
                                newTotal,
                                cartId,
                                userId
                            ],
                            (err, result) => {

                                if (err) {

                                    console.error(
                                        "UPDATE CART ERROR =",
                                        err
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message: "Failed to update cart",
                                        error: err.message
                                    });
                                }


                                return res.status(200).json({
                                    success: true,
                                    message: "Product quantity updated in cart",

                                    data: {
                                        id: cartId,
                                        userId: userId,
                                        productId: product.id,
                                        quantity: newQuantity,
                                        price: price,
                                        total: newTotal,
                                        name: product.name,
                                        product_image: product.product_image,
                                        stock: product.stock
                                    }
                                });

                            }
                        );

                    }


                    // ==================================================
                    // PRODUCT NOT IN CART
                    // ==================================================

                    else {

                        const insertSql = `
                            INSERT INTO cart
                            (
                                userId,
                                productId,
                                quantity,
                                price,
                                total
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `;


                        db.query(
                            insertSql,
                            [
                                userId,
                                productId,
                                qty,
                                price,
                                total
                            ],
                            (err, result) => {

                                if (err) {

                                    console.error(
                                        "INSERT CART ERROR =",
                                        err
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message: "Failed to add product to cart",
                                        error: err.message
                                    });
                                }


                                return res.status(201).json({
                                    success: true,
                                    message: "Product added to cart",

                                    data: {
                                        id: result.insertId,
                                        userId: userId,
                                        productId: product.id,
                                        quantity: qty,
                                        price: price,
                                        total: total,
                                        name: product.name,
                                        product_image: product.product_image,
                                        stock: product.stock
                                    }
                                });

                            }
                        );

                    }

                }
            );

        }
    );

};



// ======================================================
// GET CART
// ======================================================

export const getCart = (req, res) => {

    const userId = req.user?.id;


    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "User ID not found. Please login again."
        });
    }


    const sql = `
        SELECT
            cart.id,
            cart.userId,
            cart.productId,
            cart.quantity,
            cart.price,
            cart.total,

            products.name,
            products.description,
            products.product_image,
            products.stock,
            products.status

        FROM cart

        INNER JOIN products
            ON cart.productId = products.id

        WHERE cart.userId = ?

        ORDER BY cart.id DESC
    `;


    db.query(
        sql,
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to get cart",
                    error: err.message
                });
            }


            return res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                data: result
            });

        }
    );

};



// ======================================================
// EDIT / UPDATE CART
// ======================================================

export const updateCart = (req, res) => {

    const userId = req.user?.id;

    const { id } = req.params;

    const { quantity } = req.body;


    console.log("User ID =", userId);
    console.log("Cart ID =", id);
    console.log("New Quantity =", quantity);


    // ==================================================
    // CHECK USER
    // ==================================================

    if (!userId) {

        return res.status(401).json({
            success: false,
            message: "User ID not found. Please login again."
        });

    }


    // ==================================================
    // CHECK QUANTITY
    // ==================================================

    if (!quantity || Number(quantity) < 1) {

        return res.status(400).json({
            success: false,
            message: "Quantity must be at least 1"
        });

    }


    const qty = Number(quantity);


    // ==================================================
    // CHECK CART
    // ==================================================

    const checkCartSql = `
        SELECT
            cart.id,
            cart.productId,
            cart.price,
            products.stock

        FROM cart

        INNER JOIN products
            ON cart.productId = products.id

        WHERE cart.id = ?
        AND cart.userId = ?
    `;


    db.query(
        checkCartSql,
        [id, userId],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Cart database error",
                    error: err.message
                });

            }


            // CART NOT FOUND
            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Cart item not found"
                });

            }


            const cartItem = result[0];


            // ==================================================
            // CHECK STOCK
            // ==================================================

            if (qty > cartItem.stock) {

                return res.status(400).json({
                    success: false,
                    message: "Not enough stock"
                });

            }


            // ==================================================
            // CALCULATE TOTAL
            // ==================================================

            const price = Number(cartItem.price);

            const total = price * qty;


            // ==================================================
            // UPDATE QUANTITY + TOTAL
            // ==================================================

            const updateSql = `
                UPDATE cart
                SET
                    quantity = ?,
                    total = ?
                WHERE id = ?
                AND userId = ?
            `;


            db.query(
                updateSql,
                [
                    qty,
                    total,
                    id,
                    userId
                ],
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update cart",
                            error: err.message
                        });

                    }


                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            success: false,
                            message: "Cart item not found"
                        });

                    }


                    return res.status(200).json({
                        success: true,
                        message: "Cart updated successfully",

                        data: {
                            id: id,
                            quantity: qty,
                            price: price,
                            total: total
                        }
                    });

                }
            );

        }
    );

};



// ======================================================
// DELETE CART ITEM
// ======================================================

export const deleteCart = (req, res) => {

    const userId = req.user?.id;

    const { id } = req.params;


    console.log("User ID =", userId);
    console.log("Cart ID =", id);


    if (!userId) {

        return res.status(401).json({
            success: false,
            message: "User ID not found. Please login again."
        });

    }


    const sql = `
        DELETE FROM cart
        WHERE id = ?
        AND userId = ?
    `;


    db.query(
        sql,
        [id, userId],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete cart item",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Cart item not found"
                });

            }


            return res.status(200).json({
                success: true,
                message: "Cart item deleted successfully"
            });

        }
    );

};



// ======================================================
// GET PRODUCT BY ID
// ======================================================

export const getProductById = (req, res) => {

    const { id } = req.params;

    console.log("Product ID =", id);


    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }


    const sql = `
        SELECT
            id,
            name,
            description,
            price,
            stock,
            product_image,
            categoryId,
            status
        FROM products
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.log("GET PRODUCT ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to get product",
                    error: err.message
                });

            }


            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }


            return res.status(200).json({
                success: true,
                message: "Product fetched successfully",
                data: result[0]
            });

        }
    );

};



// ======================================================
// CLEAR CART
// ======================================================

export const clearCart = (req, res) => {

    console.log("========== CLEAR CART ==========");
    console.log("REQ.USER =", req.user);

    const userId = req.user?.id;
    const email = req.user?.email;

    console.log("USER ID =", userId);
    console.log("EMAIL =", email);

    const cartUser = email || userId;

    console.log("CART USER =", cartUser);


    if (!cartUser) {

        return res.status(401).json({
            success: false,
            message: "User information not found"
        });

    }


    const sql = `
        DELETE FROM cart
        WHERE userId = ?
    `;


    db.query(
        sql,
        [cartUser],
        (err, result) => {

            if (err) {

                console.error("DELETE CART ERROR =", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to clear cart",
                    error: err.message
                });

            }


            console.log("DELETE RESULT =", result);

            return res.status(200).json({
                success: true,
                message: "Cart cleared successfully",
                deletedItems: result.affectedRows
            });

        }
    );

};