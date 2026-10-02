import db from "../config/db.js";

// ======================================================
// CREATE PRODUCT
// ======================================================

export const createProduct = (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
        name,
        description,
        price,
        stock,
        categoryId,
        status
    } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Product name is required"
        });
    }

    if (!description) {
        return res.status(400).json({
            success: false,
            message: "Description is required"
        });
    }

    if (!price) {
        return res.status(400).json({
            success: false,
            message: "Price is required"
        });
    }

    if (!stock) {
        return res.status(400).json({
            success: false,
            message: "Stock is required"
        });
    }

    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: "Category is required"
        });
    }

    let productImage = null;

    if (req.file) {
        productImage =
            "/uploads/products/" + req.file.filename;
    }

    const sql = `
        INSERT INTO products
        (
            product_image,
            name,
            description,
            price,
            stock,
            categoryId,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        productImage,
        name,
        description,
        Number(price),
        Number(stock),
        Number(categoryId),
        status || "ACTIVE"
    ];

    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("CREATE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Product create failed",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                id: result.insertId,
                product_image: productImage,
                name: name,
                description: description,
                price: Number(price),
                stock: Number(stock),
                categoryId: Number(categoryId),
                status: status || "ACTIVE"
            }
        });

    });

};


// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getProducts = (req, res) => {

    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.error("GET ALL ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Products fetch failed",
                error: err.message
            });
        }

        console.log("ALL PRODUCTS:", result);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: result
        });

    });

};


// ======================================================
// GET PRODUCT BY ID
// ======================================================

export const getProductById = (req, res) => {

    const { id } = req.params;

    console.log("REQUESTED PRODUCT ID:", id);

    const sql = `
        SELECT *
        FROM products
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error("GET BY ID ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Product fetch failed",
                error: err.message
            });
        }

        console.log("PRODUCT RESULT:", result);

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

    });

};


// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct = (req, res) => {

    const { id } = req.params;

    const {
        name,
        description,
        price,
        stock,
        categoryId,
        status
    } = req.body;

    console.log("UPDATE ID:", id);
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    if (req.file) {

        const productImage =
            "/uploads/products/" + req.file.filename;

        const sql = `
            UPDATE products
            SET
                product_image = ?,
                name = ?,
                description = ?,
                price = ?,
                stock = ?,
                categoryId = ?,
                status = ?
            WHERE id = ?
        `;

        const values = [
            productImage,
            name,
            description,
            Number(price),
            Number(stock),
            Number(categoryId),
            status || "ACTIVE",
            id
        ];

        db.query(sql, values, (err, result) => {

            if (err) {

                console.error("UPDATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Product update failed",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully"
            });

        });

    } else {

        const sql = `
            UPDATE products
            SET
                name = ?,
                description = ?,
                price = ?,
                stock = ?,
                categoryId = ?,
                status = ?
            WHERE id = ?
        `;

        const values = [
            name,
            description,
            Number(price),
            Number(stock),
            Number(categoryId),
            status || "ACTIVE",
            id
        ];

        db.query(sql, values, (err, result) => {

            if (err) {

                console.error("UPDATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Product update failed",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully"
            });

        });

    }

};


// ======================================================
// DELETE PRODUCT
// ======================================================

export const deleteProduct = (req, res) => {

    const { id } = req.params;

    console.log("DELETE PRODUCT ID:", id);

    const sql = `
        DELETE FROM products
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error("DELETE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Product delete failed",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    });

};