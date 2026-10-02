
// export const createCategory = async (req, res) => {
//     return res.status(200).json({
//         message:"testing"
//     })
// }

import db from "../config/db.js";

// POST - Create Category
export const createCategory = (req, res) => {

    // const { name, description } = req.body;
    const name = req.body.name;
    const description = req.body.description;

    if (!name) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const sql = `
        INSERT INTO categories (name, description)
        VALUES (?, ?)
    `;

    db.query(sql, [name, description], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        return res.status(201).json({
            message: "Category created successfully",
            categoryId: result.insertId
        });
    });
};


// GET - Get All Categories
export const getCategories = (req, res) => {

    const sql = "SELECT * FROM categories ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        return res.status(200).json({
            message: "Categories fetched successfully",
            categories: result
        });
    });
};


// GET - Get Category By ID
export const getCategoryById = (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM categories WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            category: result[0]
        });
    });
};


// PUT - Update Category
export const updateCategory = (req, res) => {

    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Category name is required"
        });
    }

    const sql = `
        UPDATE categories
        SET name = ?, description = ?
        WHERE id = ?
    `;

    db.query(sql, [name, description, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category updated successfully"
        });
    });
};


// DELETE - Delete Category
export const deleteCategory = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM categories WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    });
};