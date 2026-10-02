import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =====================================================
// REGISTER
// =====================================================

export const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            mobile,
            gender
        } = req.body;

        console.log("Register data:", req.body);

        // Check fields
        if (!name || !email || !password || !mobile || !gender) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check email already exists
        const checkUser = "SELECT * FROM users WHERE email = ?";

        db.query(checkUser, [email], async (err, result) => {

            if (err) {
                console.log("SELECT ERROR:", err);

                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            // Email already registered
            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const sql = `
                INSERT INTO users
                (name, email, password, mobile, gender)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    name,
                    email,
                    hashedPassword,
                    mobile,
                    gender
                ],
                (err, result) => {

                    if (err) {
                        console.log("INSERT ERROR:", err);

                        return res.status(500).json({
                            message: "Registration failed",
                            error: err.message
                        });
                    }

                    return res.status(201).json({
                        message: "Registration successful",
                        userId: result.insertId
                    });
                }
            );
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================================
// LOGIN
// =====================================================

export const login = (req, res) => {

    const {
        email,
        password
    } = req.body;

    // Check fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Find user
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            console.log("LOGIN DATABASE ERROR:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // User not found
        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.email
                ,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender
            }
        });
    });
};